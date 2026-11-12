"""Day/night appearance and NTP time.

The public site's light/dark theme is selected from a configurable day window.
By default the current time is read from an NTP server (UDP port 123); if that
is unavailable the application falls back to the server clock rather than
failing the page.
"""

from __future__ import annotations

import logging
import os
import socket
import struct
import threading
import time
from datetime import datetime, time as dt_time, timedelta, timezone
from typing import Any
from zoneinfo import ZoneInfo

logger = logging.getLogger("markblog.appearance")

NTP_EPOCH_DELTA = 2_208_988_800
NTP_TIMEOUT_SECONDS = 0.8
NTP_SUCCESS_TTL = 300.0
NTP_FAILURE_TTL = 60.0

_CACHE: dict[str, tuple[float, datetime, str, str | None, float]] = {}
_CACHE_LOCK = threading.Lock()

_FALLBACK_ZONES = {
    "Asia/Shanghai": timezone(timedelta(hours=8), "Asia/Shanghai"),
    "Asia/Hong_Kong": timezone(timedelta(hours=8), "Asia/Hong_Kong"),
    "Asia/Taipei": timezone(timedelta(hours=8), "Asia/Taipei"),
    "Asia/Singapore": timezone(timedelta(hours=8), "Asia/Singapore"),
    "Asia/Tokyo": timezone(timedelta(hours=9), "Asia/Tokyo"),
    "UTC": timezone.utc,
}


def _ntp_disabled() -> bool:
    return os.environ.get("BLOG_DISABLE_NTP", "").strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }


def _query_ntp(server: str) -> datetime:
    packet = b"\x1b" + 47 * b"\0"
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.settimeout(NTP_TIMEOUT_SECONDS)
        sock.sendto(packet, (server, 123))
        data, _ = sock.recvfrom(1024)
    if len(data) < 48:
        raise OSError("NTP response is too short")
    seconds, fraction = struct.unpack("!II", data[40:48])
    if seconds == 0:
        raise OSError("NTP response has no transmit timestamp")
    unix_time = seconds - NTP_EPOCH_DELTA + fraction / 2**32
    return datetime.fromtimestamp(unix_time, timezone.utc)


def _now_with_source(server: str) -> tuple[datetime, str, str | None]:
    """Return current UTC time, its source and an optional NTP error."""

    server = (server or "").strip()
    if not server or _ntp_disabled():
        return datetime.now(timezone.utc), "server", None

    now_monotonic = time.monotonic()
    with _CACHE_LOCK:
        cached = _CACHE.get(server)
        if cached and cached[0] > now_monotonic:
            elapsed = now_monotonic - cached[4]
            return (
                cached[1] + timedelta(seconds=elapsed),
                cached[2],
                cached[3],
            )

        try:
            current = _query_ntp(server)
            result = (current, "ntp", None)
            ttl = NTP_SUCCESS_TTL
        except (OSError, ValueError, TimeoutError) as error:
            current = datetime.now(timezone.utc)
            message = str(error) or error.__class__.__name__
            logger.warning("NTP query to %s failed: %s; using server clock", server, message)
            result = (current, "server", message)
            ttl = NTP_FAILURE_TTL
        _CACHE[server] = (
            now_monotonic + ttl,
            result[0],
            result[1],
            result[2],
            now_monotonic,
        )
        return result


def _zone(name: str) -> Any:
    try:
        return ZoneInfo(name)
    except Exception:
        return _FALLBACK_ZONES.get(name, timezone.utc)


def _parse_clock(value: str, fallback: dt_time) -> dt_time:
    try:
        return dt_time.fromisoformat(value)
    except (TypeError, ValueError):
        return fallback


def _in_day_window(current: dt_time, day_start: dt_time, night_start: dt_time) -> bool:
    if day_start == night_start:
        return True
    if day_start < night_start:
        return day_start <= current < night_start
    return current >= day_start or current < night_start


def compute_appearance(values: dict[str, Any]) -> dict[str, Any]:
    """Resolve editable appearance settings into the current theme."""

    layout = values.get("layout_style") or "sketch"
    if layout not in {"sketch", "minimal"}:
        layout = "sketch"

    mode = values.get("theme_mode") or "auto"
    if mode not in {"auto", "light", "dark"}:
        mode = "auto"

    timezone_name = values.get("theme_timezone") or "Asia/Shanghai"
    ntp_server = values.get("ntp_server") or "ntp.aliyun.com"
    day_start = _parse_clock(values.get("day_start") or "07:00", dt_time(7, 0))
    night_start = _parse_clock(values.get("night_start") or "19:00", dt_time(19, 0))
    zone = _zone(timezone_name)

    if mode in {"light", "dark"}:
        now_utc = datetime.now(timezone.utc)
        source = "manual"
        ntp_error = None
        active = mode
    else:
        now_utc, source, ntp_error = _now_with_source(ntp_server)
        local_time = now_utc.astimezone(zone).timetz().replace(tzinfo=None)
        active = "light" if _in_day_window(local_time, day_start, night_start) else "dark"

    local_now = now_utc.astimezone(zone)
    return {
        "mode": mode,
        "active": active,
        "layout": layout,
        "source": source,
        "timezone": timezone_name,
        "ntp_server": ntp_server,
        "day_start": day_start.strftime("%H:%M"),
        "night_start": night_start.strftime("%H:%M"),
        "server_time": now_utc.isoformat(timespec="seconds").replace("+00:00", "Z"),
        "local_time": local_now.isoformat(timespec="seconds"),
        "ntp_error": ntp_error,
    }
