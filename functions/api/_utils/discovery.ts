export const NICHE_KEYWORDS: Record<string, string[]> = {
    hvac: ['hvac', 'heating', 'cooling', 'furnace', 'air conditioning', 'mechanical'],
    plumbing: ['plumbing', 'plumber', 'drain', 'sewer', 'pipe', 'emergency'],
    electrician: ['electric', 'electrician', 'electrical', 'wiring', 'panel', 'generator'],
    roofing: ['roof', 'roofing', 'roofer', 'shingle', 'flat roof', 'eavestrough'],
    landscaping: ['landscaping', 'landscape', 'lawn', 'garden', 'yard', 'maintenance'],
    cleaning: ['cleaning', 'clean', 'janitorial', 'maid', 'deep clean', 'commercial cleaning'],
    painting: ['painting', 'painter', 'paint', 'interior paint', 'exterior paint']
};

export function expandNicheKeywords(niche: string): string[] {
    const normalized = niche.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!normalized) return [];
    for (const [key, values] of Object.entries(NICHE_KEYWORDS)) {
        if (normalized.includes(key)) return values;
    }
    return Array.from(new Set(normalized.split(' ').map(s => s.trim()).filter(Boolean)));
}

export function normalizePhone(phone?: string | null) {
    const digits = String(phone || '').replace(/\D/g, '');
    return digits.length >= 7 ? digits : '';
}

export function normalizeDomain(url?: string | null) {
    if (!url) return '';
    try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        return parsed.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
        return '';
    }
}

function detectEmailInHtml(lower: string, original: string) {
    const mailtoMatch = original.match(/mailto:([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
    if (mailtoMatch?.[1]) return mailtoMatch[1].toLowerCase();
    const textMatch = original.match(/\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/i);
    return textMatch?.[1]?.toLowerCase() || null;
}

async function readTextLimited(res: Response, maxBytes: number): Promise<string> {
    if (!res.body || !(res.body as any).getReader) {
        const txt = await res.text();
        return txt.slice(0, maxBytes);
    }
    const reader = (res.body as ReadableStream<Uint8Array>).getReader();
    const decoder = new TextDecoder();
    let total = 0;
    let out = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        total += value.byteLength;
        out += decoder.decode(value, { stream: true });
        if (total >= maxBytes) {
            try { await reader.cancel(); } catch { }
            break;
        }
    }
    out += decoder.decode();
    return out;
}

export async function auditLiteWebsite(rawUrl: string) {
    let url = rawUrl.trim();
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    const visited = new Set<string>();
    let current = url;
    let redirects = 0;
    let finalUrl = current;
    let html = '';

    while (redirects <= 3) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);
        try {
            const res = await fetch(current, {
                method: 'GET',
                redirect: 'manual',
                headers: {
                    'User-Agent': 'Axiom-Intel/1.0 (discovery-lite audit)'
                },
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (res.status >= 300 && res.status < 400) {
                const loc = res.headers.get('Location');
                if (!loc) break;
                const nextUrl = new URL(loc, current).toString();
                if (visited.has(nextUrl)) break;
                visited.add(nextUrl);
                current = nextUrl;
                finalUrl = nextUrl;
                redirects++;
                continue;
            }

            finalUrl = res.url || current;
            if (!res.ok) {
                return {
                    finalUrl,
                    httpsSupported: finalUrl.startsWith('https://') ? 1 : 0,
                    intakePresent: 0,
                    bookingPresent: 0,
                    detectedEmail: null
                };
            }

            html = await readTextLimited(res, 500 * 1024);
            break;
        } catch (e: any) {
            clearTimeout(timeout);
            if (redirects === 0 && current.startsWith('https://') && e?.name !== 'AbortError') {
                current = current.replace(/^https:\/\//i, 'http://');
                finalUrl = current;
                redirects++;
                continue;
            }
            return {
                finalUrl,
                httpsSupported: finalUrl.startsWith('https://') ? 1 : 0,
                intakePresent: 0,
                bookingPresent: 0,
                detectedEmail: null
            };
        }
    }

    const lower = html.toLowerCase();
    const intakePresent = (
        lower.includes('<form') ||
        lower.includes('contact') ||
        lower.includes('quote') ||
        lower.includes('estimate') ||
        lower.includes('request')
    ) ? 1 : 0;
    const bookingPresent = (
        lower.includes('book') ||
        lower.includes('schedule') ||
        lower.includes('appointment') ||
        lower.includes('calendly') ||
        lower.includes('acuity') ||
        lower.includes('setmore')
    ) ? 1 : 0;
    const detectedEmail = detectEmailInHtml(lower, html);

    return {
        finalUrl,
        httpsSupported: finalUrl.startsWith('https://') ? 1 : 0,
        intakePresent,
        bookingPresent,
        detectedEmail
    };
}

export function scoreOpportunity(input: {
    website?: string | null;
    finalUrl?: string | null;
    phone?: string | null;
    address?: string | null;
    name?: string | null;
    tags?: Record<string, any> | null;
    intakePresent?: number | null;
    bookingPresent?: number | null;
    nicheKeywords: string[];
}) {
    let score = 0;
    const reasons: string[] = [];
    const website = input.website || '';
    const finalUrl = input.finalUrl || website;
    const domain = normalizeDomain(finalUrl || website);
    const tagsStr = JSON.stringify(input.tags || {}).toLowerCase();
    const nameLower = (input.name || '').toLowerCase();
    const websiteLower = String(finalUrl || website || '').toLowerCase();

    if (!website) { score += 10; reasons.push('No website'); }
    if (website && finalUrl && /^http:\/\//i.test(finalUrl)) { score += 5; reasons.push('Website not HTTPS'); }
    if (input.intakePresent === 0) { score += 5; reasons.push('Missing intake'); }
    if (input.bookingPresent === 0) { score += 5; reasons.push('Missing booking'); }
    if (domain.endsWith('facebook.com') || websiteLower.includes('facebook.com/')) { score += 3; reasons.push('Facebook-only presence'); }
    if (input.phone) { score += 2; reasons.push('Has phone'); }
    if (input.address) { score += 1; reasons.push('Has address'); }

    let keywordHits = 0;
    for (const kw of input.nicheKeywords) {
        const k = kw.toLowerCase();
        if (!k) continue;
        if (nameLower.includes(k)) { score += 5; keywordHits++; reasons.push(`Keyword in name: ${kw}`); continue; }
        if (tagsStr.includes(k)) { score += 3; keywordHits++; reasons.push(`Keyword in tags: ${kw}`); continue; }
        if (websiteLower.includes(k)) { score += 1; keywordHits++; reasons.push(`Keyword in website: ${kw}`); continue; }
    }

    return {
        score,
        reasons,
        keywordHits
    };
}
