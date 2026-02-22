const CANADA_PROVINCES = new Set(['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT']);
const US_STATES = new Set([
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
    'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
    'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]);
const GEOCODE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function normalizeCityInput(input: string) {
    return input.replace(/\s+/g, ' ').trim();
}

function inferCountryFromRegion(cityInput: string): { countryCode: 'ca' | 'us' | null; normalizedQuery: string; cacheKey: string } {
    const normalized = normalizeCityInput(cityInput);
    const parts = normalized.split(',').map(p => p.trim()).filter(Boolean);
    const regionRaw = parts.length >= 2 ? parts[1] : '';
    const region = regionRaw.toUpperCase().replace(/\./g, '');

    let countryCode: 'ca' | 'us' | null = null;
    if (CANADA_PROVINCES.has(region)) countryCode = 'ca';
    else if (US_STATES.has(region)) countryCode = 'us';

    const cacheKey = `${normalized.toLowerCase()}|${countryCode || 'any'}`;
    return { countryCode, normalizedQuery: normalized, cacheKey };
}

async function ensureGeocodeCacheTable(env?: any) {
    if (!env?.DB?.prepare) return;
    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS geocode_cache (
            key TEXT PRIMARY KEY,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            bbox TEXT,
            updated_at INTEGER NOT NULL
        )
    `).run().catch(() => null);
}

async function getCachedGeocode(env: any, cacheKey: string) {
    if (!env?.DB?.prepare) return null;
    await ensureGeocodeCacheTable(env);
    const { results } = await env.DB.prepare(
        `SELECT lat, lon, bbox, updated_at FROM geocode_cache WHERE key = ? LIMIT 1`
    ).bind(cacheKey).all();
    if (!results.length) return null;
    const row = results[0];
    const updatedAt = Number(row.updated_at || 0);
    if (!updatedAt || (Date.now() - updatedAt) > GEOCODE_CACHE_TTL_MS) return null;
    return {
        lat: Number(row.lat),
        lon: Number(row.lon),
        bbox: row.bbox || null
    };
}

async function setCachedGeocode(env: any, cacheKey: string, lat: number, lon: number, bbox: string | null) {
    if (!env?.DB?.prepare) return;
    await ensureGeocodeCacheTable(env);
    await env.DB.prepare(`
        INSERT INTO geocode_cache (key, lat, lon, bbox, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
            lat=excluded.lat,
            lon=excluded.lon,
            bbox=excluded.bbox,
            updated_at=excluded.updated_at
    `).bind(cacheKey, lat, lon, bbox, Date.now()).run().catch(() => null);
}

async function geocodeCity(cityInput: string, env?: any) {
    const { countryCode, normalizedQuery, cacheKey } = inferCountryFromRegion(cityInput);
    const cached = await getCachedGeocode(env, cacheKey);
    if (cached) {
        return { ...cached, countryCode, query: normalizedQuery, cacheHit: true };
    }

    const nomUrl = new URL('https://nominatim.openstreetmap.org/search');
    nomUrl.searchParams.set('format', 'jsonv2');
    nomUrl.searchParams.set('q', normalizedQuery);
    nomUrl.searchParams.set('limit', '1');
    nomUrl.searchParams.set('addressdetails', '1');
    if (countryCode) nomUrl.searchParams.set('countrycodes', countryCode);

    let lastErr = 'Geocode request failed';
    for (let attempt = 0; attempt < 3; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000 + (attempt * 2000));
        try {
            const res = await fetch(nomUrl.toString(), {
                headers: {
                    'User-Agent': 'Axiom-Intel/1.0 (internal research tool)',
                    'Accept': 'application/json'
                },
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (res.status === 403 || res.status === 429) {
                const retryAfter = res.headers.get('Retry-After');
                throw new Error(`Geocode blocked/rate-limited: status=${res.status}, retry_after=${retryAfter || 'n/a'}`);
            }
            if (res.status >= 500) {
                lastErr = `Geocode upstream error: status=${res.status}`;
                if (attempt < 2) {
                    await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
                    continue;
                }
                throw new Error(lastErr);
            }
            if (!res.ok) {
                throw new Error(`Geocoding failed: status=${res.status}`);
            }

            const nomData: any[] = await res.json();
            if (nomData.length === 0) {
                throw new Error(`Geocode returned no results for q=${normalizedQuery}, country=${countryCode || 'none'}`);
            }
            const lat = parseFloat(nomData[0].lat);
            const lon = parseFloat(nomData[0].lon);
            if (isNaN(lat) || isNaN(lon)) throw new Error('Geocoding failed: invalid coordinates returned');
            const bbox = Array.isArray(nomData[0].boundingbox) ? JSON.stringify(nomData[0].boundingbox) : null;
            await setCachedGeocode(env, cacheKey, lat, lon, bbox);
            return { lat, lon, bbox, countryCode, query: normalizedQuery, cacheHit: false };
        } catch (e: any) {
            clearTimeout(timeout);
            if (e?.name === 'AbortError') {
                lastErr = 'Geocoding failed: request timed out';
            } else {
                lastErr = e?.message || 'Geocode request failed';
                if ((String(lastErr).includes('status=429') || String(lastErr).includes('Geocode upstream error')) && attempt < 2) {
                    await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
                    continue;
                }
            }
            if (attempt === 2) throw new Error(lastErr);
        }
    }

    throw new Error(lastErr);
}

export async function fetchOsmBusinesses(niche: string, city: string, radiusKm: number, env?: any) {
    const r = Math.min(radiusKm, 100) * 1000; // Cap radius at 100km to prevent runaway queries

    // Map niches to OSM craft tags
    const n = niche.toLowerCase().replace(/[^a-z_]/g, '').slice(0, 64);
    let craftType = n;
    if (n.includes('hvac')) craftType = 'hvac';
    else if (n.includes('plumb')) craftType = 'plumber';
    else if (n.includes('electric')) craftType = 'electrician';
    else if (n.includes('roof')) craftType = 'roofer';
    else if (n.includes('paint')) craftType = 'painter';
    else if (n.includes('landscap')) craftType = 'gardener';
    else if (n.includes('clean')) craftType = 'cleaning';

    let lat: number, lon: number;
    try {
        const geo = await geocodeCity(city, env);
        lat = geo.lat;
        lon = geo.lon;
    } catch (e: any) {
        throw new Error(e?.message || 'Geocoding failed');
    }

    const query = `
        [out:json][timeout:20];
        (
            node["craft"="${craftType}"](around:${r},${lat},${lon});
            way["craft"="${craftType}"](around:${r},${lat},${lon});
            node["shop"="${craftType}"](around:${r},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
    `;

    let data: any;
    const overpassEndpoints = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter'
    ];
    let lastError = 'Unknown error';

    for (const url of overpassEndpoints) {
        const ovController = new AbortController();
        const ovTimer = setTimeout(() => ovController.abort(), 25000);
        try {
            const res = await fetch(url, {
                method: 'POST',
                body: 'data=' + encodeURIComponent(query),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                signal: ovController.signal
            });
            if (!res.ok) throw new Error(`Overpass error ${res.status}`);
            data = await res.json();
            clearTimeout(ovTimer);
            break;
        } catch (e: any) {
            clearTimeout(ovTimer);
            lastError = e?.name === 'AbortError' ? 'Overpass timeout' : (e?.message || 'Overpass network error');
        }
    }

    if (!data) {
        throw new Error('Overpass query failed: ' + lastError);
    }

    const seen = new Set<string>();
    const businesses: any[] = [];

    for (const el of (data.elements || []).slice(0, 200)) { // Hard cap at 200 businesses
        if (!el.tags?.name) continue;

        const key = el.tags.name.toLowerCase().trim();
        if (seen.has(key)) continue; // Deduplicate by name
        seen.add(key);

        businesses.push({
            osm_id: String(el.id),
            name: el.tags.name,
            lat: el.lat ?? el.center?.lat ?? lat,
            lon: el.lon ?? el.center?.lon ?? lon,
            phone: el.tags.phone || el.tags['contact:phone'] || null,
            website: el.tags.website || el.tags['contact:website'] || null,
            address: el.tags['addr:street']
                ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}`.trim()
                : null
        });
    }

    return businesses;
}
