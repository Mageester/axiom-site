-- 0005_omniscient.sql

CREATE TABLE IF NOT EXISTS omniscient_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    niche TEXT NOT NULL,
    city TEXT NOT NULL,
    category TEXT,
    address TEXT,
    phone TEXT,
    website_url TEXT,
    email TEXT,
    social_link TEXT,
    rating REAL,
    review_count INTEGER,
    website_status TEXT,
    contact_name TEXT,
    tactical_note TEXT,
    lead_score INTEGER,
    website_grade TEXT,
    axiom_score INTEGER,
    axiom_tier TEXT,
    score_breakdown TEXT,
    pain_signals TEXT,
    call_opener TEXT,
    follow_up_question TEXT,
    axiom_website_assessment TEXT,
    dedupe_key TEXT,
    dedupe_matched_by TEXT,
    email_type TEXT,
    email_confidence REAL,
    phone_confidence REAL,
    disqualifiers TEXT,
    disqualify_reason TEXT,
    source TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated TEXT
);

CREATE TABLE IF NOT EXISTS omniscient_audit_events (
    id TEXT PRIMARY KEY,
    actor_user_id TEXT,
    actor_username TEXT,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    ip_address TEXT,
    metadata_json TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS omniscient_rate_limit_windows (
    id TEXT PRIMARY KEY,
    limiter_key TEXT NOT NULL UNIQUE,
    scope TEXT NOT NULL,
    window_start TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS omniscient_scrape_runs (
    id TEXT PRIMARY KEY,
    actor_user_id TEXT,
    actor_username TEXT,
    status TEXT NOT NULL,
    niche TEXT NOT NULL,
    city TEXT NOT NULL,
    error_message TEXT,
    metadata_json TEXT,
    started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_omniscient_leads_dedupe_key
ON omniscient_leads(dedupe_key);

CREATE INDEX IF NOT EXISTS idx_omniscient_leads_created_at
ON omniscient_leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_omniscient_leads_archived_created
ON omniscient_leads(is_archived, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_omniscient_leads_tier
ON omniscient_leads(axiom_tier);

CREATE INDEX IF NOT EXISTS idx_omniscient_leads_city
ON omniscient_leads(city);

CREATE INDEX IF NOT EXISTS idx_omniscient_leads_niche
ON omniscient_leads(niche);

CREATE INDEX IF NOT EXISTS idx_omniscient_rate_limit_scope
ON omniscient_rate_limit_windows(scope, window_start);

CREATE INDEX IF NOT EXISTS idx_omniscient_scrape_runs_status_started
ON omniscient_scrape_runs(status, started_at DESC);
