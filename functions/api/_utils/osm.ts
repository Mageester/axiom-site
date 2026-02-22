export async function fetchOsmBusinesses(niche: string, city: string, radiusKm: number) {
    const r = radiusKm * 1000;
    let craftType = '';

    // Map nice niches to OSM tags loosely
    const n = niche.toLowerCase();
    if (n.includes('hvac')) craftType = 'hvac';
    else if (n.includes('plumb')) craftType = 'plumber';
    else if (n.includes('electric')) craftType = 'electrician';
    else if (n.includes('roof')) craftType = 'roofer';
    else craftType = n.replace(/[^a-z_]/g, '');

    // Get city bounding/center node via Nominatim
    const nomUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`;
    const nomRes = await fetch(nomUrl, { headers: { 'User-Agent': 'Axiom-Internal-Audit/1.0' } });
    if (!nomRes.ok) throw new Error("Failed nominatim fetch");
    const nomData = await nomRes.json();
    if (nomData.length === 0) throw new Error("City not found");

    const lat = parseFloat(nomData[0].lat);
    const lon = parseFloat(nomData[0].lon);

    // Query Overpass
    const query = `
        [out:json][timeout:25];
        (
            node["craft"="${craftType}"](around:${r},${lat},${lon});
            way["craft"="${craftType}"](around:${r},${lat},${lon});
            node["shop"="${craftType}"](around:${r},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
    `;

    const url = 'https://overpass-api.de/api/interpreter';
    const res = await fetch(url, {
        method: 'POST',
        body: "data=" + encodeURIComponent(query),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!res.ok) throw new Error(`Overpass fetch failed: ${res.status}`);
    const data = await res.json();

    const businesses = [];
    for (const el of data.elements) {
        if (el.tags && el.tags.name) {
            businesses.push({
                osm_id: el.id.toString(),
                name: el.tags.name,
                lat: el.lat || el.center?.lat || lat,
                lon: el.lon || el.center?.lon || lon,
                phone: el.tags.phone || el.tags['contact:phone'] || null,
                website: el.tags.website || el.tags['contact:website'] || null,
                address: el.tags['addr:street'] ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}`.trim() : null
            });
        }
    }

    // Deduplicate by name & approximate coords
    return businesses;
}
