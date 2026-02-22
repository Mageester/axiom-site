-- 0001_secure_auth.sql

DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    must_change_password BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    last_seen_at TIMESTAMP,
    ip TEXT,
    user_agent TEXT
);

CREATE TABLE login_attempts (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 1,
    first_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
