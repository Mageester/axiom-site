import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

import { apiError } from '../_utils/http';
import { launchOmniscientBrowser, type AutomationBrowser, type AutomationBrowserContext } from '../_utils/omniscient-browser';
import {
    collectSearchDiscoveryPage,
    collectWebsiteDiscoveryPages,
    formatEmailCandidatesForPrompt,
    pickBestSocialLink,
    resolvePublicBusinessEmail,
    type EmailDiscoveryPage,
    validateContact,
} from '../_utils/omniscient-email';
import {
    checkDisqualifiers,
    computeAxiomScore,
    generateDedupeKey,
    generatePersonalization,
    type PainSignal,
    type WebsiteAssessment,
} from '../_utils/omniscient-intelligence';
import {
    consumeOmniscientRateLimit,
    countActiveOmniscientScrapeRuns,
    createOmniscientScrapeRun,
    finishOmniscientScrapeRun,
    getOmniscientClientIp,
    getOmniscientEnv,
    insertOmniscientLead,
    listOmniscientLeads,
    requireOmniscientUser,
    writeOmniscientAuditEvent,
} from '../_utils/omniscient';

type Target = {
    address: string;
    businessName: string;
    category: string;
    phone: string;
    rating: number;
    reviewCount: number;
    website: string;
};

class ScrapeTimeoutError extends Error {}

function sanitizeAiJsonResponse(text: string): string {
    return text.trim().replace(/```json/g, '').replace(/```/g, '').trim();
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    try {
        return await Promise.race([
            promise,
            new Promise<never>((_, reject) => {
                timeoutHandle = setTimeout(() => reject(new ScrapeTimeoutError(message)), timeoutMs);
            }),
        ]);
    } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle);
    }
}

function createGeminiModel(apiKey?: string) {
    if (!apiKey) return null;

    return new GoogleGenerativeAI(apiKey).getGenerativeModel({
        model: 'gemini-2.5-pro',
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
    });
}

function buildActiveWebsitePrompt(input: {
    businessName: string;
    category: string;
    city: string;
    niche: string;
    rawFootprint: string;
    rating: number;
    reviewCount: number;
    targetWebsite: string;
    vettedEmailCandidates: string;
}) {
    return `You are an elite B2B web analyst evaluating a local business website for a web design agency.
Business: ${input.businessName} | Location: ${input.city} | Niche: ${input.niche} | Category: ${input.category}
Website: ${input.targetWebsite}
Rating: ${input.rating}/5 (${input.reviewCount} reviews)

WEBSITE CONTENT & LINKS:
${input.rawFootprint.substring(0, 15000)}

VETTED PUBLIC EMAIL CANDIDATES:
${input.vettedEmailCandidates}

EMAIL RULES:
- You may only return an email that appears exactly in the vetted public email candidates list above.
- If no candidate is clearly usable for outreach, return "".
- Prefer public owner, founder, director, or person-named inboxes over generic inboxes.
- Never invent, normalize, or guess an email.

Return a JSON object (no markdown, no code fences):
{
  "email": "Exact email from the vetted candidate list or empty string",
  "ownerName": "Owner/founder/contact person or empty string",
  "socialLink": "Best social media link (FB, IG, LinkedIn) or empty string",
  "websiteAssessment": {
    "speedRisk": 0-5,
    "conversionRisk": 0-5,
    "trustRisk": 0-5,
    "seoRisk": 0-5,
    "overallGrade": "A through F",
    "topFixes": ["Fix 1", "Fix 2", "Fix 3"]
  },
  "painSignals": [
    {"type": "CONVERSION|SPEED|TRUST|SEO|DESIGN|FUNCTIONALITY", "severity": 1-5, "evidence": "Specific evidence from the site", "source": "site_scan"}
  ],
  "hasContactForm": true/false,
  "hasSocialMessaging": true/false,
  "tacticalNote": "1-2 sentence critical evaluation"
}`;
}

