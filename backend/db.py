"""SQLite connection, schema and first-run bootstrap."""

from __future__ import annotations

import json
import logging
import os
import secrets
import sqlite3
from typing import Iterator

from . import seed_data
from .config import get_settings
from .security import hash_password, iso_utc, utc_now

logger = logging.getLogger("markblog.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_changed_at TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    csrf_token TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content_md TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_posts_status_published
    ON posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_updated ON posts(updated_at DESC);
"""


def connect() -> sqlite3.Connection:
    settings = get_settings()
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    # FastAPI may run a synchronous dependency and its endpoint in different
    # worker threads. The connection is still request-scoped and is never
    # shared between requests, so check_same_thread must be relaxed.
    conn = sqlite3.connect(settings.db_path, timeout=15, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 15000")
    return conn


def get_db() -> Iterator[sqlite3.Connection]:
    conn = connect()
    try:
        yield conn
    finally:
        conn.close()


def _bootstrap_admin(conn: sqlite3.Connection) -> None:
    row = conn.execute("SELECT id FROM admin LIMIT 1").fetchone()
    if row is not None:
        return

    settings = get_settings()
    username = settings.admin_username
    password = settings.admin_password
    generated = False
    if not password:
        password = secrets.token_urlsafe(15)
        generated = True

    now = iso_utc()
    conn.execute(
        "INSERT INTO admin (id, username, password_hash, password_changed_at, created_at) "
        "VALUES (1, ?, ?, ?, ?)",
        (username, hash_password(password), now, now),
    )

    if generated:
        settings.data_dir.mkdir(parents=True, exist_ok=True)
        credentials_path = settings.data_dir / "initial-admin.txt"
        credentials_path.write_text(
            "Markblog initial administrator\n"
            f"username: {username}\npassword: {password}\n\n"
            "Change this password after signing in, then delete this file.\n",
            encoding="utf-8",
        )
        try:
            os.chmod(credentials_path, 0o600)
        except OSError:
            pass
        logger.warning(
            "No BLOG_ADMIN_PASSWORD was configured. Generated initial admin "
            "credentials in %s. Delete the file after first login.",
            credentials_path,
        )
    else:
        logger.info("Initial administrator account '%s' created.", username)


def _seed_settings(conn: sqlite3.Connection) -> None:
    values = dict(seed_data.DEFAULT_SETTINGS)
    for key, value in values.items():
        conn.execute(
            "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
            (key, value),
        )


def _seed_posts(conn: sqlite3.Connection) -> None:
    count = conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
    if count:
        return
    for post in seed_data.POSTS:
        conn.execute(
            "INSERT INTO posts "
            "(slug, title, excerpt, content_md, tags, status, created_at, updated_at, published_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                post["slug"],
                post["title"],
                post["excerpt"],
                post["content_md"],
                json.dumps(post["tags"], ensure_ascii=False),
                post["status"],
                post["created_at"],
                post["updated_at"],
                post["published_at"],
            ),
        )
    logger.info("Seeded %s starter posts.", len(seed_data.POSTS))


def init_db() -> None:
    """Create the database (if necessary), apply schema and seed missing rows."""

    settings = get_settings()
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    conn = connect()
    try:
        conn.executescript(SCHEMA)
        conn.execute(
            "DELETE FROM sessions WHERE expires_at < ?",
            (iso_utc(utc_now()),),
        )
        _seed_settings(conn)
        _bootstrap_admin(conn)
        _seed_posts(conn)
        conn.commit()
    finally:
        conn.close()
    logger.info("Database ready at %s", settings.db_path)
