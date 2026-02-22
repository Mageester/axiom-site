// Secure PBKDF2 helper for Cloudflare Workers
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

// Derives a PBKDF2 keyed hash given a password and salt
// Returns in format: <salt_hex>:<hash_hex>
export async function hashPassword(password: string, saltHex?: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = saltHex ? new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))) : crypto.getRandomValues(new Uint8Array(16));

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const keyBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        KEY_LENGTH * 8
    );

    const hashHex = Array.from(new Uint8Array(keyBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    const newSaltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

    return `${newSaltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [saltHex, originalHashHex] = storedHash.split(':');
    if (!saltHex || !originalHashHex) return false;

    // Use a constant-time comparison if possible, or just strict equality
    const compareHash = await hashPassword(password, saltHex);
    return compareHash === storedHash;
}

// Token operations for session validation
export async function hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
