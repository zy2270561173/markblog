"""SQLite FTS5 helpers for Chinese full-text search.

The trigram tokenizer works well for substring matching in Chinese. SQLite
builds without FTS5 simply fall back to the application-level LIKE search.
"""

from __future__ import annotations

import json
import logging
import sqlite3

from .rendering import plain_text

logger = logging.getLogger("markblog.search")
FTS_TABLE = "posts_fts"


def ensure_schema(conn: sqlite3.Connection) -> bool:
    try:
        conn.execute(
            f"CREATE VIRTUAL TABLE IF NOT EXISTS {FTS_TABLE} USING fts5("
            "post_id UNINDEXED, title, excerpt, body, tags, tokenize='trigram')"
        )
        return True
    except sqlite3.OperationalError as error:
        logger.warning("FTS5 is unavailable; using fallback search: %s", error)
        return False


def _post_text(row: sqlite3.Row) -> tuple[str, str, str, str]:
    try:
        tags = " ".join(str(tag) for tag in json.loads(row["tags"] or "[]"))
    except (json.JSONDecodeError, TypeError):
        tags = ""
    return (
        row["title"] or "",
        row["excerpt"] or "",
        plain_text(row["content_md"] or ""),
        tags,
    )


def index_post(conn: sqlite3.Connection, post_id: int) -> None:
    try:
        row = conn.execute("SELECT * FROM posts WHERE id = ?", (post_id,)).fetchone()
        if row is None:
            return
        conn.execute(f"DELETE FROM {FTS_TABLE} WHERE post_id = ?", (post_id,))
        title, excerpt, body, tags = _post_text(row)
        conn.execute(
            f"INSERT INTO {FTS_TABLE} (post_id, title, excerpt, body, tags) "
            "VALUES (?, ?, ?, ?, ?)",
            (post_id, title, excerpt, body, tags),
        )
    except sqlite3.OperationalError:
        # Search is an enhancement and must never break publishing.
        logger.exception("Could not update the full-text index for post %s", post_id)


def remove_post(conn: sqlite3.Connection, post_id: int) -> None:
    try:
        conn.execute(f"DELETE FROM {FTS_TABLE} WHERE post_id = ?", (post_id,))
    except sqlite3.OperationalError:
        logger.exception("Could not remove post %s from the full-text index", post_id)


def rebuild(conn: sqlite3.Connection) -> None:
    try:
        conn.execute(f"DELETE FROM {FTS_TABLE}")
        rows = conn.execute("SELECT * FROM posts").fetchall()
        for row in rows:
            title, excerpt, body, tags = _post_text(row)
            conn.execute(
                f"INSERT INTO {FTS_TABLE} (post_id, title, excerpt, body, tags) "
                "VALUES (?, ?, ?, ?, ?)",
                (row["id"], title, excerpt, body, tags),
            )
    except sqlite3.OperationalError:
        logger.exception("Could not rebuild the full-text index")


def search_ids(conn: sqlite3.Connection, query: str) -> list[int] | None:
    term = query.strip()
    if len(term) < 3:
        return None
    phrase = '"' + term.replace('"', '""') + '"'
    try:
        rows = conn.execute(
            f"SELECT post_id FROM {FTS_TABLE} WHERE {FTS_TABLE} MATCH ? "
            "ORDER BY rank LIMIT 100",
            (phrase,),
        ).fetchall()
    except sqlite3.OperationalError:
        return None
    return [int(row["post_id"]) for row in rows]
