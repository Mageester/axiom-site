export class ApiRequestError extends Error {
    status: number;
    details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
        this.details = details;
    }
}

type ApiOptions = RequestInit & {
    timeoutMs?: number;
};

export async function apiJson<T>(input: RequestInfo | URL, options: ApiOptions = {}): Promise<T> {
    const { timeoutMs = 15000, headers, ...init } = options;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(input, {
            ...init,
            headers: {
                Accept: 'application/json',
                ...(headers || {})
            },
            signal: controller.signal
        });

        const rawText = await res.text();
        let body: any = {};
        if (rawText) {
            try {
                body = JSON.parse(rawText);
            } catch {
                body = { error: rawText };
            }
        }

        if (!res.ok) {
            throw new ApiRequestError(
                body?.error || `Request failed (${res.status})`,
                res.status,
                body
            );
        }

        return body as T;
    } catch (err: any) {
        if (err?.name === 'AbortError') {
            throw new ApiRequestError('Request timed out. Please retry.', 0);
        }
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

export function errorMessage(err: unknown, fallback: string) {
    if (err instanceof ApiRequestError) return err.message;
    if (err instanceof Error && err.message) return err.message;
    return fallback;
}
