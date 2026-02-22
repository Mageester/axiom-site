export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}

export function apiError(status: number, error: string, extra?: Record<string, unknown>) {
    return json({ error, ...(extra || {}) }, status);
}

export function d1ErrorMessage(err: unknown, fallback: string) {
    const msg = err instanceof Error ? err.message : String(err || '');
    if (msg.includes('no such table')) {
        return `${fallback}. Database schema is missing or migrations were not applied.`;
    }
    if (msg.includes('no such column')) {
        return `${fallback}. Database schema is out of date.`;
    }
    return fallback;
}
