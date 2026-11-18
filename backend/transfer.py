"""Backup, Markdown export and Markdown import."""

from __future__ import annotations

import io
import json
import re
import sqlite3
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from . import media, repository


def _metadata_post(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "title": row["title"],
        "slug": row["slug"],
        "status": row["status"],
        "published_at": row["published_at"] or "",
        "scheduled_at": row["scheduled_at"] or "",
        "excerpt": row["excerpt"] or "",
        "updated_at": row["updated_at"] or "",
        "tags": repository._loads_tags(row["tags"]),
        "series": row["series"] or "",
        "series_order": int(row["series_order"] or 0),
        "seo_title": row["seo_title"] or "",
        "seo_description": row["seo_description"] or "",
        "seo_keywords": row["seo_keywords"] or "",
    }


def _frontmatter(post: dict[str, Any], content: str) -> str:
    lines = ["---"]
    for key in (
        "title",
        "slug",
        "status",
        "published_at",
        "scheduled_at",
        "excerpt",
        "updated_at",
        "series",
        "seo_title",
        "seo_description",
        "seo_keywords",
    ):
        value = str(post.get(key) or "")
        lines.append(f"{key}: {json.dumps(value, ensure_ascii=False)}")
    lines.append(f"tags: {json.dumps(post.get('tags') or [], ensure_ascii=False)}")
    lines.append(f"series_order: {int(post.get('series_order') or 0)}")
    lines.append("---")
    return "\n".join(lines) + "\n\n" + content.rstrip() + "\n"


def _media_files(conn: sqlite3.Connection) -> list[Path]:
    root = media.media_dir()
    rows = conn.execute("SELECT filename FROM media ORDER BY id").fetchall()
    paths = []
    for row in rows:
        path = root / row["filename"]
        if path.is_file():
            paths.append(path)
    return paths


def build_backup(conn: sqlite3.Connection) -> io.BytesIO:
    """Return a ZIP containing a consistent SQLite copy and uploaded media."""

    root = media.media_dir().parent
    handle = tempfile.NamedTemporaryFile(
        prefix="markblog-backup-", suffix=".db", dir=root, delete=False
    )
    handle.close()
    temp_path = Path(handle.name)
    try:
        target = sqlite3.connect(temp_path)
        try:
            conn.backup(target)
        finally:
            target.close()

        output = io.BytesIO()
        with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
            archive.write(temp_path, "markblog.db")
            for path in _media_files(conn):
                archive.write(path, f"media/{path.name}")
            post_count = conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
            archive.writestr(
                "manifest.json",
                json.dumps(
                    {
                        "app": "Markblog",
                        "created_at": datetime.now(timezone.utc)
                        .isoformat(timespec="seconds")
                        .replace("+00:00", "Z"),
                        "posts": int(post_count),
                        "media": len(_media_files(conn)),
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
            )
        output.seek(0)
        return output
    finally:
        temp_path.unlink(missing_ok=True)


def build_markdown_export(conn: sqlite3.Connection) -> io.BytesIO:
    rows = conn.execute("SELECT * FROM posts ORDER BY published_at, id").fetchall()
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
        for row in rows:
            filename = f"posts/{row['slug']}.md"
            archive.writestr(
                filename,
                _frontmatter(_metadata_post(row), row["content_md"] or ""),
            )
        for path in _media_files(conn):
            archive.write(path, f"media/{path.name}")
        archive.writestr(
            "README.txt",
            "Markblog Markdown export\n"
            "Each posts/*.md file has simple YAML-like front matter. "
            "Images keep their /media/... URLs and are included in media/.\n",
        )
    output.seek(0)
    return output


def _unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] == '"':
        try:
            return str(json.loads(value))
        except json.JSONDecodeError:
            return value[1:-1]
    if len(value) >= 2 and value[0] == value[-1] == "'":
        return value[1:-1]
    return value


def parse_markdown(name: str, raw: str) -> dict[str, Any]:
    meta: dict[str, Any] = {}
    content = raw
    if raw.startswith("---"):
        closing = raw.find("\n---", 3)
        if closing >= 0:
            header = raw[3:closing].strip("\n")
            content = raw[closing + 4 :].lstrip("\n")
            for line in header.splitlines():
                if ":" not in line:
                    continue
                key, value = line.split(":", 1)
                meta[key.strip()] = _unquote(value)
    title = str(meta.get("title") or "").strip()
    if not title:
        heading = re.search(r"^#\s+(.+)$", content, flags=re.MULTILINE)
        title = heading.group(1).strip() if heading else Path(name).stem
    tags: list[str] = []
    raw_tags = meta.get("tags") or "[]"
    try:
        parsed_tags = json.loads(raw_tags) if raw_tags.strip().startswith("[") else raw_tags
    except json.JSONDecodeError:
        parsed_tags = raw_tags
    if isinstance(parsed_tags, list):
        tags = [str(tag).strip() for tag in parsed_tags if str(tag).strip()]
    else:
        tags = [tag.strip() for tag in str(parsed_tags).split(",") if tag.strip()]
    try:
        series_order = int(str(meta.get("series_order") or "0"))
    except ValueError:
        series_order = 0
    status = str(meta.get("status") or "draft").strip().lower()
    scheduled_at = str(meta.get("scheduled_at") or "").strip() or None
    if scheduled_at:
        try:
            parsed_schedule = datetime.fromisoformat(
                scheduled_at.replace("Z", "+00:00")
            )
            if parsed_schedule.tzinfo is None:
                parsed_schedule = parsed_schedule.replace(tzinfo=timezone.utc)
            scheduled_at = (
                parsed_schedule.astimezone(timezone.utc)
                .isoformat(timespec="seconds")
                .replace("+00:00", "Z")
            )
        except ValueError:
            scheduled_at = None
    if status == "scheduled":
        status = "draft"
    if status not in {"draft", "published"}:
        status = "draft"
    return {
        "title": title[:120],
        "slug": str(meta.get("slug") or "").strip() or None,
        "excerpt": str(meta.get("excerpt") or "").strip()[:300],
        "content_md": content[:200_000],
        "tags": tags[:8],
        "status": status,
        "scheduled_at": scheduled_at,
        "series": str(meta.get("series") or "").strip()[:60],
        "series_order": max(0, min(series_order, 999)),
        "seo_title": str(meta.get("seo_title") or "").strip()[:120],
        "seo_description": str(meta.get("seo_description") or "").strip()[:300],
        "seo_keywords": str(meta.get("seo_keywords") or "").strip()[:300],
    }


def import_markdown(conn: sqlite3.Connection, files: list[Any]) -> dict[str, Any]:
    imported = []
    skipped = []
    for item in files:
        try:
            data = parse_markdown(item.name, item.content)
            post = repository.create_post(conn, **data)
            imported.append({"id": post["id"], "title": post["title"]})
        except Exception as error:  # one bad file must not lose the rest
            skipped.append({"name": item.name, "reason": str(error)[:240]})
    return {"imported": imported, "skipped": skipped}
