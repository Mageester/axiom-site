CREATE TABLE IF NOT EXISTS website_inquiries (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    business_name TEXT NOT NULL,
    phone TEXT,
    current_website TEXT,
    primary_goal TEXT NOT NULL,
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    source_path TEXT,
    user_agent TEXT,
    ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_website_inquiries_created_at ON website_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_website_inquiries_status ON website_inquiries(status);
