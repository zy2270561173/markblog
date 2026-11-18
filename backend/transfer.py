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

from . import media, repository, search


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


BACKUP_KEEP = 7


def backup_dir() -> Path:
    path = media.media_dir().parent / "backups"
    path.mkdir(parents=True, exist_ok=True)
    return path


def create_auto_backup(conn: sqlite3.Connection) -> dict[str, Any]:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    filename = f"markblog-auto-{stamp}.zip"
    payload = build_backup(conn)
    target = backup_dir() / filename
    target.write_bytes(payload.getvalue())
    files = sorted(
        backup_dir().glob("markblog-auto-*.zip"),
        key=lambda item: item.stat().st_mtime,
        reverse=True,
    )
    for old in files[BACKUP_KEEP:]:
        old.unlink(missing_ok=True)
    return {
        "filename": filename,
        "size": target.stat().st_size,
        "created_at": datetime.fromtimestamp(
            target.stat().st_mtime, timezone.utc
        ).isoformat(timespec="seconds").replace("+00:00", "Z"),
    }


def list_auto_backups() -> list[dict[str, Any]]:
    items = []
    for path in sorted(
        backup_dir().glob("markblog-auto-*.zip"),
        key=lambda item: item.stat().st_mtime,
        reverse=True,
    ):
        stat = path.stat()
        items.append(
            {
                "filename": path.name,
                "size": stat.st_size,
                "created_at": datetime.fromtimestamp(
                    stat.st_mtime, timezone.utc
                ).isoformat(timespec="seconds").replace("+00:00", "Z"),
            }
        )
    return items


def backup_path(filename: str) -> Path | None:
    if not re.fullmatch(r"markblog-auto-\d{8}-\d{6}\.zip", filename or ""):
        return None
    path = (backup_dir() / filename).resolve()
    if not path.is_relative_to(backup_dir().resolve()) or not path.is_file():
        return None
    return path


def restore_backup_bytes(conn: sqlite3.Connection, data: bytes) -> dict[str, Any]:
    if not data:
        raise ValueError("备份文件为空。")
    if len(data) > 100 * 1024 * 1024:
        raise ValueError("备份文件不能超过 100 MB。")
    try:
        archive = zipfile.ZipFile(io.BytesIO(data))
    except zipfile.BadZipFile as error:
        raise ValueError("不是有效的 ZIP 备份文件。") from error
    names = set(archive.namelist())
    if "markblog.db" not in names:
        raise ValueError("备份中缺少 markblog.db。")

    with tempfile.NamedTemporaryFile(
        prefix="markblog-restore-", suffix=".db", dir=backup_dir(), delete=False
    ) as handle:
        handle.write(archive.read("markblog.db"))
        temp_path = Path(handle.name)
    try:
        source = sqlite3.connect(temp_path)
        try:
            tables = {
                row[0]
                for row in source.execute(
                    "SELECT name FROM sqlite_master WHERE type = 'table'"
                ).fetchall()
            }
            if not {"posts", "settings", "admin"}.issubset(tables):
                raise ValueError("备份数据库结构不完整。")
            conn.commit()
            source.backup(conn)
        finally:
            source.close()

        root = media.media_dir().resolve()
        for name in names:
            if not name.startswith("media/") or name.endswith("/"):
                continue
            target_name = Path(name).name
            if not target_name:
                continue
            target = (root / target_name).resolve()
            if not target.is_relative_to(root):
                continue
            target.write_bytes(archive.read(name))
        conn.execute("DELETE FROM sessions")
        conn.commit()
        search.rebuild(conn)
        conn.commit()
        return {"ok": True, "media": len([n for n in names if n.startswith("media/")])}
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
