// Secure PBKDF2 helper for Cloudflare Workers
// Iterations are configurable via env.PBKDF2_ITERS (default: 100000).
// Minimum enforced: 50000. Maximum enforced: 200000 (CF Worker CPU budget).
// Algorithm: PBKDF2-SHA256. Do NOT change algorithm.

const DEFAULT_ITERATIONS = 100000;
const MIN_ITERATIONS = 50000;
const MAX_ITERATIONS = 200000;
const KEY_LENGTH = 32; // bytes (256 bits)
const SALT_BYTES = 16; // bytes

function getIterations(env?: any): number {
    if (!env?.PBKDF2_ITERS) return DEFAULT_ITERATIONS;
    const parsed = parseInt(env.PBKDF2_ITERS, 10);
    if (isNaN(parsed)) return DEFAULT_ITERATIONS;
    return Math.max(MIN_ITERATIONS, Math.min(MAX_ITERATIONS, parsed));
}

// Derives a PBKDF2 keyed hash given a password and optional existing salt hex.
// Returns format: <iterations>:<salt_hex>:<hash_hex>
// The iterations prefix ensures old hashes (stored without it) remain verifiable
// via legacy path in verifyPassword.
export async function hashPassword(password: string, saltHex?: string, env?: any): Promise<string> {
    const iterations = getIterations(env);
    const encoder = new TextEncoder();
    const salt = saltHex
        ? new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        : crypto.getRandomValues(new Uint8Array(SALT_BYTES));

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
            salt,
            iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        KEY_LENGTH * 8
    );

    const hashHex = Array.from(new Uint8Array(keyBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');
    const newSaltHex = Array.from(salt)
        .map(b => b.toString(16).padStart(2, '0')).join('');

    // Format: iterations:saltHex:hashHex
    return `${iterations}:${newSaltHex}:${hashHex}`;
}

// Constant-time string comparison via HMAC to prevent timing attacks
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
    const encoder = new TextEncoder();
    // Both sides signed with same static key using same message
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode('axiom-compare-v1'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const [sigA, sigB] = await Promise.all([
        crypto.subtle.sign('HMAC', key, encoder.encode(a)),
        crypto.subtle.sign('HMAC', key, encoder.encode(b))
    ]);
    const aBytes = new Uint8Array(sigA);
    const bBytes = new Uint8Array(sigB);
    let diff = 0;
    for (let i = 0; i < aBytes.length; i++) {
        diff |= aBytes[i] ^ bBytes[i];
    }
    return diff === 0;
}

// Supports both legacy 2-part format (salt:hash) and new 3-part format (iters:salt:hash)
export async function verifyPassword(password: string, storedHash: string, env?: any): Promise<boolean> {
    if (!storedHash) return false;

    const parts = storedHash.split(':');
    let saltHex: string;
    let originalHashHex: string;
    let storedIters: number;

    if (parts.length === 3) {
        // New format: iterations:salt:hash
        storedIters = parseInt(parts[0], 10);
        saltHex = parts[1];
        originalHashHex = parts[2];
    } else if (parts.length === 2) {
        // Legacy format: salt:hash (use default iterations)
        storedIters = DEFAULT_ITERATIONS;
        saltHex = parts[0];
        originalHashHex = parts[1];
    } else {
        return false;
    }

    if (!saltHex || !originalHashHex || isNaN(storedIters)) return false;

    // Always re-derive with the stored iteration count (not env) for consistency
    const encoder = new TextEncoder();
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(b => parseInt(b, 16)));

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
            salt,
            iterations: storedIters,
            hash: 'SHA-256'
        },
        keyMaterial,
        KEY_LENGTH * 8
    );

    const compareHashHex = Array.from(new Uint8Array(keyBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');

    return timingSafeEqual(compareHashHex, originalHashHex);
}

// SHA-256 hash of a session token for safe DB storage
export async function hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(token));
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}
