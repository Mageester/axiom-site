export async function performAudit(rawUrl: string) {
    let url = rawUrl.trim();
    if (!url.startsWith('http')) url = 'https://' + url;

    const controller = new AbortController();
    const tId = setTimeout(() => controller.abort(), 10000);

    let start = Date.now();
    let res;

    try {
        res = await fetch(url, {
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) Chrome/120.0.0.0 Safari/537.36 Axiom-Intel-Audit/1.0'
            }
        });
    } catch (e) {
        clearTimeout(tId);
        if (url.startsWith('https://') && e.name !== 'AbortError') {
            const fallbackUrl = url.replace('https://', 'http://');
            start = Date.now();
            try {
                res = await fetch(fallbackUrl, {
                    signal: controller.signal,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) Chrome/120.0.0.0 Safari/537.36 Axiom-Intel-Audit/1.0' }
                });
            } catch (fallbackE) {
                return { error: 'Failed to connect (fallback): ' + fallbackE.message };
            }
        } else {
            return { error: e.message };
        }
    }

    clearTimeout(tId);
    if (!res) return { error: 'No response' };

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
