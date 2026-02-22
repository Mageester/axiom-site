// Secure PBKDF2 helper for Cloudflare Workers
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

// Derives a PBKDF2 keyed hash given a password and salt
// Returns in format: <salt_hex>:<hash_hex>
export async function hashPassword(password: string, saltHex?: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = saltHex
        ? new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        : crypto.getRandomValues(new Uint8Array(16));

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

// Constant-time comparison to prevent timing attacks
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
    const encoder = new TextEncoder();

    // Pad both to the same length to prevent length-based timing leaks
    const maxLen = Math.max(a.length, b.length);
    const aPadded = a.padEnd(maxLen, '\0');
    const bPadded = b.padEnd(maxLen, '\0');

    const keyA = await crypto.subtle.importKey('raw', encoder.encode(aPadded), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const keyB = await crypto.subtle.importKey('raw', encoder.encode(bPadded), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

    const sigA = await crypto.subtle.sign('HMAC', keyA, encoder.encode('compare'));
    const sigB = await crypto.subtle.sign('HMAC', keyB, encoder.encode('compare'));

    const aBytes = new Uint8Array(sigA);
    const bBytes = new Uint8Array(sigB);

    // XOR all bytes and check if any differ — constant-time
    let diff = 0;
    for (let i = 0; i < aBytes.length; i++) {
        diff |= aBytes[i] ^ bBytes[i];
    }
    return diff === 0;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [saltHex, originalHashHex] = storedHash.split(':');
    if (!saltHex || !originalHashHex) return false;

    const compareHash = await hashPassword(password, saltHex);
    const [, compareHashHex] = compareHash.split(':');

    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(compareHashHex, originalHashHex);
}

// Token operations for session validation
export async function hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