function buildMissingWebsitePrompt(input: {
    businessName: string;
    category: string;
    city: string;
    niche: string;
    rawFootprint: string;
    rating: number;
    reviewCount: number;
    vettedEmailCandidates: string;
}) {
    return `You are an elite B2B web analyst evaluating a local business with no website.
Business: ${input.businessName} | Location: ${input.city} | Niche: ${input.niche} | Category: ${input.category}
Rating: ${input.rating}/5 (${input.reviewCount} reviews)

RAW SEARCH FOOTPRINT:
${input.rawFootprint.substring(0, 15000)}

VETTED PUBLIC EMAIL CANDIDATES:
${input.vettedEmailCandidates}

EMAIL RULES:
- You may only return an email that appears exactly in the vetted public email candidates list above.
- If no candidate is clearly usable for outreach, return "".
- Prefer public owner, founder, director, or person-named inboxes over generic inboxes.
- Never invent, normalize, or guess an email.

Return a JSON object (no markdown, no code fences):
{
  "email": "Exact email from the vetted candidate list or empty string",
  "ownerName": "Owner/founder/director or empty string",
  "socialLink": "Best social media link (Facebook, Instagram, LinkedIn) or empty string",
  "websiteAssessment": null,
  "painSignals": [
    {"type": "NO_WEBSITE", "severity": 4, "evidence": "Specific evidence about their lack of web presence vs competitors", "source": "heuristic"},
    {"type": "CONVERSION", "severity": 3, "evidence": "How they are losing leads without a website", "source": "heuristic"}
  ],
  "hasContactForm": false,
  "hasSocialMessaging": true/false,
  "tacticalNote": "1 sentence about their strongest online platform or lack thereof"
}`;
}

async function collectTargets(
    context: AutomationBrowserContext,
    niche: string,
    city: string,
    maxDepth: number,
    sendEvent: (data: unknown) => boolean,
): Promise<Target[]> {
    const page = await context.newPage();

    try {
        const query = `${niche} in ${city}, Ontario`;
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, {
            waitUntil: 'domcontentloaded',
        });

        try {
            await page.waitForSelector('div[role="feed"]', { timeout: 15000 });
        } catch {
            throw new Error('Maps results timed out. No targets found.');
        }

        sendEvent({ message: '[MAPS] Infinite scroll extraction started' });

        let lastHeight = 0;
        let scrollAttempts = 0;
        while (scrollAttempts < maxDepth) {
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
            scrollAttempts += 1;
            await page.waitForTimeout(1500);
            sendEvent({ message: `[MAPS] Depth ${scrollAttempts}/${maxDepth}` });
        }

        const placeLinks = await page.locator('a.hfpxzc').evaluateAll((anchors) =>
            anchors
                .map((anchor) => ({
                    name: anchor.getAttribute('aria-label') || '',
                    url: (anchor as HTMLAnchorElement).href || anchor.getAttribute('href') || '',
                }))
                .filter((place) => place.name && place.url && !place.url.includes('/search/')),
        );

        sendEvent({ message: `[MAPS] Found ${placeLinks.length} listings. Extracting details...` });
        const targets: Target[] = [];
        const chunkSize = 5;

        for (let index = 0; index < placeLinks.length; index += chunkSize) {
            const chunk = placeLinks.slice(index, index + chunkSize);
            sendEvent({
                message: `[MAPS] Detail batch ${Math.floor(index / chunkSize) + 1}/${Math.ceil(placeLinks.length / chunkSize)}`,
            });

            const chunkResults = await Promise.all(
                chunk.map(async (place) => {
                    const detailPage = await context.newPage();
                    try {
                        await detailPage.goto(place.url, { timeout: 15000, waitUntil: 'domcontentloaded' });
                        await detailPage.waitForSelector('h1', { timeout: 10000 });

                        return detailPage.evaluate(() => {
                            const title = document.querySelector('h1')?.innerText || '';
                            const webButton = document.querySelector('a[data-item-id="authority"]');
                            const website =
                                (webButton as HTMLAnchorElement | null)?.href ||
                                webButton?.getAttribute('href') ||
                                '';
                            const phoneButton = document.querySelector('button[data-item-id*="phone:tel:"]');
                            let phone = '';

                            if (phoneButton) {
                                phone = phoneButton.getAttribute('data-item-id')?.replace('phone:tel:', '') || '';
                            } else {
                                const fallbackButtons = Array.from(document.querySelectorAll('button[data-tooltip="Copy phone number"]'));
                                if (fallbackButtons.length > 0) {
                                    phone = (fallbackButtons[0] as HTMLElement).innerText;
                                }
                            }

                            const addressButton = document.querySelector('button[data-item-id="address"]');
                            const address = addressButton?.getAttribute('aria-label')?.replace('Address: ', '') || '';
                            const categoryButton = document.querySelector('button[jsaction="pane.rating.category"]');
                            const category = (categoryButton as HTMLElement | null)?.innerText || '';
                            const ratingDiv = document.querySelector('div[jsaction="pane.rating.moreReviews"]');
                            const ratingText = ratingDiv?.getAttribute('aria-label') || '';

                            return { address, category, phone, ratingText, title, website };
                        });
                    } catch {
                        return null;
                    } finally {
                        await detailPage.close();
                    }
                }),
            );

            for (const result of chunkResults) {
                if (!result || !result.title) continue;

                let rating = 0;
                let reviewCount = 0;
                if (result.ratingText) {
                    const match = result.ratingText.match(/([\d.]+)\s*stars?\s*([\d,]+)/i);
                    if (match) {
                        rating = parseFloat(match[1]);
                        reviewCount = parseInt(match[2].replace(/,/g, ''), 10);
                    }
                }

                targets.push({
                    address: result.address,
                    businessName: result.title,
                    category: result.category,
                    phone: result.phone,
                    rating,
                    reviewCount,
                    website: result.website,
                });
            }
        }

        return targets;
    } finally {
        await page.close();
    }
}

