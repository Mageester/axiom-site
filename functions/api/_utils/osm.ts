export async function fetchOsmBusinesses(niche: string, city: string, radiusKm: number) {
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

    // Get city center via Nominatim — with timeout
    const nomController = new AbortController();
    const nomTimer = setTimeout(() => nomController.abort(), 8000);

    let lat: number, lon: number;
    try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`;
        const nomRes = await fetch(nomUrl, {
            headers: { 'User-Agent': 'Axiom-Intel/1.0 (internal research tool)' },
            signal: nomController.signal
        });
        clearTimeout(nomTimer);
        if (!nomRes.ok) throw new Error(`Nominatim error: ${nomRes.status}`);
        const nomData: any[] = await nomRes.json();
        if (nomData.length === 0) throw new Error(`City not found: ${city}`);
        lat = parseFloat(nomData[0].lat);
        lon = parseFloat(nomData[0].lon);
        if (isNaN(lat) || isNaN(lon)) throw new Error('Invalid coordinates returned');
    } catch (e: any) {
        clearTimeout(nomTimer);
        throw new Error('Geocoding failed: ' + e.message);
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
