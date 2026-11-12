"""Data access for posts, site settings and the single administrator."""

from __future__ import annotations

import json
import re
import sqlite3
import unicodedata
from collections import Counter
from datetime import datetime, timezone
from typing import Any, Iterable

from . import seed_data
from .appearance import compute_appearance
from .rendering import make_excerpt, reading_minutes, render_markdown
from .security import hash_password, iso_utc
from .ui_copy import DEFAULT_UI_COPY

PUBLIC_SETTING_KEYS = (
    "site_title",
    "site_subtitle",
    "site_description",
    "seo_title",
    "seo_description",
    "seo_keywords",
    "author_name",
    "author_bio",
    "icp_number",
    "icp_link",
    "police_number",
    "police_link",
    "copyright",
    "footer_note",
    "site_since",
    "site_url",
)

ADMIN_SETTING_KEYS = PUBLIC_SETTING_KEYS + (
    "about_md",
    "ui_copy",
    "layout_style",
    "theme_mode",
    "theme_timezone",
    "ntp_server",
    "day_start",
    "night_start",
)


def _loads_tags(raw: str | None) -> list[str]:
    try:
        value = json.loads(raw or "[]")
    except json.JSONDecodeError:
        return []
    if not isinstance(value, list):
        return []
    return [str(tag) for tag in value if str(tag).strip()]


