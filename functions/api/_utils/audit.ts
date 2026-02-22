export async function performAudit(rawUrl: string) {
    let url = rawUrl.trim();
    if (!url.startsWith('http')) url = 'https://' + url;

    async function fetchWithTimeout(targetUrl: string, timeoutMs: number) {
        const controller = new AbortController();
        const tId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(targetUrl, {
                redirect: 'follow',
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) Chrome/120.0.0.0 Safari/537.36 Axiom-Intel-Audit/1.0'
                }
            });
            return res;
        } finally {
            clearTimeout(tId);
        }
    }

    let start = Date.now();
    let res: Response | undefined;

    try {
        res = await fetchWithTimeout(url, 10000);
    } catch (e: any) {
        if (url.startsWith('https://') && e?.name !== 'AbortError') {
            const fallbackUrl = url.replace('https://', 'http://');
            start = Date.now();
            try {
                res = await fetchWithTimeout(fallbackUrl, 10000);
            } catch (fallbackE: any) {
                const msg = fallbackE?.name === 'AbortError' ? 'Request timed out' : (fallbackE?.message || 'Unknown network error');
                return { error: 'Failed to connect (fallback): ' + msg };
            }
        } else {
            return { error: e?.name === 'AbortError' ? 'Request timed out' : (e?.message || 'Network error') };
        }
    }
    if (!res) return { error: 'No response' };
    if (!res.ok) return { error: `HTTP ${res.status}` };

    const timeMs = Date.now() - start;
    const finalUrl = res.url;

    const httpsSupported = finalUrl.startsWith('https://') ? 1 : 0;
    const httpToHttps = url.startsWith('http://') && finalUrl.startsWith('https://') ? 1 : 0;

    let html;
    try {
        html = await res.text();
    } catch (e) {
        return { error: 'Failed text processing' };
    }

    const htmlBytes = html.length;
    const lower = html.toLowerCase();

    const hasForm = lower.includes('<form') ? 1 : 0;
    const mailtoOnly = (lower.includes('mailto:') && hasForm === 0) ? 1 : 0;

    const bookingKws = ['calendly', 'acuity', 'jobber', 'housecallpro', 'servicetitan'];
    const hasBooking = bookingKws.some(k => lower.includes(k)) ? 1 : 0;

    const chatKws = ['tawk', 'intercom', 'drift', 'crisp', 'tidio'];
    const hasChat = chatKws.some(k => lower.includes(k)) ? 1 : 0;

    const hasTelLink = lower.includes('tel:') ? 1 : 0;

    const evidence = {
        detectedKws: [...bookingKws, ...chatKws].filter(k => lower.includes(k)),
        titleMatch: lower.match(/<title>([^<]*)<\/title>/)?.[1] || null
    };

    return {
        finalUrl,
        httpsSupported,
        httpToHttps,
        timeMs,
        htmlBytes,
        hasForm,
        mailtoOnly,
        hasBooking,
        hasChat,
        hasTelLink,
        evidenceJson: JSON.stringify(evidence),
        redirectChainJson: JSON.stringify([finalUrl])
    };
}
