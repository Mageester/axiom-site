type LogLevel = 'info' | 'warn' | 'error';

export function logEvent(level: LogLevel, event: string, data: Record<string, unknown> = {}) {
    const entry = {
        ts: new Date().toISOString(),
        level,
        event,
        ...data
    };
    console[level](JSON.stringify(entry));
}
