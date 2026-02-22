-- 0000_schema.sql

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    niche TEXT NOT NULL,
    city TEXT NOT NULL,
    radius_km REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
    osm_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    address TEXT,
    phone TEXT,
    website_raw TEXT
);

CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    business_id TEXT NOT NULL REFERENCES businesses(osm_id),
    canonical_url TEXT,
    status TEXT DEFAULT 'new',
    notes TEXT,
    followup_at TIMESTAMP,
    last_audit_at TIMESTAMP,
    UNIQUE(campaign_id, business_id)
);

CREATE TABLE IF NOT EXISTS audits (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES leads(id),
    final_url TEXT,
    redirect_chain_json TEXT,
    https_supported INTEGER DEFAULT 0,
    http_to_https INTEGER DEFAULT 0,
    response_time_ms INTEGER,
    html_bytes INTEGER,
    has_form INTEGER DEFAULT 0,
    mailto_only INTEGER DEFAULT 0,
    has_booking INTEGER DEFAULT 0,
    has_chat INTEGER DEFAULT 0,
    has_tel_link INTEGER DEFAULT 0,
    contact_url TEXT,
    evidence_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY,
    audit_id TEXT NOT NULL REFERENCES audits(id),
    total INTEGER,
    breakdown_json TEXT,
    reasons_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS summaries (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES leads(id),
    audit_id TEXT NOT NULL REFERENCES audits(id),
    bullets_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    status TEXT DEFAULT 'queued',
    attempts INTEGER DEFAULT 0,
    run_after TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    locked_at TIMESTAMP,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