def _strip_markup(source: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[#>*_`~\-|]", " ", source or "")).strip()


def _summary(row: sqlite3.Row) -> dict[str, Any]:
    content = row["content_md"] or ""
    return {
        "slug": row["slug"],
        "title": row["title"],
        "excerpt": row["excerpt"] or make_excerpt(content),
        "tags": _loads_tags(row["tags"]),
        "reading_minutes": reading_minutes(content),
        "published_at": row["published_at"],
        "updated_at": row["updated_at"],
    }


def _public_tags(rows: Iterable[sqlite3.Row]) -> list[dict[str, Any]]:
    counter: Counter[str] = Counter()
    for row in rows:
        counter.update(_loads_tags(row["tags"]))
    return [
        {"name": name, "count": count}
        for name, count in sorted(counter.items(), key=lambda item: (-item[1], item[0]))
    ]


def list_public_posts(
    conn: sqlite3.Connection,
    *,
    tag: str | None = None,
    query: str | None = None,
    limit: int | None = None,
) -> dict[str, Any]:
    rows = conn.execute(
        "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL "
        "ORDER BY published_at DESC, id DESC"
    ).fetchall()

    all_tags = _public_tags(rows)
    filtered = rows
    if tag:
        wanted = tag.strip().lower()
        filtered = [
            row for row in filtered if wanted in {item.lower() for item in _loads_tags(row["tags"])}
        ]
    if query:
        needle = query.strip().lower()
        if needle:
            filtered = [
                row
                for row in filtered
                if needle
                in (
                    f"{row['title']} {row['excerpt']} "
                    f"{_strip_markup(row['content_md'])} "
                    f"{' '.join(_loads_tags(row['tags']))}"
                ).lower()
            ]
    if limit is not None:
        filtered = filtered[: max(0, limit)]
    return {
        "posts": [_summary(row) for row in filtered],
        "total": len(filtered),
        "tags": all_tags,
    }


def get_public_post(conn: sqlite3.Connection, slug: str) -> dict[str, Any] | None:
    row = conn.execute(
        "SELECT * FROM posts WHERE slug = ? AND status = 'published' "
        "AND published_at IS NOT NULL",
        (slug,),
    ).fetchone()
    if row is None:
        return None

    post = _summary(row)
    post["content_html"] = render_markdown(row["content_md"] or "")

    newer = conn.execute(
        "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL "
        "AND published_at > ? ORDER BY published_at ASC LIMIT 1",
        (row["published_at"],),
    ).fetchone()
    older = conn.execute(
        "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL "
        "AND published_at < ? ORDER BY published_at DESC LIMIT 1",
        (row["published_at"],),
    ).fetchone()

    def adjacent(adjacent_row: sqlite3.Row | None) -> dict[str, Any] | None:
        if adjacent_row is None:
            return None
        return {
            "slug": adjacent_row["slug"],
            "title": adjacent_row["title"],
            "published_at": adjacent_row["published_at"],
        }

    post["adjacent"] = {"newer": adjacent(newer), "older": adjacent(older)}
    return post


def list_admin_posts(conn: sqlite3.Connection) -> dict[str, Any]:
    rows = conn.execute(
        "SELECT * FROM posts ORDER BY updated_at DESC, id DESC"
    ).fetchall()
    posts = []
    for row in rows:
        summary = _summary(row)
        summary["id"] = row["id"]
        summary["status"] = row["status"]
        summary["created_at"] = row["created_at"]
        posts.append(summary)
    return {
        "posts": posts,
        "counts": {
            "all": len(posts),
            "published": sum(1 for post in posts if post["status"] == "published"),
            "draft": sum(1 for post in posts if post["status"] == "draft"),
        },
    }


def get_admin_post(conn: sqlite3.Connection, post_id: int) -> dict[str, Any] | None:
    row = conn.execute("SELECT * FROM posts WHERE id = ?", (post_id,)).fetchone()
    if row is None:
        return None
    return {
        "id": row["id"],
        "slug": row["slug"],
        "title": row["title"],
        "excerpt": row["excerpt"],
        "content_md": row["content_md"],
        "tags": _loads_tags(row["tags"]),
        "status": row["status"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "published_at": row["published_at"],
        "reading_minutes": reading_minutes(row["content_md"] or ""),
    }


def _normalize_slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKC", value).strip().lower()
    normalized = re.sub(r"[^\w\u3400-\u9fff-]+", "-", normalized, flags=re.UNICODE)
    normalized = re.sub(r"[\s_]+", "-", normalized)
    normalized = re.sub(r"-{2,}", "-", normalized).strip("-")
    return normalized[:90].strip("-") or f"note-{datetime.now(timezone.utc):%Y%m%d-%H%M%S}"


def unique_slug(
    conn: sqlite3.Connection,
    wanted: str,
    *,
    exclude_id: int | None = None,
) -> str:
    base = _normalize_slug(wanted)
    candidate = base
    suffix = 2
    while True:
        if exclude_id is None:
            row = conn.execute("SELECT id FROM posts WHERE slug = ?", (candidate,)).fetchone()
        else:
            row = conn.execute(
                "SELECT id FROM posts WHERE slug = ? AND id != ?",
                (candidate, exclude_id),
            ).fetchone()
        if row is None:
            return candidate
        candidate = f"{base}-{suffix}"
        suffix += 1


def create_post(
    conn: sqlite3.Connection,
    *,
    title: str,
    slug: str | None,
    excerpt: str,
    content_md: str,
    tags: list[str],
    status: str,
) -> dict[str, Any]:
    now = iso_utc()
    final_slug = unique_slug(conn, slug or title)
    final_excerpt = excerpt.strip() or make_excerpt(content_md)
    published_at = now if status == "published" else None
    cursor = conn.execute(
        "INSERT INTO posts "
        "(slug, title, excerpt, content_md, tags, status, created_at, updated_at, published_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            final_slug,
            title.strip(),
            final_excerpt,
            content_md,
            json.dumps(tags, ensure_ascii=False),
            status,
            now,
            now,
            published_at,
        ),
    )
    conn.commit()
    post_id = int(cursor.lastrowid)
    post = get_admin_post(conn, post_id)
    assert post is not None
    return post


def update_post(
    conn: sqlite3.Connection,
    post_id: int,
    *,
    title: str,
    slug: str | None,
    excerpt: str,
    content_md: str,
    tags: list[str],
    status: str,
) -> dict[str, Any] | None:
    existing = conn.execute("SELECT * FROM posts WHERE id = ?", (post_id,)).fetchone()
    if existing is None:
        return None

    now = iso_utc()
    final_slug = unique_slug(conn, slug or title, exclude_id=post_id)
    final_excerpt = excerpt.strip() or make_excerpt(content_md)
    published_at = existing["published_at"]
    if status == "published" and not published_at:
        published_at = now

    conn.execute(
        "UPDATE posts SET slug = ?, title = ?, excerpt = ?, content_md = ?, tags = ?, "
        "status = ?, updated_at = ?, published_at = ? WHERE id = ?",
        (
            final_slug,
            title.strip(),
            final_excerpt,
            content_md,
            json.dumps(tags, ensure_ascii=False),
            status,
            now,
            published_at,
            post_id,
        ),
    )
    conn.commit()
    return get_admin_post(conn, post_id)


def delete_post(conn: sqlite3.Connection, post_id: int) -> bool:
    cursor = conn.execute("DELETE FROM posts WHERE id = ?", (post_id,))
    conn.commit()
    return cursor.rowcount > 0


def get_all_settings(conn: sqlite3.Connection) -> dict[str, str]:
    values = dict(seed_data.DEFAULT_SETTINGS)
    for row in conn.execute("SELECT key, value FROM settings"):
        values[row["key"]] = row["value"]
    return {key: values.get(key, "") for key in ADMIN_SETTING_KEYS}


def _load_ui_copy(raw: str) -> dict[str, str]:
    copy = dict(DEFAULT_UI_COPY)
    try:
        stored = json.loads(raw or "{}")
    except json.JSONDecodeError:
        return copy
    if not isinstance(stored, dict):
        return copy
    for key, value in stored.items():
        if key in copy and isinstance(value, str):
            copy[key] = value
    return copy


def get_public_site(conn: sqlite3.Connection) -> dict[str, Any]:
    settings = get_all_settings(conn)
    site = {key: settings.get(key, "") for key in PUBLIC_SETTING_KEYS}
    site["about_html"] = render_markdown(settings.get("about_md", ""))
    site["ui_copy"] = _load_ui_copy(settings.get("ui_copy", ""))
    site["appearance"] = compute_appearance(settings)
    return site


def update_settings(conn: sqlite3.Connection, values: dict[str, str]) -> dict[str, str]:
    for key, value in values.items():
        if key not in ADMIN_SETTING_KEYS:
            continue
        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (key, value),
        )
    conn.commit()
    return get_all_settings(conn)


def get_dashboard_summary(conn: sqlite3.Connection) -> dict[str, Any]:
    rows = conn.execute(
        "SELECT * FROM posts ORDER BY updated_at DESC, id DESC"
    ).fetchall()
    tag_counter: Counter[str] = Counter()
    total_characters = 0
    total_reading = 0
    for row in rows:
        tag_counter.update(_loads_tags(row["tags"]))
        total_characters += len(row["content_md"] or "")
        total_reading += reading_minutes(row["content_md"] or "")

    recent = []
    for row in rows[:5]:
        recent.append(
            {
                "id": row["id"],
                "title": row["title"],
                "slug": row["slug"],
                "status": row["status"],
                "updated_at": row["updated_at"],
                "published_at": row["published_at"],
                "reading_minutes": reading_minutes(row["content_md"] or ""),
            }
        )

    return {
        "counts": {
            "all": len(rows),
            "published": sum(1 for row in rows if row["status"] == "published"),
            "draft": sum(1 for row in rows if row["status"] == "draft"),
            "tags": len(tag_counter),
            "characters": total_characters,
            "reading_minutes": total_reading,
        },
        "recent": recent,
        "top_tags": [
            {"name": name, "count": count}
            for name, count in sorted(
                tag_counter.items(), key=lambda item: (-item[1], item[0])
            )[:8]
        ],
        "last_updated": rows[0]["updated_at"] if rows else None,
    }


def get_admin_account(conn: sqlite3.Connection) -> sqlite3.Row | None:
    return conn.execute("SELECT * FROM admin WHERE id = 1").fetchone()


def update_admin_password(conn: sqlite3.Connection, username: str, new_password: str) -> None:
    conn.execute(
        "UPDATE admin SET password_hash = ?, password_changed_at = ? WHERE username = ?",
        (hash_password(new_password), iso_utc(), username),
    )
    conn.execute("DELETE FROM sessions")
    conn.commit()
