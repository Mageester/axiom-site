require('dotenv').config();
const express = require('express');
const { chromium } = require("playwright");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const DEFAULT_ALLOWED_ORIGINS = [
    'https://getaxiom.ca',
    'https://www.getaxiom.ca',
    'https://hvac.getaxiom.ca',
    'https://roofing.getaxiom.ca',
    'https://landscaping.getaxiom.ca',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

const allowedOrigins = new Set(
    (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
);

function extractClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
        return forwarded.split(',')[0].trim();
    }
    return req.connection.remoteAddress || req.socket?.remoteAddress || 'unknown';
}

function isAllowedOrigin(origin) {
    if (!origin) return false;
    return allowedOrigins.has(origin);
}

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && isAllowedOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    if (req.method === 'OPTIONS') {
        if (!origin || !isAllowedOrigin(origin)) {
            return res.status(403).json({ error: 'Origin not allowed' });
        }
        return res.status(204).end();
    }

    if (origin && !isAllowedOrigin(origin)) {
        return res.status(403).json({ error: 'Origin not allowed' });
    }

    next();
});

// --- Rate Limiter for Intake ---
const intakeRateLimiter = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 mins
const MAX_REQUESTS = 5;

const cleanRateLimiter = () => {
    const now = Date.now();
    for (const [ip, data] of intakeRateLimiter.entries()) {
        if (now - data.timestamp > RATE_LIMIT_WINDOW) {
            intakeRateLimiter.delete(ip);
        }
    }
};

setInterval(cleanRateLimiter, RATE_LIMIT_WINDOW);

// --- Scrape auth tokens (server-issued) ---
const scrapeAuthTokens = new Map();
const SCRAPE_TOKEN_TTL_MS = 2 * 60 * 1000;
const MAX_ACTIVE_SCRAPE_TOKENS = 500;

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function cleanExpiredScrapeTokens() {
    const now = Date.now();
    for (const [tokenHash, data] of scrapeAuthTokens.entries()) {
        if (!data || data.expiresAt <= now) {
            scrapeAuthTokens.delete(tokenHash);
        }
    }
}

setInterval(cleanExpiredScrapeTokens, 60 * 1000);

