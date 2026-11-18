"""Minimal RFC 6238 TOTP support (SHA-1, 30-second steps, 6 digits)."""

from __future__ import annotations

import base64
import hashlib
import hmac
import secrets
import struct
import time
from urllib.parse import quote


def new_secret() -> str:
    return base64.b32encode(secrets.token_bytes(20)).decode("ascii").rstrip("=")


def _code_at(secret: str, counter: int) -> str:
    padded = secret.upper() + "=" * ((8 - len(secret) % 8) % 8)
    key = base64.b32decode(padded, casefold=True)
    digest = hmac.new(
        key, struct.pack(">Q", counter), hashlib.sha1
    ).digest()
    offset = digest[-1] & 0x0F
    number = struct.unpack(">I", digest[offset : offset + 4])[0] & 0x7FFFFFFF
    return f"{number % 1_000_000:06d}"


def verify(secret: str, code: str, *, window: int = 1) -> bool:
    cleaned = "".join(ch for ch in (code or "") if ch.isdigit())
    if not secret or len(cleaned) != 6:
        return False
    counter = int(time.time()) // 30
    for offset in range(-window, window + 1):
        if hmac.compare_digest(cleaned, _code_at(secret, counter + offset)):
            return True
    return False


def provisioning_uri(secret: str, username: str, issuer: str = "Markblog") -> str:
    label = quote(f"{issuer}:{username}", safe="")
    return (
        f"otpauth://totp/{label}?secret={secret}&issuer={quote(issuer)}"
        "&algorithm=SHA1&digits=6&period=30"
    )
