"""Uploaded image storage and metadata."""

from __future__ import annotations

import re
import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .config import get_settings
from .security import iso_utc

MAX_IMAGE_BYTES = 6 * 1024 * 1024
ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
SAFE_FILENAME = re.compile(r"^[a-z0-9][a-z0-9-]{2,80}\.(?:jpg|png|webp|gif)$")


class MediaError(ValueError):
    pass


def media_dir() -> Path:
    path = get_settings().data_dir / "media"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _signature_ok(data: bytes, mime: str) -> bool:
    if mime == "image/jpeg":
        return data.startswith(b"\xff\xd8\xff")
    if mime == "image/png":
        return data.startswith(b"\x89PNG\r\n\x1a\n")
    if mime == "image/gif":
        return data.startswith((b"GIF87a", b"GIF89a"))
    if mime == "image/webp":
        return len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP"
    return False


def _row(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "filename": row["filename"],
        "original_name": row["original_name"],
        "mime": row["mime"],
        "size": row["size"],
        "width": row["width"],
        "height": row["height"],
        "alt": row["alt"],
        "created_at": row["created_at"],
        "url": f"/media/{row['filename']}",
        "markdown": f"![{row['alt'] or row['original_name']}](/media/{row['filename']})",
    }


def list_media(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = conn.execute(
        "SELECT * FROM media ORDER BY created_at DESC, id DESC"
    ).fetchall()
    return [_row(row) for row in rows]


def get_media(conn: sqlite3.Connection, media_id: int) -> dict[str, Any] | None:
    row = conn.execute("SELECT * FROM media WHERE id = ?", (media_id,)).fetchone()
    return _row(row) if row else None


def save_media(
    conn: sqlite3.Connection,
    *,
    data: bytes,
    mime: str,
    original_name: str,
    alt: str = "",
    width: int = 0,
    height: int = 0,
) -> dict[str, Any]:
    mime = (mime or "").split(";", 1)[0].strip().lower()
    extension = ALLOWED_TYPES.get(mime)
    if extension is None:
        raise MediaError("只支持 JPG、PNG、WebP、GIF 图片。")
    if not data:
        raise MediaError("图片内容为空。")
    if len(data) > MAX_IMAGE_BYTES:
        raise MediaError("图片不能超过 6 MB，请压缩后再上传。")
    if not _signature_ok(data, mime):
        raise MediaError("图片格式与文件内容不一致。")

    safe_original = Path(original_name or "image").name[:160] or "image"
    filename = f"{datetime.now(timezone.utc):%Y%m%d}-{secrets.token_hex(8)}{extension}"
    target = media_dir() / filename
    target.write_bytes(data)

    row = {
        "filename": filename,
        "original_name": safe_original,
        "mime": mime,
        "size": len(data),
        "width": max(0, min(int(width or 0), 100_000)),
        "height": max(0, min(int(height or 0), 100_000)),
        "alt": (alt or "").strip()[:200],
        "created_at": iso_utc(),
    }
    cursor = conn.execute(
        "INSERT INTO media "
        "(filename, original_name, mime, size, width, height, alt, created_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (
            row["filename"],
            row["original_name"],
            row["mime"],
            row["size"],
            row["width"],
            row["height"],
            row["alt"],
            row["created_at"],
        ),
    )
    conn.commit()
    saved = conn.execute(
        "SELECT * FROM media WHERE id = ?", (int(cursor.lastrowid),)
    ).fetchone()
    assert saved is not None
    return _row(saved)


def update_alt(conn: sqlite3.Connection, media_id: int, alt: str) -> dict[str, Any] | None:
    conn.execute(
        "UPDATE media SET alt = ? WHERE id = ?", ((alt or "").strip()[:200], media_id)
    )
    conn.commit()
    return get_media(conn, media_id)


def delete_media(conn: sqlite3.Connection, media_id: int) -> bool:
    row = conn.execute(
        "SELECT filename FROM media WHERE id = ?", (media_id,)
    ).fetchone()
    if row is None:
        return False
    conn.execute("DELETE FROM media WHERE id = ?", (media_id,))
    conn.commit()
    path = media_dir() / row["filename"]
    try:
        path.unlink(missing_ok=True)
    except OSError:
        pass
    return True


def resolve_media_path(filename: str) -> Path | None:
    if not SAFE_FILENAME.fullmatch(filename or ""):
        return None
    path = (media_dir() / filename).resolve()
    root = media_dir().resolve()
    if not path.is_relative_to(root) or not path.is_file():
        return None
    return path