function issueScrapeToken({ ip, origin, userAgent }) {
    cleanExpiredScrapeTokens();
    if (scrapeAuthTokens.size >= MAX_ACTIVE_SCRAPE_TOKENS) {
        throw new Error('Scrape auth token store is full');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    scrapeAuthTokens.set(tokenHash, {
        ip,
        origin: origin || '',
        userAgent: userAgent || '',
        expiresAt: Date.now() + SCRAPE_TOKEN_TTL_MS
    });
    return token;
}

function consumeScrapeToken(rawToken, { ip, origin, userAgent }) {
    if (!rawToken) return false;
    cleanExpiredScrapeTokens();
    const tokenHash = hashToken(rawToken);
    const tokenRecord = scrapeAuthTokens.get(tokenHash);
    if (!tokenRecord) return false;
    scrapeAuthTokens.delete(tokenHash);

    if (tokenRecord.ip !== ip) return false;
    if ((tokenRecord.origin || '') !== (origin || '')) return false;
    if ((tokenRecord.userAgent || '') !== (userAgent || '')) return false;
    return true;
}

// --- Scrape endpoint rate limiting / quotas ---
const scrapeRateLimiter = new Map();
const SCRAPE_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const SCRAPE_MAX_REQUESTS_PER_WINDOW = 3;
const SCRAPE_MAX_CONCURRENT_GLOBAL = 2;
const SCRAPE_MAX_CONCURRENT_PER_IP = 1;
const scrapeInFlightByIp = new Map();
let scrapeInFlightGlobal = 0;

function checkScrapeRateLimit(ip) {
    const now = Date.now();
    const existing = scrapeRateLimiter.get(ip);
    if (!existing || now - existing.windowStart > SCRAPE_RATE_WINDOW_MS) {
        scrapeRateLimiter.set(ip, { count: 1, windowStart: now });
        return true;
    }
    if (existing.count >= SCRAPE_MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    existing.count += 1;
    scrapeRateLimiter.set(ip, existing);
    return true;
}

function claimScrapeConcurrency(ip) {
    if (scrapeInFlightGlobal >= SCRAPE_MAX_CONCURRENT_GLOBAL) return false;
    const currentIpCount = scrapeInFlightByIp.get(ip) || 0;
    if (currentIpCount >= SCRAPE_MAX_CONCURRENT_PER_IP) return false;
    scrapeInFlightGlobal += 1;
    scrapeInFlightByIp.set(ip, currentIpCount + 1);
    return true;
}

function releaseScrapeConcurrency(ip) {
    scrapeInFlightGlobal = Math.max(0, scrapeInFlightGlobal - 1);
    const currentIpCount = scrapeInFlightByIp.get(ip) || 0;
    if (currentIpCount <= 1) scrapeInFlightByIp.delete(ip);
    else scrapeInFlightByIp.set(ip, currentIpCount - 1);
}

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_PORT === "465",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

app.post('/api/intake', async (req, res) => {
    try {
        // --- DEBUG: Log raw incoming payload ---
        console.log('[INTAKE] Content-Type:', req.headers['content-type']);
        console.log('[INTAKE] Raw req.body:', JSON.stringify(req.body, null, 2));

        // Guard: If body parser failed or Content-Type is wrong, req.body will be undefined
        if (!req.body || typeof req.body !== 'object') {
            console.error('[INTAKE] CRITICAL: req.body is undefined or not an object. Check Content-Type header.');
            return res.status(400).json({
                error: 'Malformed request',
                details: 'Request body is empty or not valid JSON. Ensure Content-Type: application/json is set.'
            });
        }

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
        const now = Date.now();

        let rateData = intakeRateLimiter.get(ip);
        if (!rateData || (now - rateData.timestamp) > RATE_LIMIT_WINDOW) {
            rateData = { count: 0, timestamp: now };
        }

        if (rateData.count >= MAX_REQUESTS) {
            return res.status(429).json({ error: "Rate limit exceeded. Try again in 15 minutes." });
        }

        rateData.count++;
        intakeRateLimiter.set(ip, rateData);

        const body = req.body || {};

        // Accept both camelCase (frontend) and snake_case (legacy) keys
        const name = body.name || '';
        const email = body.email || '';
        const business_name = body.business_name || body.businessName || '';
        const phone = body.phone || '';
        const current_website = body.current_website || body.websiteUrl || body.website || '';
        const project_scale = body.project_scale || body.projectScale || '';
        const details = body.details || '';
        const primary_goal = body.primary_goal || body.primaryGoal || '';
        const company_fax = body.company_fax || body.companyFax || '';
        const source_path = body.source_path || body.sourcePath || '';

        // Parse pain_points: accept string, array, or undefined
        let rawPainPoints = body.pain_points || body.painPoints || '';
        let painPointsList = [];
        if (Array.isArray(rawPainPoints)) {
            painPointsList = rawPainPoints.map(p => String(p).trim()).filter(p => p.length > 0);
        } else if (typeof rawPainPoints === 'string' && rawPainPoints.trim().length > 0) {
            painPointsList = rawPainPoints.split(',').map(p => p.trim()).filter(p => p.length > 0);
        }

        if (company_fax) {
            // Honeypot tripped, return fake success
            return res.status(200).json({ success: true });
        }

        if (!name || !email) {
            console.warn('[INTAKE] Validation failed. name:', name, 'email:', email);
            return res.status(400).json({ error: "Name and email are required.", details: `Received name='${name}', email='${email}'` });
        }

        let scaleText = project_scale ? project_scale.toUpperCase() : "AUDIT REQUEST";
        let titleLine = business_name || current_website || name;

        const subjectLine = `[NEW LEAD] - ${scaleText} - ${titleLine}`;

        let painPointsHtml = "<em>None selected</em>";
        if (painPointsList.length > 0) {
            painPointsHtml = `<ul>${painPointsList.map(p => `<li>${p}</li>`).join('')}</ul>`;
        }

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px;">
                <h2 style="color: #0B0B0C; border-bottom: 2px solid #5a729b; padding-bottom: 8px;">Axiom Infrastructure Request</h2>
                
                <h3 style="margin-top: 24px;">Lead Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 4px 0; width: 150px;"><strong>Name:</strong></td><td>${name}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Phone:</strong></td><td>${phone || 'N/A'}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Business:</strong></td><td>${business_name || 'N/A'}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Website:</strong></td><td>${current_website ? `<a href="${current_website}">${current_website}</a>` : 'N/A'}</td></tr>
                </table>

                <h3 style="margin-top: 24px;">Project Scope</h3>
                <p><strong>Scale/Goal:</strong> ${project_scale || primary_goal || 'N/A'}</p>
                <p><strong>Source:</strong> ${source_path || 'N/A'}</p>
                
                <p style="margin-top: 16px;"><strong>Identified Pain Points:</strong></p>
                ${painPointsHtml}

                <h3 style="margin-top: 24px;">Technical Details / Notes</h3>
                <div style="background-color: #f4f4f4; padding: 16px; border-radius: 4px; white-space: pre-wrap;">${details || 'No details provided.'}</div>
                
                <p style="margin-top: 32px; font-size: 12px; color: #666;">Generated by the Omniscient Routing Engine.</p>
            </div>
        `;

        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            console.warn("[WARNING] SMTP credentials not fully configured. Logging email instead.");
            console.log("SUBJECT:", subjectLine);
            console.log("BODY:", htmlBody);
            // Return success to the client regardless so the UI workflow functions normally.
            return res.status(200).json({ success: true, mocked: true });
        }

        await transporter.sendMail({
            from: `"Axiom Engine" <${process.env.SMTP_USER}>`,
            to: 'aidan@getaxiom.ca', // Target Destination
            replyTo: email,
            subject: subjectLine,
            html: htmlBody
        });

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("[!] Intake Processing Error:", error);
        res.status(500).json({ error: "Internal server error connecting to mailing engine." });
    }
});

app.post('/api/scrape/token', (req, res) => {
    try {
        const origin = req.headers.origin || '';
        if (!origin || !isAllowedOrigin(origin)) {
            return res.status(403).json({ error: "Forbidden: Origin not allowed for scrape token issuance" });
        }

        const ip = extractClientIp(req);
        const userAgent = req.headers['user-agent'] || 'unknown';
        const token = issueScrapeToken({ ip, origin, userAgent });
        return res.status(200).json({ token, expires_in_ms: SCRAPE_TOKEN_TTL_MS });
    } catch (error) {
        return res.status(503).json({ error: "Unable to issue scrape token. Please retry." });
    }
});

app.get('/api/scrape', async (req, res) => {
    const { niche, city } = req.query;
    const radius = req.query.radius || "10";
    const maxDepth = Math.min(20, Math.max(1, parseInt(req.query.maxDepth || "5", 10)));
    const apiKey = process.env.GEMINI_API_KEY;
    const ip = extractClientIp(req);
    const origin = req.headers.origin || '';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const authHeader = req.headers.authorization || '';
    const bearerToken = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : '';
    const tokenOk = consumeScrapeToken(bearerToken, { ip, origin, userAgent });
    if (!tokenOk) {
        return res.status(401).json({ error: "Unauthorized: Invalid or expired scrape auth token" });
    }

    if (!checkScrapeRateLimit(ip)) {
        return res.status(429).json({ error: "Rate limit exceeded for scrape operations." });
    }

    if (!claimScrapeConcurrency(ip)) {
        return res.status(429).json({ error: "Scrape quota exceeded. Please wait for active jobs to finish." });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    let browser = null;
    let isStreamActive = true;
    let concurrencyReleased = false;

    const releaseConcurrencyOnce = () => {
        if (concurrencyReleased) return;
        concurrencyReleased = true;
        releaseScrapeConcurrency(ip);
    };

    req.on('close', async () => {
        console.log(`[🛑] Client disconnected. Aborting scrape for ${city}...`);
        isStreamActive = false;
        releaseConcurrencyOnce();
        if (browser) {
            try {
                await browser.close();
                browser = null;
            } catch (e) {
                console.error("Error closing browser on disconnect:", e);
            }
        }
    });

    try {
        if (!niche || !city) {
            throw new Error("Missing niche or city text");
        }

        const csvPath = `C:\\Users\\riley\\.gemini\\antigravity\\scratch\\Lead_Database_No_Site.csv`;
        const csvHeaders = [
            { id: "Business_Name", title: "Business_Name" },
            { id: "Niche", title: "Niche" },
            { id: "City", title: "City" },
            { id: "Category", title: "Category" },
            { id: "Address", title: "Address" },
            { id: "Phone", title: "Phone" },
            { id: "Email", title: "Email" },
            { id: "Owner_Name", title: "Owner_Name" },
            { id: "Social_Link", title: "Social_Link" },
            { id: "Review_Count", title: "Review_Count" },
            { id: "Rating", title: "Rating" },
            { id: "Target_Note", title: "Target_Note" }
        ];

        // Ensure directory exists
        const dir = path.dirname(csvPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const fileExists = fs.existsSync(csvPath);
        const csvWriter = createObjectCsvWriter({
            path: csvPath,
            header: csvHeaders,
            append: fileExists
        });

        browser = await chromium.launch({ headless: true });
        const browserContext = await browser.newContext({ locale: "en-CA" });
        const page = await browserContext.newPage();

        sendEvent({ message: `[🚀] Starting ENGINE V2 Scrape: ${niche} in ${city} (Radius: ${radius}km)` });

        const query = `${niche} in ${city}, Ontario`;
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}`);

        try {
            await page.waitForSelector("div[role='feed']", { timeout: 15000 });
        } catch (e) {
            throw new Error("Maps results timed out. No targets found.");
        }

        sendEvent({ message: `[🌐] Injecting infinite scroll bypass...` });

        let lastHeight = 0;
        let scrollAttempts = 0;
        while (scrollAttempts < maxDepth) {
            if (!isStreamActive) return;
            const newHeight = await page.evaluate(() => {
                const feed = document.querySelector('div[role="feed"]');
                if (feed) {
                    feed.scrollBy(0, 5000);
                    return feed.scrollHeight;
                }
                return 0;
            });
            if (newHeight === lastHeight) break;
            lastHeight = newHeight;
            scrollAttempts++;
            await new Promise(r => setTimeout(r, 1500));
            sendEvent({ message: `[⬇️] Diving deeper... (Depth: ${scrollAttempts})` });
        }

        const htmlListings = await page.locator("div[role='feed'] > div:has(div.fontHeadlineSmall)").evaluateAll((elements) => {
            return elements.map(el => {
                const titleEl = el.querySelector("div.fontHeadlineSmall");
                let webBtn = el.querySelector('a[data-value="Website"]');
                if (!webBtn) {
                    webBtn = Array.from(el.querySelectorAll('a')).find(a => a.innerText && a.innerText.toLowerCase().includes("website")) || null;
                }
                return {
                    businessName: titleEl ? titleEl.textContent?.trim() || "" : "",
                    website: webBtn ? webBtn.getAttribute("href") || "" : "",
                    html: el.innerHTML,
                    text: el.innerText
                }
            });
        });

        sendEvent({ message: `[🔍] Initial Payload: ${htmlListings.length} raw map nodes found. Extracting target data...` });

        const targets = [];
        for (let i = 0; i < htmlListings.length; i++) {
            const { businessName, website, html, text } = htmlListings[i];
            if (!businessName) continue;

            let rating = 0; let reviewCount = 0; let phone = ""; let address = ""; let category = "";

            const ratingMatch = text.match(/(\d\.\d)(?:\s*\(([\d,]+)\))?/);
            if (ratingMatch) {
                rating = parseFloat(ratingMatch[1]);
                if (ratingMatch[2]) {
                    reviewCount = parseInt(ratingMatch[2].replace(',', ''), 10);
                }
            }

            const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
            if (phoneMatch) phone = phoneMatch[0];

            const lines = text.split('\n').filter(l => l.trim().length > 0);
            if (lines.length > 2) {
                const catAdd = lines[2].split('·');
                if (catAdd.length > 0) category = catAdd[0].trim();
                if (catAdd.length > 1) address = catAdd.slice(1).join('·').trim();
            }

            targets.push({ businessName, website, rating, reviewCount, phone, category, address });
        }

        sendEvent({ message: `[🎯] Perfect Targets Acquired: ${targets.length}` });

        const genAI = new GoogleGenerativeAI(apiKey || "");
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-pro",
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
            ]
        });

        let savedCount = 0;

        for (const target of targets) {
            if (!isStreamActive) return;
            sendEvent({ message: `[⚙️] Deep Enriching: ${target.businessName}...` });
            const searchPage = await browserContext.newPage();
            let rawFootprint = "";
            let email = "";
            let ownerName = "";
            let socialLink = "";
            let websiteStatus = "MISSING";

            try {
                if (target.website) {
                    websiteStatus = "ACTIVE";
                    sendEvent({ message: `[🌐] Scanning Website Target: ${target.website.substring(0, 40)}...` });
                    await searchPage.goto(target.website, { waitUntil: "domcontentloaded", timeout: 15000 });
                    rawFootprint = await searchPage.locator("body").innerText();
                    const allLinks = await searchPage.locator("a").evaluateAll(a => a.map(n => n.getAttribute("href")).filter(h => h && h.startsWith('http')));
                    rawFootprint += "\n\nDISCOVERED LINKS:\n" + allLinks.join('\n');
                } else {
                    sendEvent({ message: `[🔍] No website detected. Searching footprint...` });
                    const sQuery = `"${target.businessName}" ${city} email OR owner OR facebook OR linkedin`;
                    await searchPage.goto(`https://www.google.com/search?q=${encodeURIComponent(sQuery)}`, { waitUntil: "domcontentloaded" });
                    await searchPage.waitForSelector("#search", { timeout: 10000 });
                    rawFootprint = await searchPage.locator("#search").innerText();
                    const allLinks = await searchPage.locator("#search a").evaluateAll(a => a.map(n => n.getAttribute("href")).filter(h => h && h.startsWith('http')));
                    rawFootprint += "\n\nDISCOVERED LINKS:\n" + allLinks.join('\n');
                }
            } catch (err) {
                // Ignore timeout
            } finally {
                await searchPage.close();
            }

            let tacticalNote = "No intelligence generated.";

            if (apiKey) {
                try {
                    const prompt = websiteStatus === "ACTIVE" ?
                        `You are an elite B2B data analyzer. You are evaluating a local business website.\nBusiness Name: ${target.businessName}\nLocation: ${city}\nCategory: ${target.category}\nWebsite URL: ${target.website}\n\nWEBSITE TEXTUAL CONTENT & LINKS:\n${rawFootprint.substring(0, 15000)}\n\nYour objective is to meticulously parse this website content to extract identifiers and evaluate its quality.\nReturn strictly a JSON object (no markdown formatting, no \`\`\`json wrappers) with exactly these keys:\n{\n  "email": "Extract any valid contact email found. Leave empty string if none.",\n  "ownerName": "Identify the owner, founder, or contact person. Leave empty if none.",\n  "socialLink": "Extract their best social media link (Facebook, IG, LinkedIn). Leave empty if none.",\n  "tacticalPitch": "A 1 to 2 sentence critical evaluation of the website's quality, content depth, structure, and any obvious missing elements (like poor copy, no clear call-to-action). Provide a label at the start like '[Website Status: Poor] - '."\n}`
                        :
                        `You are an elite B2B data analyzer. You are evaluating a local business that currently has NO functional website.\nBusiness Name: ${target.businessName}\nLocation: ${city}\nCategory: ${target.category}\n\nRAW SEARCH FOOTPRINT (Text & Links):\n${rawFootprint.substring(0, 15000)}\n\nYour objective is to meticulously parse this chaotic footprint and extract contact targets.\nReturn strictly a JSON object (no markdown formatting, no \`\`\`json wrappers) with exactly these keys:\n{\n  "email": "Extract any valid contact email found in the footprint. Ignore sentry.io or google links. Leave empty string if none.",\n  "ownerName": "Identify the owner, founder, director, or standard contact person. Leave empty if none.",\n  "socialLink": "Extract their best social media link (Facebook, Instagram, LinkedIn) from the discovered links. Leave empty if none.",\n  "tacticalPitch": "Write exactly '[Website Status: MISSING] - ' followed by a 1-sentence analytical note of their strongest online platform (e.g. they have an active Facebook page or no presence at all)."\n}`;

                    const result = await model.generateContent(prompt);
                    const textResp = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '').trim();

                    try {
                        const aiData = JSON.parse(textResp);
                        email = aiData.email || email;
                        ownerName = aiData.ownerName || ownerName;
                        socialLink = aiData.socialLink || socialLink;
                        tacticalNote = aiData.tacticalPitch || "Intelligence parsed but analysis empty.";
                    } catch (parseErr) {
                        console.error("JSON parse failed on Gemini response:", textResp);
                        tacticalNote = `AI parsing error, raw output: ${textResp.substring(0, 50)}`;
                    }

                } catch (geminiErr) {
                    tacticalNote = `AI Error: ${geminiErr.message}`;
                }
            }

            await csvWriter.writeRecords([{
                Business_Name: target.businessName, Niche: niche, City: city, Category: target.category,
                Address: target.address, Phone: target.phone, Email: email, Owner_Name: ownerName,
                Social_Link: socialLink, Review_Count: target.reviewCount, Rating: target.rating, Target_Note: tacticalNote
            }]);

            savedCount++;
            sendEvent({ message: `[✔] ${target.businessName} extracted, reasoned, and persisted to DB/CSV.` });
        }

        sendEvent({ message: `[✅] EXTRACTION COMPLETE. ${savedCount} targets strictly processed.` });
        sendEvent({ message: `[💾] CSV Appended: ${csvPath}` });
        sendEvent({ _done: true });

    } catch (error) {
        console.error("[!] Scrape Stream Error:", error);
        sendEvent({ error: error.message });
    } finally {
        releaseConcurrencyOnce();
        if (browser) {
            try {
                await browser.close();
            } catch (e) { }
        }
        res.end(); // close stream
    }
});

app.listen(PORT, () => {
    console.log(`[🚀] Omniscient Engine listening on port ${PORT}`);
});
