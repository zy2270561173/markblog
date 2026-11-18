"""Data access for posts, site settings and the single administrator."""

from __future__ import annotations

import html
import json
import re
import secrets
import sqlite3
import unicodedata
from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Any, Iterable

from . import search, seed_data
from .appearance import compute_appearance
from .rendering import make_excerpt, plain_text, reading_minutes, render_markdown
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
    "privacy_md",
    "disclaimer_md",
    "ui_copy",
    "layout_style",
    "theme_mode",
    "theme_timezone",
    "ntp_server",
    "day_start",
    "night_start",
    "baidu_push_token",
    "indexnow_key",
    "alert_webhook_url",
    "uptime_ping_url",
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
        "id": row["id"],
        "slug": row["slug"],
        "title": row["title"],
        "excerpt": row["excerpt"] or make_excerpt(content),
        "tags": _loads_tags(row["tags"]),
        "series": row["series"] or "",
        "series_order": row["series_order"] or 0,
        "cover_image": row["cover_image"] or "",
        "featured": bool(row["featured"]),
        "reading_minutes": reading_minutes(content),
        "published_at": row["published_at"],
        "updated_at": row["updated_at"],
    }


def _extract_toc(content_html: str) -> list[dict[str, Any]]:
    toc: list[dict[str, Any]] = []
    for match in re.finditer(
        r"<h([23])\s+id=\"([^\"]+)\"[^>]*>(.*?)</h\1>",
        content_html,
        flags=re.DOTALL | re.IGNORECASE,
    ):
        text = html.unescape(re.sub(r"<[^>]+>", "", match.group(3))).strip()
        if text:
            toc.append(
                {"level": int(match.group(1)), "id": match.group(2), "text": text}
            )
    return toc


def _search_snippet(row: sqlite3.Row, query: str) -> dict[str, str] | None:
    needle = query.strip()
    if not needle:
        return None
    candidates = [
        ("正文", plain_text(row["content_md"] or "")),
        ("标题", row["title"] or ""),
        ("摘要", row["excerpt"] or ""),
    ]
    lowered = needle.lower()
    for label, text in candidates:
        index = text.lower().find(lowered)
        if index < 0:
            continue
        start = max(0, index - 68)
        end = min(len(text), index + len(needle) + 92)
        before = text[start:index]
        after = text[index + len(needle) : end]
        if start:
            before = "…" + before
        if end < len(text):
            after = after + "…"
        return {
            "field": label,
            "before": before,
            "match": text[index : index + len(needle)],
            "after": after,
        }
    return None


def _published_rows(conn: sqlite3.Connection) -> list[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL "
        "ORDER BY featured DESC, published_at DESC, id DESC"
    ).fetchall()


def _repair_meta(raw: str) -> dict[str, Any]:
    default = {"risk": "low", "time": "", "tools": "", "models": "", "safety": ""}
    try:
        data = json.loads(raw or "{}")
    except json.JSONDecodeError:
        return default
    if not isinstance(data, dict):
        return default
    for key in default:
        if isinstance(data.get(key), str):
            default[key] = data[key]
    if default["risk"] not in {"low", "medium", "high"}:
        default["risk"] = "low"
    return default


