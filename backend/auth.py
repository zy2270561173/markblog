"""Database-backed admin sessions and password policy."""

from __future__ import annotations

import hmac
import secrets
import sqlite3
from typing import Any

from .config import get_settings
from .security import (
    LoginThrottle,
    hash_token,
    iso_utc,
    session_expiry,
    utc_now,
)

_THROTTLE: LoginThrottle | None = None


def login_throttle() -> LoginThrottle:
    global _THROTTLE
    if _THROTTLE is None:
        settings = get_settings()
        _THROTTLE = LoginThrottle(
            max_attempts=settings.login_max_attempts,
            window_seconds=settings.login_window_seconds,
        )
    return _THROTTLE


def reset_login_throttle() -> None:
    global _THROTTLE
    _THROTTLE = None


def create_session(
    conn: sqlite3.Connection, username: str, days: int
) -> tuple[str, str, str]:
    token = secrets.token_urlsafe(32)
    csrf_token = secrets.token_urlsafe(32)
    expires_at = session_expiry(days)
    conn.execute(
        "INSERT INTO sessions (token_hash, username, csrf_token, created_at, expires_at) "
        "VALUES (?, ?, ?, ?, ?)",
        (hash_token(token), username, csrf_token, iso_utc(utc_now()), expires_at),
    )
    conn.commit()
    return token, csrf_token, expires_at


def read_session(conn: sqlite3.Connection, token: str | None) -> dict[str, Any] | None:
    if not token:
        return None
    row = conn.execute(
        "SELECT * FROM sessions WHERE token_hash = ?", (hash_token(token),)
    ).fetchone()
    if row is None:
        return None
    if row["expires_at"] <= iso_utc(utc_now()):
        conn.execute("DELETE FROM sessions WHERE token_hash = ?", (row["token_hash"],))
        conn.commit()
        return None
    return {
        "username": row["username"],
        "csrf_token": row["csrf_token"],
        "expires_at": row["expires_at"],
    }


def delete_session(conn: sqlite3.Connection, token: str | None) -> None:
    if not token:
        return
    conn.execute("DELETE FROM sessions WHERE token_hash = ?", (hash_token(token),))
    conn.commit()


def csrf_matches(expected: str, supplied: str | None) -> bool:
    if not supplied:
        return False
    return hmac.compare_digest(expected, supplied)


def password_problem(password: str) -> str | None:
    if len(password) < 10:
        return "新密码至少需要 10 个字符。"
    if len(password) > 128:
        return "新密码不能超过 128 个字符。"
    if not any(character.isalpha() for character in password):
        return "新密码需要包含至少一个字母。"
    if not any(character.isdigit() for character in password):
        return "新密码需要包含至少一个数字。"
    if password.lower() in {
        "1234567890",
        "password123",
        "markblog123",
        "admin12345",
    }:
        return "这个密码太常见，请换一个。"
    return None