async function enrichWithAi(input: {
    businessName: string;
    category: string;
    city: string;
    discoveryPages: EmailDiscoveryPage[];
    emailResolution: ReturnType<typeof resolvePublicBusinessEmail>;
    model: ReturnType<typeof createGeminiModel>;
    niche: string;
    ownerName: string;
    rawFootprint: string;
    rating: number;
    reviewCount: number;
    socialLink: string;
    targetWebsite: string;
    websiteStatus: string;
}) {
    let ownerName = input.ownerName;
    let socialLink = input.socialLink;
    let tacticalNote = 'No intelligence generated.';
    let hasContactForm = false;
    let hasSocialMessaging = /facebook|instagram|messenger/i.test(socialLink);
    let assessment: WebsiteAssessment | null = null;
    let painSignals: PainSignal[] = [];
    let emailResolution = input.emailResolution;
    let email = emailResolution.email;

    try {
        const vettedEmailCandidates = formatEmailCandidatesForPrompt(emailResolution.candidates);
        const prompt = input.websiteStatus === 'ACTIVE'
            ? buildActiveWebsitePrompt({
                businessName: input.businessName,
                category: input.category,
                city: input.city,
                niche: input.niche,
                rawFootprint: input.rawFootprint,
                rating: input.rating,
                reviewCount: input.reviewCount,
                targetWebsite: input.targetWebsite,
                vettedEmailCandidates,
            })
            : buildMissingWebsitePrompt({
                businessName: input.businessName,
                category: input.category,
                city: input.city,
                niche: input.niche,
                rawFootprint: input.rawFootprint,
                rating: input.rating,
                reviewCount: input.reviewCount,
                vettedEmailCandidates,
            });

        const result = await input.model!.generateContent(prompt);
        const data = JSON.parse(sanitizeAiJsonResponse(result.response.text())) as {
            email?: string;
            hasContactForm?: boolean;
            hasSocialMessaging?: boolean;
            ownerName?: string;
            painSignals?: Array<{ evidence?: string; severity?: number; source?: string; type?: string }>;
            socialLink?: string;
            tacticalNote?: string;
            websiteAssessment?: {
                conversionRisk?: number;
                overallGrade?: string;
                seoRisk?: number;
                speedRisk?: number;
                topFixes?: string[];
                trustRisk?: number;
            } | null;
        };

        ownerName = data.ownerName || ownerName;
        socialLink = data.socialLink || socialLink;
        tacticalNote = data.tacticalNote || tacticalNote;
        hasContactForm = data.hasContactForm === true;
        hasSocialMessaging = data.hasSocialMessaging === true || hasSocialMessaging;

        if (data.websiteAssessment) {
            assessment = {
                conversionRisk: Math.min(data.websiteAssessment.conversionRisk || 0, 5),
                overallGrade: data.websiteAssessment.overallGrade || 'C',
                seoRisk: Math.min(data.websiteAssessment.seoRisk || 0, 5),
                speedRisk: Math.min(data.websiteAssessment.speedRisk || 0, 5),
                topFixes: (data.websiteAssessment.topFixes || []).slice(0, 3),
                trustRisk: Math.min(data.websiteAssessment.trustRisk || 0, 5),
            };
        }

        if (Array.isArray(data.painSignals)) {
            painSignals = data.painSignals
                .filter((signal) => signal && signal.type && signal.evidence)
                .map((signal) => ({
                    evidence: String(signal.evidence),
                    severity: Math.min(Math.max(Number(signal.severity || 1), 1), 5),
                    source: (signal.source as PainSignal['source']) || 'ai_analysis',
                    type: signal.type as PainSignal['type'],
                }));
        }

        emailResolution = resolvePublicBusinessEmail({
            aiPreferredEmail: data.email || '',
            businessName: input.businessName,
            businessWebsite: input.targetWebsite,
            ownerName,
            pages: input.discoveryPages,
        });
        email = emailResolution.email || email;
    } catch (error) {
        tacticalNote = `AI Error: ${error instanceof Error ? error.message : 'Unknown AI error'}`;
    }

    return {
        assessment,
        email,
        emailResolution,
        hasContactForm,
        hasSocialMessaging,
        ownerName,
        painSignals,
        socialLink,
        tacticalNote,
    };
}