def _series_catalog(rows: Iterable[sqlite3.Row]) -> list[dict[str, Any]]:
    counter: Counter[str] = Counter()
    for row in rows:
        name = (row["series"] or "").strip()
        if name:
            counter[name] += 1
    return [
        {"name": name, "count": count}
        for name, count in sorted(counter.items(), key=lambda item: (-item[1], item[0]))
    ]


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
    rows = _published_rows(conn)
    all_tags = _public_tags(rows)
    filtered = rows
    if tag:
        wanted = tag.strip().lower()
        filtered = [
            row for row in filtered if wanted in {item.lower() for item in _loads_tags(row["tags"])}
        ]

    needle = (query or "").strip()
    if needle:
        ranked_ids = search.search_ids(conn, needle)
        if ranked_ids:
            order = {post_id: index for index, post_id in enumerate(ranked_ids)}
            filtered = [row for row in filtered if row["id"] in order]
            filtered.sort(key=lambda row: order[row["id"]])
        else:
            lowered = needle.lower()
            filtered = [
                row
                for row in filtered
                if lowered
                in (
                    f"{row['title']} {row['excerpt']} "
                    f"{plain_text(row['content_md'] or '')} "
                    f"{' '.join(_loads_tags(row['tags']))}"
                ).lower()
            ]

    summaries = []
    for row in filtered:
        summary = _summary(row)
        if needle:
            summary["search_snippet"] = _search_snippet(row, needle)
        summaries.append(summary)

    if limit is not None:
        summaries = summaries[: max(0, limit)]
    return {
        "posts": summaries,
        "total": len(summaries),
        "tags": all_tags,
        "series": _series_catalog(rows),
        "query": needle,
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
    post["seo_title"] = row["seo_title"] or ""
    post["seo_description"] = row["seo_description"] or ""
    post["seo_keywords"] = row["seo_keywords"] or ""
    post["cover_image"] = row["cover_image"] or ""
    post["repair"] = _repair_meta(row["repair_meta"] or "{}")
    post["canonical_url"] = row["canonical_url"] or ""
    post["featured"] = bool(row["featured"])
    post["toc"] = _extract_toc(post["content_html"])
    post["views"] = _post_views(conn, int(row["id"]))
    post["related"] = _related_posts(conn, row)
    series_name = (row["series"] or "").strip()
    post["series_info"] = None
    if series_name:
        series_rows = conn.execute(
            "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL "
            "AND series = ? ORDER BY series_order ASC, published_at ASC, id ASC",
            (series_name,),
        ).fetchall()
        post["series_info"] = {
            "name": series_name,
            "posts": [_summary(item) for item in series_rows],
            "position": next(
                (
                    index + 1
                    for index, item in enumerate(series_rows)
                    if item["id"] == row["id"]
                ),
                1,
            ),
            "total": len(series_rows),
        }

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


def ensure_preview_token(conn: sqlite3.Connection, post_id: int) -> str | None:
    row = conn.execute(
        "SELECT preview_token FROM posts WHERE id = ?", (post_id,)
    ).fetchone()
    if row is None:
        return None
    token = row["preview_token"]
    if token:
        return token
    for _ in range(10):
        token = secrets.token_urlsafe(24)
        exists = conn.execute(
            "SELECT 1 FROM posts WHERE preview_token = ?", (token,)
        ).fetchone()
        if exists is None:
            break
    conn.execute(
        "UPDATE posts SET preview_token = ? WHERE id = ?", (token, post_id)
    )
    conn.commit()
    return token


def clear_preview_token(conn: sqlite3.Connection, post_id: int) -> None:
    conn.execute("UPDATE posts SET preview_token = '' WHERE id = ?", (post_id,))
    conn.commit()


def get_preview_post(
    conn: sqlite3.Connection, token: str
) -> dict[str, Any] | None:
    row = conn.execute(
        "SELECT * FROM posts WHERE preview_token = ? AND preview_token != ''",
        (token,),
    ).fetchone()
    if row is None:
        return None
    post = _summary(row)
    post["content_html"] = render_markdown(row["content_md"] or "")
    post["seo_title"] = row["seo_title"] or ""
    post["seo_description"] = row["seo_description"] or ""
    post["seo_keywords"] = row["seo_keywords"] or ""
    post["cover_image"] = row["cover_image"] or ""
    post["repair"] = _repair_meta(row["repair_meta"] or "{}")
    post["canonical_url"] = ""
    post["status"] = row["status"]
    post["toc"] = _extract_toc(post["content_html"])
    post["views"] = 0
    post["related"] = []
    post["series_info"] = None
    post["adjacent"] = {"newer": None, "older": None}
    post["preview"] = True
    return post


def _post_views(conn: sqlite3.Connection, post_id: int) -> int:
    row = conn.execute(
        "SELECT COALESCE(SUM(views), 0) AS total FROM post_views WHERE post_id = ?",
        (post_id,),
    ).fetchone()
    return int(row["total"] or 0)


def _post_completions(conn: sqlite3.Connection, post_id: int) -> int:
    row = conn.execute(
        "SELECT COALESCE(SUM(completions), 0) AS total FROM post_views WHERE post_id = ?",
        (post_id,),
    ).fetchone()
    return int(row["total"] or 0)


def _related_posts(
    conn: sqlite3.Connection, post: sqlite3.Row, limit: int = 3
) -> list[dict[str, Any]]:
    tags = {item.lower() for item in _loads_tags(post["tags"])}
    rows = conn.execute(
        "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL "
        "AND id != ? ORDER BY published_at DESC",
        (post["id"],),
    ).fetchall()
    scored: list[tuple[int, sqlite3.Row]] = []
    for row in rows:
        overlap = len(tags & {item.lower() for item in _loads_tags(row["tags"])})
        if overlap:
            scored.append((overlap, row))
    scored.sort(
        key=lambda item: (item[0], item[1]["published_at"] or ""), reverse=True
    )
    if not scored:
        return [_summary(row) for row in rows[:limit]]
    return [_summary(row) for _, row in scored[:limit]]


def get_public_series(conn: sqlite3.Connection, name: str) -> dict[str, Any] | None:
    clean = name.strip()
    if not clean:
        return None
    rows = conn.execute(
        "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL "
        "AND series = ? ORDER BY series_order ASC, published_at ASC, id ASC",
        (clean,),
    ).fetchall()
    if not rows:
        return None
    return {
        "name": clean,
        "posts": [_summary(row) for row in rows],
        "total": len(rows),
    }


def record_view(
    conn: sqlite3.Connection,
    slug: str,
    *,
    complete: bool = False,
    referrer_host: str = "",
) -> bool:
    row = conn.execute(
        "SELECT id FROM posts WHERE slug = ? AND status = 'published' "
        "AND published_at IS NOT NULL",
        (slug,),
    ).fetchone()
    if row is None:
        return False
    day = datetime.now(timezone.utc).date().isoformat()
    completion = 1 if complete else 0
    conn.execute(
        "INSERT INTO post_views (post_id, day, views, completions) VALUES (?, ?, 1, ?) "
        "ON CONFLICT(post_id, day) DO UPDATE SET views = views + ?, "
        "completions = completions + ?",
        (
            row["id"],
            day,
            completion,
            0 if complete else 1,
            completion,
        ),
    )
    host = (referrer_host or "").strip().lower()[:120]
    if host and not complete:
        conn.execute(
            "INSERT INTO post_referrers (post_id, day, host, views) VALUES (?, ?, ?, 1) "
            "ON CONFLICT(post_id, day, host) DO UPDATE SET views = views + 1",
            (row["id"], day, host),
        )
    conn.commit()
    return True


def publish_due_posts(conn: sqlite3.Connection) -> int:
    now = iso_utc()
    rows = conn.execute(
        "SELECT id, scheduled_at FROM posts WHERE status = 'draft' "
        "AND scheduled_at IS NOT NULL AND scheduled_at <= ?",
        (now,),
    ).fetchall()
    for row in rows:
        published_at = row["scheduled_at"] or now
        conn.execute(
            "UPDATE posts SET status = 'published', published_at = ?, scheduled_at = NULL, "
            "updated_at = ? WHERE id = ?",
            (published_at, now, row["id"]),
        )
        search.index_post(conn, int(row["id"]))
    if rows:
        conn.commit()
    return len(rows)


def list_admin_posts(conn: sqlite3.Connection) -> dict[str, Any]:
    rows = conn.execute(
        "SELECT p.*, COALESCE((SELECT SUM(v.views) FROM post_views v "
        "WHERE v.post_id = p.id), 0) AS view_count "
        "FROM posts p ORDER BY p.updated_at DESC, p.id DESC"
    ).fetchall()
    posts = []
    for row in rows:
        summary = _summary(row)
        summary["status"] = (
            "scheduled"
            if row["status"] == "draft" and row["scheduled_at"]
            else row["status"]
        )
        summary["scheduled_at"] = row["scheduled_at"]
        summary["view_count"] = int(row["view_count"] or 0)
        summary["created_at"] = row["created_at"]
        posts.append(summary)
    return {
        "posts": posts,
        "counts": {
            "all": len(posts),
            "published": sum(1 for post in posts if post["status"] == "published"),
            "draft": sum(1 for post in posts if post["status"] == "draft"),
            "scheduled": sum(1 for post in posts if post["status"] == "scheduled"),
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
        "status": (
            "scheduled"
            if row["status"] == "draft" and row["scheduled_at"]
            else row["status"]
        ),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "published_at": row["published_at"],
        "scheduled_at": row["scheduled_at"],
        "series": row["series"] or "",
        "series_order": row["series_order"] or 0,
        "seo_title": row["seo_title"] or "",
        "seo_description": row["seo_description"] or "",
        "seo_keywords": row["seo_keywords"] or "",
        "cover_image": row["cover_image"] or "",
        "featured": bool(row["featured"]),
        "repair": _repair_meta(row["repair_meta"] or "{}"),
        "canonical_url": row["canonical_url"] or "",
        "views": _post_views(conn, int(row["id"])),
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
    scheduled_at: str | None = None,
    series: str = "",
    series_order: int = 0,
    seo_title: str = "",
    seo_description: str = "",
    seo_keywords: str = "",
    cover_image: str = "",
    featured: bool = False,
    repair_meta: dict[str, Any] | None = None,
    canonical_url: str = "",
) -> dict[str, Any]:
    now = iso_utc()
    final_slug = unique_slug(conn, slug or title)
    final_excerpt = excerpt.strip() or make_excerpt(content_md)
    published_at = now if status == "published" else None
    final_scheduled = scheduled_at if status == "draft" else None
    cursor = conn.execute(
        "INSERT INTO posts "
        "(slug, title, excerpt, content_md, tags, status, created_at, updated_at, "
        "published_at, scheduled_at, series, series_order, seo_title, "
        "seo_description, seo_keywords, cover_image, featured, repair_meta, canonical_url) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
            final_scheduled,
            series.strip()[:60],
            series_order,
            seo_title.strip()[:120],
            seo_description.strip()[:300],
            seo_keywords.strip()[:300],
            cover_image.strip()[:500],
            1 if featured else 0,
            json.dumps(repair_meta or {}, ensure_ascii=False),
            canonical_url.strip()[:400],
        ),
    )
    conn.commit()
    post_id = int(cursor.lastrowid)
    search.index_post(conn, post_id)
    conn.commit()
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
    scheduled_at: str | None = None,
    series: str = "",
    series_order: int = 0,
    seo_title: str = "",
    seo_description: str = "",
    seo_keywords: str = "",
    cover_image: str = "",
    featured: bool = False,
    repair_meta: dict[str, Any] | None = None,
    canonical_url: str = "",
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
    final_scheduled = scheduled_at if status == "draft" else None

    _insert_revision(conn, existing)
    if existing["status"] == "published" and final_slug != existing["slug"]:
        _create_redirect(
            conn, f"/posts/{existing['slug']}", f"/posts/{final_slug}"
        )
    conn.execute(
        "UPDATE posts SET slug = ?, title = ?, excerpt = ?, content_md = ?, tags = ?, "
        "status = ?, updated_at = ?, published_at = ?, scheduled_at = ?, series = ?, "
        "series_order = ?, seo_title = ?, seo_description = ?, seo_keywords = ?, "
        "cover_image = ?, featured = ?, repair_meta = ?, canonical_url = ? WHERE id = ?",
        (
            final_slug,
            title.strip(),
            final_excerpt,
            content_md,
            json.dumps(tags, ensure_ascii=False),
            status,
            now,
            published_at,
            final_scheduled,
            series.strip()[:60],
            series_order,
            seo_title.strip()[:120],
            seo_description.strip()[:300],
            seo_keywords.strip()[:300],
            cover_image.strip()[:500],
            1 if featured else 0,
            json.dumps(repair_meta or {}, ensure_ascii=False),
            canonical_url.strip()[:400],
            post_id,
        ),
    )
    conn.commit()
    search.index_post(conn, post_id)
    _trim_revisions(conn, post_id)
    conn.commit()
    return get_admin_post(conn, post_id)


def delete_post(conn: sqlite3.Connection, post_id: int) -> bool:
    cursor = conn.execute("DELETE FROM posts WHERE id = ?", (post_id,))
    conn.commit()
    if cursor.rowcount > 0:
        search.remove_post(conn, post_id)
        conn.commit()
    return cursor.rowcount > 0


REVISION_LIMIT = 30


def _insert_revision(conn: sqlite3.Connection, row: sqlite3.Row) -> None:
    conn.execute(
        "INSERT INTO post_revisions "
        "(post_id, title, excerpt, content_md, tags, series, series_order, "
        "seo_title, seo_description, seo_keywords, cover_image, repair_meta, "
        "canonical_url, created_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            row["id"],
            row["title"],
            row["excerpt"] or "",
            row["content_md"] or "",
            row["tags"] or "[]",
            row["series"] or "",
            row["series_order"] or 0,
            row["seo_title"] or "",
            row["seo_description"] or "",
            row["seo_keywords"] or "",
            row["cover_image"] or "",
            row["repair_meta"] or "{}",
            row["canonical_url"] or "",
            iso_utc(),
        ),
    )


def _trim_revisions(conn: sqlite3.Connection, post_id: int) -> None:
    conn.execute(
        "DELETE FROM post_revisions WHERE post_id = ? AND id NOT IN "
        "(SELECT id FROM post_revisions WHERE post_id = ? ORDER BY id DESC LIMIT ?)",
        (post_id, post_id, REVISION_LIMIT),
    )


def list_revisions(conn: sqlite3.Connection, post_id: int) -> list[dict[str, Any]]:
    rows = conn.execute(
        "SELECT * FROM post_revisions WHERE post_id = ? ORDER BY id DESC",
        (post_id,),
    ).fetchall()
    return [
        {
            "id": row["id"],
            "title": row["title"],
            "excerpt": row["excerpt"],
            "content_md": row["content_md"],
            "tags": _loads_tags(row["tags"]),
            "series": row["series"],
            "series_order": row["series_order"],
            "seo_title": row["seo_title"],
            "seo_description": row["seo_description"],
            "seo_keywords": row["seo_keywords"],
            "cover_image": row["cover_image"],
            "repair": _repair_meta(row["repair_meta"] or "{}"),
            "canonical_url": row["canonical_url"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


def restore_revision(
    conn: sqlite3.Connection, post_id: int, revision_id: int
) -> dict[str, Any] | None:
    current = conn.execute("SELECT * FROM posts WHERE id = ?", (post_id,)).fetchone()
    revision = conn.execute(
        "SELECT * FROM post_revisions WHERE id = ? AND post_id = ?",
        (revision_id, post_id),
    ).fetchone()
    if current is None or revision is None:
        return None
    _insert_revision(conn, current)
    conn.execute(
        "UPDATE posts SET title = ?, excerpt = ?, content_md = ?, tags = ?, "
        "series = ?, series_order = ?, seo_title = ?, seo_description = ?, "
        "seo_keywords = ?, cover_image = ?, repair_meta = ?, canonical_url = ?, "
        "updated_at = ? WHERE id = ?",
        (
            revision["title"],
            revision["excerpt"],
            revision["content_md"],
            revision["tags"],
            revision["series"],
            revision["series_order"],
            revision["seo_title"],
            revision["seo_description"],
            revision["seo_keywords"],
            revision["cover_image"],
            revision["repair_meta"],
            revision["canonical_url"],
            iso_utc(),
            post_id,
        ),
    )
    conn.commit()
    search.index_post(conn, post_id)
    _trim_revisions(conn, post_id)
    conn.commit()
    return get_admin_post(conn, post_id)


def duplicate_post(conn: sqlite3.Connection, post_id: int) -> dict[str, Any] | None:
    row = conn.execute("SELECT * FROM posts WHERE id = ?", (post_id,)).fetchone()
    if row is None:
        return None
    repair = _repair_meta(row["repair_meta"] or "{}")
    return create_post(
        conn,
        title=f"{row['title']}（副本）",
        slug=unique_slug(conn, f"{row['slug']}-copy"),
        excerpt=row["excerpt"],
        content_md=row["content_md"],
        tags=_loads_tags(row["tags"]),
        status="draft",
        series=row["series"] or "",
        series_order=row["series_order"] or 0,
        seo_title=row["seo_title"] or "",
        seo_description=row["seo_description"] or "",
        seo_keywords=row["seo_keywords"] or "",
        cover_image=row["cover_image"] or "",
        featured=False,
        repair_meta=repair,
        canonical_url="",
    )


def batch_update_posts(
    conn: sqlite3.Connection,
    ids: list[int],
    action: str,
    tags: list[str] | None = None,
) -> int:
    now = iso_utc()
    updated = 0
    for post_id in ids:
        row = conn.execute("SELECT * FROM posts WHERE id = ?", (post_id,)).fetchone()
        if row is None:
            continue
        if action == "delete":
            conn.execute("DELETE FROM posts WHERE id = ?", (post_id,))
            search.remove_post(conn, post_id)
            updated += 1
            continue
        if action == "publish":
            conn.execute(
                "UPDATE posts SET status = 'published', published_at = "
                "COALESCE(published_at, ?), scheduled_at = NULL, updated_at = ? "
                "WHERE id = ?",
                (now, now, post_id),
            )
        elif action == "draft":
            conn.execute(
                "UPDATE posts SET status = 'draft', scheduled_at = NULL, updated_at = ? "
                "WHERE id = ?",
                (now, post_id),
            )
        elif action == "tag":
            merged = list(dict.fromkeys(_loads_tags(row["tags"]) + list(tags or [])))[:8]
            conn.execute(
                "UPDATE posts SET tags = ?, updated_at = ? WHERE id = ?",
                (json.dumps(merged, ensure_ascii=False), now, post_id),
            )
        else:
            continue
        updated += 1
        search.index_post(conn, post_id)
    conn.commit()
    return updated


def _create_redirect(conn: sqlite3.Connection, path: str, target: str) -> None:
    conn.execute(
        "INSERT INTO redirects (path, target, created_at) VALUES (?, ?, ?) "
        "ON CONFLICT(path) DO UPDATE SET target = excluded.target",
        (path, target, iso_utc()),
    )


def list_redirects(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = conn.execute("SELECT * FROM redirects ORDER BY id DESC").fetchall()
    return [dict(row) for row in rows]


def add_redirect(conn: sqlite3.Connection, path: str, target: str) -> dict[str, Any]:
    _create_redirect(conn, path, target)
    conn.commit()
    row = conn.execute("SELECT * FROM redirects WHERE path = ?", (path,)).fetchone()
    return dict(row) if row else {}


def delete_redirect(conn: sqlite3.Connection, redirect_id: int) -> bool:
    cursor = conn.execute("DELETE FROM redirects WHERE id = ?", (redirect_id,))
    conn.commit()
    return cursor.rowcount > 0


def find_redirect(conn: sqlite3.Connection, path: str) -> str | None:
    row = conn.execute(
        "SELECT target FROM redirects WHERE path = ?", (path,)
    ).fetchone()
    return row["target"] if row else None


def log_not_found(
    conn: sqlite3.Connection, path: str, referrer: str = "", user_agent: str = ""
) -> None:
    conn.execute(
        "INSERT INTO not_found_logs (path, referrer, user_agent, created_at) "
        "VALUES (?, ?, ?, ?)",
        (path[:300], referrer[:500], user_agent[:500], iso_utc()),
    )
    conn.commit()


def list_not_found(conn: sqlite3.Connection, limit: int = 50) -> list[dict[str, Any]]:
    rows = conn.execute(
        "SELECT * FROM not_found_logs ORDER BY id DESC LIMIT ?", (limit,)
    ).fetchall()
    return [dict(row) for row in rows]


def clear_not_found(conn: sqlite3.Connection) -> None:
    conn.execute("DELETE FROM not_found_logs")
    conn.commit()


def log_audit(
    conn: sqlite3.Connection, action: str, detail: str = "", ip: str = ""
) -> None:
    conn.execute(
        "INSERT INTO admin_audit (action, detail, ip, created_at) VALUES (?, ?, ?, ?)",
        (action[:80], detail[:500], ip[:80], iso_utc()),
    )
    conn.commit()


def list_audit(conn: sqlite3.Connection, limit: int = 80) -> list[dict[str, Any]]:
    rows = conn.execute(
        "SELECT * FROM admin_audit ORDER BY id DESC LIMIT ?", (limit,)
    ).fetchall()
    return [dict(row) for row in rows]


def log_app_error(conn: sqlite3.Connection, path: str, message: str) -> None:
    conn.execute(
        "INSERT INTO app_errors (path, message, created_at) VALUES (?, ?, ?)",
        (path[:300], message[:1000], iso_utc()),
    )
    conn.commit()


def list_app_errors(conn: sqlite3.Connection, limit: int = 30) -> list[dict[str, Any]]:
    rows = conn.execute(
        "SELECT * FROM app_errors ORDER BY id DESC LIMIT ?", (limit,)
    ).fetchall()
    return [dict(row) for row in rows]


def clear_app_errors(conn: sqlite3.Connection) -> None:
    conn.execute("DELETE FROM app_errors")
    conn.commit()


def set_admin_totp(
    conn: sqlite3.Connection, secret: str, enabled: bool
) -> None:
    conn.execute(
        "UPDATE admin SET totp_secret = ?, totp_enabled = ? WHERE id = 1",
        (secret, 1 if enabled else 0),
    )
    conn.commit()


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
    site["privacy_html"] = render_markdown(settings.get("privacy_md", ""))
    site["disclaimer_html"] = render_markdown(settings.get("disclaimer_md", ""))
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
                "status": (
                    "scheduled"
                    if row["status"] == "draft" and row["scheduled_at"]
                    else row["status"]
                ),
                "updated_at": row["updated_at"],
                "published_at": row["published_at"],
                "scheduled_at": row["scheduled_at"],
                "views": _post_views(conn, int(row["id"])),
                "reading_minutes": reading_minutes(row["content_md"] or ""),
            }
        )

    today = datetime.now(timezone.utc).date()
    trend_days = [today - timedelta(days=offset) for offset in range(6, -1, -1)]
    trend_rows = conn.execute(
        "SELECT day, SUM(views) AS total FROM post_views WHERE day >= ? "
        "GROUP BY day ORDER BY day",
        (trend_days[0].isoformat(),),
    ).fetchall()
    trend_lookup = {row["day"]: int(row["total"] or 0) for row in trend_rows}
    views_today = trend_lookup.get(today.isoformat(), 0)
    views_total = int(
        conn.execute("SELECT COALESCE(SUM(views), 0) FROM post_views").fetchone()[0]
    )
    top_posts = conn.execute(
        "SELECT p.id, p.title, p.slug, COALESCE(SUM(v.views), 0) AS views "
        "FROM posts p LEFT JOIN post_views v ON v.post_id = p.id "
        "WHERE p.status = 'published' GROUP BY p.id ORDER BY views DESC, p.id DESC LIMIT 5"
    ).fetchall()
    completion_total = int(
        conn.execute("SELECT COALESCE(SUM(completions), 0) FROM post_views").fetchone()[0]
    )
    referrer_rows = conn.execute(
        "SELECT host, SUM(views) AS views FROM post_referrers "
        "WHERE day >= ? GROUP BY host ORDER BY views DESC LIMIT 6",
        ((today - timedelta(days=29)).isoformat(),),
    ).fetchall()
    tag_views: Counter[str] = Counter()
    for row in rows:
        if row["status"] != "published":
            continue
        views = _post_views(conn, int(row["id"]))
        for tag in _loads_tags(row["tags"]):
            tag_views[tag] += views

    return {
        "counts": {
            "all": len(rows),
            "published": sum(1 for row in rows if row["status"] == "published"),
            "draft": sum(
                1
                for row in rows
                if row["status"] == "draft" and not row["scheduled_at"]
            ),
            "scheduled": sum(
                1
                for row in rows
                if row["status"] == "draft" and row["scheduled_at"]
            ),
            "tags": len(tag_counter),
            "characters": total_characters,
            "reading_minutes": total_reading,
            "views_total": views_total,
            "views_today": views_today,
            "completions_total": completion_total,
            "completion_rate": (
                round(completion_total / views_total * 100, 1) if views_total else 0
            ),
        },
        "recent": recent,
        "views_trend": [
            {
                "day": day.isoformat(),
                "label": f"{day.month}/{day.day}",
                "views": trend_lookup.get(day.isoformat(), 0),
            }
            for day in trend_days
        ],
        "top_posts": [
            {
                "id": row["id"],
                "title": row["title"],
                "slug": row["slug"],
                "views": int(row["views"] or 0),
            }
            for row in top_posts
        ],
        "referrers": [
            {"host": row["host"], "views": int(row["views"] or 0)}
            for row in referrer_rows
        ],
        "popular_tags": [
            {"name": name, "views": views}
            for name, views in sorted(
                tag_views.items(), key=lambda item: (-item[1], item[0])
            )[:8]
        ],
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