export async function onRequestGet(context: any) {
    const auth = requireOmniscientUser(context, { admin: true });
    if ('response' in auth) {
        return auth.response;
    }

    const settings = getOmniscientEnv(context.env);
    const ipAddress = getOmniscientClientIp(context.request);
    const rateLimit = await consumeOmniscientRateLimit(context.env, {
        identifier: `${auth.user.id}:${ipAddress}`,
        limit: settings.rateLimitMaxScrape,
        scope: 'omniscient_scrape',
        windowSeconds: settings.rateLimitWindowSeconds,
    });

    if (!rateLimit.allowed) {
        return apiError(429, `Scrape rate limit exceeded. Try again after ${rateLimit.resetAt.toISOString()}.`, {
            resetAt: rateLimit.resetAt.toISOString(),
        });
    }

    const url = new URL(context.request.url);
    const niche = (url.searchParams.get('niche') || '').trim();
    const city = (url.searchParams.get('city') || '').trim();
    const radius = (url.searchParams.get('radius') || '10').trim();
    const parsedDepth = parseInt(url.searchParams.get('maxDepth') || '5', 10);
    const maxDepth = Number.isNaN(parsedDepth) ? 5 : Math.min(Math.max(parsedDepth, 1), 20);

    if (!niche || !city) {
        return apiError(400, 'Missing niche or city text');
    }

    const runningCount = await countActiveOmniscientScrapeRuns(context.env);
    if (runningCount >= settings.scrapeConcurrencyLimit) {
        return apiError(409, 'Another scrape is already running. Wait for the current run to finish.');
    }

    const scrapeRun = await createOmniscientScrapeRun(context.env, {
        actorUserId: auth.user.id,
        actorUsername: auth.user.username,
        city,
        metadata: { maxDepth, radius },
        niche,
    });

    await writeOmniscientAuditEvent(context.env, {
        action: 'omniscient.scrape.start',
        actorUserId: auth.user.id,
        actorUsername: auth.user.username,
        ipAddress,
        metadata: { city, maxDepth, niche, radius },
        targetId: scrapeRun.id,
        targetType: 'scrape_run',
    });

    let browser: AutomationBrowser | null = null;
    let browserContext: AutomationBrowserContext | null = null;
    let finalStatus = 'failed';
    let finalErrorMessage: string | null = null;
    let finalStats = { avgScore: 0, leadsFound: 0, withEmail: 0 };
    let aborted = false;

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            let streamClosed = false;

            const sendEvent = (data: unknown) => {
                if (streamClosed) return false;
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                    return true;
                } catch {
                    streamClosed = true;
                    return false;
                }
            };

            context.request.signal.addEventListener('abort', () => {
                aborted = true;
                streamClosed = true;
                if (browserContext) void browserContext.close().catch(() => undefined);
                if (browser) void browser.close().catch(() => undefined);
            }, { once: true });

            async function runScrape() {
                const model = createGeminiModel(settings.geminiApiKey);
                browser = await launchOmniscientBrowser(context.env);
                browserContext = await browser.newContext({ locale: 'en-CA' });

                sendEvent({ message: `[ENGINE] AXIOM ENGINE initialized for ${niche} in ${city} (R:${radius}km, D:${maxDepth})` });
                sendEvent({ message: '[ENGINE] Intelligence modules online: scoring, dedupe, contact validation, public email resolver' });
                if (!model) {
                    sendEvent({ message: '[AI] Gemini key not configured. Running heuristic-only enrichment.' });
                }

                const targets = await collectTargets(browserContext, niche, city, maxDepth, sendEvent);
                sendEvent({ message: `[ENGINE] ${targets.length} targets parsed. Starting enrichment...`, progress: 0, total: targets.length });

                const existingLeads = await listOmniscientLeads(context.env, {
                    includeArchived: true,
                    limit: 5000,
                    sort: 'createdAt',
                    sortDir: 'desc',
                });
                const existingDedupeKeys = new Set(existingLeads.map((lead) => {
                    if (lead.dedupeKey) return lead.dedupeKey;
                    return generateDedupeKey(lead.businessName, lead.city || '', lead.phone, lead.websiteUrl, lead.address).key;
                }));

                let savedCount = 0;
                let emailCount = 0;
                let duplicateCount = 0;
                let disqualifiedCount = 0;
                let totalScore = 0;
                const tierCounts: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };
                const source = `${niche}|${city}|${new Date().toISOString().split('T')[0]}`;

                for (let index = 0; index < targets.length; index += 1) {
                    if (streamClosed || aborted) break;

                    const target = targets[index];
                    const dedupe = generateDedupeKey(target.businessName, city, target.phone, target.website, target.address);

                    if (existingDedupeKeys.has(dedupe.key)) {
                        duplicateCount += 1;
                        sendEvent({ message: `[DEDUPE] ${target.businessName} skipped (${dedupe.matchedBy})`, progress: index + 1, total: targets.length, stats: { leadsFound: savedCount, withEmail: emailCount } });
                        continue;
                    }
                    existingDedupeKeys.add(dedupe.key);

                    sendEvent({ message: `[ENRICH] ${index + 1}/${targets.length} ${target.businessName}`, progress: index, total: targets.length, stats: { leadsFound: savedCount, withEmail: emailCount } });

                    let rawFootprint = '';
                    let email = '';
                    let ownerName = '';
                    let socialLink = '';
                    let websiteStatus = 'MISSING';
                    let discoveryPages: EmailDiscoveryPage[] = [];

                    try {
                        if (target.website) {
                            websiteStatus = 'ACTIVE';
                            sendEvent({ message: `[WEB] Deep scan ${target.website.substring(0, 70)}` });
                            const discovery = await collectWebsiteDiscoveryPages(browserContext, target.website, sendEvent);
                            rawFootprint = discovery.rawFootprint;
                            discoveryPages = discovery.pages;
                            socialLink = pickBestSocialLink(discovery.pages);
                        } else {
                            sendEvent({ message: '[WEB] No website. Searching public footprint...' });
                            const discovery = await collectSearchDiscoveryPage(browserContext, `"${target.businessName}" ${city} email OR owner OR founder OR facebook OR linkedin`);
                            rawFootprint = discovery.rawFootprint;
                            discoveryPages = discovery.pages;
                            socialLink = pickBestSocialLink(discovery.pages);
                        }
                    } catch {
                        // continue with partial discovery data
                    }

                    let emailResolution = resolvePublicBusinessEmail({
                        businessName: target.businessName,
                        businessWebsite: target.website,
                        pages: discoveryPages,
                    });
                    email = emailResolution.email;

                    if (emailResolution.email) {
                        sendEvent({ message: `[EMAIL] Resolver candidate ${emailResolution.email} (${emailResolution.emailType}/${emailResolution.confidence.toFixed(2)})` });
                    } else {
                        sendEvent({ message: '[EMAIL] Resolver found no vetted public email' });
                    }

                    let assessment: WebsiteAssessment | null = null;
                    let painSignals: PainSignal[] = [];
                    let tacticalNote = 'No intelligence generated.';
                    let hasContactForm = false;
                    let hasSocialMessaging = /facebook|instagram|messenger/i.test(socialLink);

                    if (model) {
                        const ai = await enrichWithAi({
                            businessName: target.businessName,
                            category: target.category,
                            city,
                            discoveryPages,
                            emailResolution,
                            model,
                            niche,
                            ownerName,
                            rawFootprint,
                            rating: target.rating,
                            reviewCount: target.reviewCount,
                            socialLink,
                            targetWebsite: target.website,
                            websiteStatus,
                        });
                        ownerName = ai.ownerName;
                        socialLink = ai.socialLink;
                        tacticalNote = ai.tacticalNote;
                        hasContactForm = ai.hasContactForm;
                        hasSocialMessaging = ai.hasSocialMessaging;
                        assessment = ai.assessment;
                        painSignals = ai.painSignals;
                        emailResolution = ai.emailResolution;
                        email = ai.email;
                    }

                    if (websiteStatus === 'MISSING' && !painSignals.some((signal) => signal.type === 'NO_WEBSITE')) {
                        painSignals.unshift({
                            evidence: `${target.businessName} has no website and is relying on directory or social presence only`,
                            severity: 4,
                            source: 'heuristic',
                            type: 'NO_WEBSITE',
                        });
                    }
                    if (websiteStatus === 'MISSING' && painSignals.length === 1 && target.reviewCount >= 5) {
                        painSignals.push({
                            evidence: `Active business with ${target.reviewCount} reviews but no web presence is likely losing leads to competitors`,
                            severity: 3,
                            source: 'heuristic',
                            type: 'CONVERSION',
                        });
                    }

                    const contactValidation = validateContact(email, target.phone, {
                        businessWebsite: target.website,
                        ownerName,
                    });
                    const scoreResult = computeAxiomScore({
                        assessment,
                        category: target.category,
                        city,
                        contact: contactValidation,
                        hasContactForm,
                        hasSocialMessaging,
                        niche,
                        painSignals,
                        rating: target.rating,
                        reviewContent: rawFootprint.substring(0, 2000),
                        reviewCount: target.reviewCount,
                        websiteContent: rawFootprint.substring(0, 5000),
                        websiteStatus,
                    });
                    const disqualifyResult = checkDisqualifiers({
                        assessment,
                        axiomScore: scoreResult.axiomScore,
                        businessName: target.businessName,
                        category: target.category,
                        city,
                        niche,
                        painSignals,
                        rating: target.rating,
                        reviewCount: target.reviewCount,
                        tier: scoreResult.tier,
                        websiteContent: rawFootprint.substring(0, 5000),
                        websiteStatus,
                    });
                    const personalization = generatePersonalization({
                        assessment,
                        businessName: target.businessName,
                        city,
                        contactName: ownerName || null,
                        niche,
                        painSignals,
                        websiteStatus,
                    });

                    const inserted = await insertOmniscientLead(context.env, {
                        address: target.address,
                        axiomScore: scoreResult.axiomScore,
                        axiomTier: scoreResult.tier,
                        axiomWebsiteAssessment: assessment ? JSON.stringify(assessment) : null,
                        businessName: target.businessName,
                        callOpener: personalization.callOpener,
                        category: target.category,
                        city,
                        contactName: ownerName || null,
                        dedupeKey: dedupe.key,
                        dedupeMatchedBy: dedupe.matchedBy,
                        disqualifiers: disqualifyResult.reasons.length > 0 ? JSON.stringify(disqualifyResult.reasons) : null,
                        disqualifyReason: disqualifyResult.primaryReason,
                        email,
                        emailConfidence: contactValidation.emailConfidence,
                        emailType: contactValidation.emailType,
                        followUpQuestion: personalization.followUpQuestion,
                        isArchived: disqualifyResult.disqualified,
                        leadScore: scoreResult.axiomScore,
                        niche,
                        painSignals: JSON.stringify(painSignals),
                        phone: target.phone,
                        phoneConfidence: contactValidation.phoneConfidence,
                        rating: target.rating,
                        reviewCount: target.reviewCount,
                        scoreBreakdown: JSON.stringify(scoreResult.breakdown),
                        socialLink,
                        source,
                        tacticalNote,
                        websiteGrade: assessment?.overallGrade || null,
                        websiteStatus,
                        websiteUrl: target.website || null,
                    });

                    if (!inserted) continue;

                    savedCount += 1;
                    totalScore += scoreResult.axiomScore;
                    if (email) emailCount += 1;
                    if (disqualifyResult.disqualified) disqualifiedCount += 1;
                    tierCounts[scoreResult.tier] = (tierCounts[scoreResult.tier] || 0) + 1;

                    const grade = assessment ? ` | Grade: ${assessment.overallGrade}` : '';
                    const disqualifiedLabel = disqualifyResult.disqualified ? ' | DISQUALIFIED' : '';
                    sendEvent({
                        message: `[SCORE] ${scoreResult.axiomScore}/100 [${scoreResult.tier}]${grade}${disqualifiedLabel} - ${target.businessName}`,
                        progress: index + 1,
                        stats: { leadsFound: savedCount, withEmail: emailCount },
                        total: targets.length,
                    });
                }

                finalStats = {
                    avgScore: savedCount > 0 ? Math.round(totalScore / savedCount) : 0,
                    leadsFound: savedCount,
                    withEmail: emailCount,
                };
                finalStatus = aborted ? 'canceled' : 'completed';

                sendEvent({ message: '[DONE] AXIOM extraction complete' });
                sendEvent({ message: `[DONE] ${savedCount} processed | ${duplicateCount} deduped | ${disqualifiedCount} disqualified | ${savedCount - disqualifiedCount} qualified` });
                sendEvent({ message: `[DONE] Tiers S:${tierCounts.S || 0} A:${tierCounts.A || 0} B:${tierCounts.B || 0} C:${tierCounts.C || 0} D:${tierCounts.D || 0}` });
                sendEvent({ message: '[DONE] Export the protected results from The Vault or /api/omniscient/leads/export.' });
                sendEvent({ _done: true, stats: finalStats });
            }

            try {
                await withTimeout(
                    runScrape(),
                    settings.scrapeTimeoutMs,
                    `Scrape exceeded ${Math.round(settings.scrapeTimeoutMs / 1000)}s timeout.`,
                );
            } catch (error) {
                finalErrorMessage = error instanceof Error ? error.message : 'Unknown scrape error';
                if (aborted || context.request.signal.aborted) finalStatus = 'canceled';
                else if (error instanceof ScrapeTimeoutError) finalStatus = 'timed_out';
                else finalStatus = 'failed';
                sendEvent({ error: finalErrorMessage });
            } finally {
                if (browserContext) await browserContext.close().catch(() => undefined);
                if (browser) await browser.close().catch(() => undefined);

                await finishOmniscientScrapeRun(context.env, {
                    errorMessage: finalErrorMessage,
                    metadata: { city, maxDepth, niche, radius, ...finalStats },
                    runId: scrapeRun.id,
                    status: finalStatus,
                });

                await writeOmniscientAuditEvent(context.env, {
                    action: `omniscient.scrape.${finalStatus}`,
                    actorUserId: auth.user.id,
                    actorUsername: auth.user.username,
                    ipAddress,
                    metadata: { city, error: finalErrorMessage, maxDepth, niche, radius, ...finalStats },
                    targetId: scrapeRun.id,
                    targetType: 'scrape_run',
                });

                if (!streamClosed) controller.close();
            }
        },
    });

    return new Response(stream, {
        status: 200,
        headers: {
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
        },
    });
}
