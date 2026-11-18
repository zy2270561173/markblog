"""Internal health checks and best-effort alert delivery.

Two optional integrations are supported, both configured from the database:
- a generic JSON webhook (Bark / 飞书 / 钉钉 / Slack / custom);
- a healthchecks.io-style ping URL. The external service can alert when the
  site stops pinging, covering process/host downtime.
"""

from __future__ import annotations

import json
import sqlite3
import tempfile
import urllib.error
import urllib.request
from datetime import datetime, timezone
from typing import Any

from . import media, repository, transfer
from .appearance import compute_appearance

_last_signature: str | None = None


def _post_json(url: str, payload: dict[str, Any]) -> str:
    request = urllib.request.Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Markblog-Monitor/1.0",
        },
    )
    with urllib.request.urlopen(request, timeout=8) as response:
        return response.read().decode("utf-8", "replace")[:500]


def _ping(url: str) -> int:
    request = urllib.request.Request(
        url, headers={"User-Agent": "Markblog-Monitor/1.0"}
    )
    with urllib.request.urlopen(request, timeout=8) as response:
        return response.status


def _backup_age_hours(backups: list[dict[str, Any]]) -> float | None:
    if not backups:
        return None
    raw = backups[0].get("created_at", "")
    try:
        created = datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        return None
    return (datetime.now(timezone.utc) - created).total_seconds() / 3600


def collect_health(conn: sqlite3.Connection, settings: dict[str, Any]) -> dict[str, Any]:
    issues: list[str] = []
    try:
        db_ok = conn.execute("SELECT 1").fetchone()[0] == 1
    except sqlite3.Error:
        db_ok = False
    if not db_ok:
        issues.append("数据库连接异常")

    writable = False
    try:
        root = media.media_dir()
        with tempfile.NamedTemporaryFile(dir=root, prefix=".health-", delete=True):
            writable = True
    except OSError:
        writable = False
    if not writable:
        issues.append("媒体目录不可写")

    appearance = compute_appearance(settings)
    if appearance.get("mode") == "auto" and appearance.get("ntp_error"):
        issues.append("NTP 校时失败，已回退到系统时间")

    backups = transfer.list_auto_backups()
    backup_age = _backup_age_hours(backups)
    if backup_age is None:
        issues.append("还没有可用的自动备份")
    elif backup_age > 30:
        issues.append(f"最近一次备份已是 {backup_age:.0f} 小时前")

    try:
        recent_errors = int(
            conn.execute(
                "SELECT COUNT(*) FROM app_errors "
                "WHERE datetime(created_at) >= datetime('now', '-1 day')"
            ).fetchone()[0]
        )
    except sqlite3.Error:
        recent_errors = 0
    if recent_errors:
        issues.append(f"最近 24 小时有 {recent_errors} 条服务端错误")

    return {
        "ok": not issues,
        "issues": issues,
        "db": db_ok,
        "media_writable": writable,
        "backup_age_hours": round(backup_age, 1) if backup_age is not None else None,
        "last_backup": backups[0] if backups else None,
        "appearance": appearance,
        "recent_errors": recent_errors,
    }


def send_webhook(
    settings: dict[str, Any], *, status: str, issues: list[str], extra: dict[str, Any] | None = None
) -> dict[str, Any] | None:
    webhook = (settings.get("alert_webhook_url") or "").strip()
    if not webhook:
        return None
    payload = {
        "app": "Markblog",
        "status": status,
        "issues": issues,
        "site_url": settings.get("site_url", ""),
        "checked_at": datetime.now(timezone.utc)
        .isoformat(timespec="seconds")
        .replace("+00:00", "Z"),
        **(extra or {}),
    }
    try:
        _post_json(webhook, payload)
        return {"ok": True}
    except (OSError, urllib.error.URLError) as error:
        return {"ok": False, "error": str(error)[:300]}


def ping_uptime(settings: dict[str, Any]) -> dict[str, Any] | None:
    url = (settings.get("uptime_ping_url") or "").strip()
    if not url:
        return None
    try:
        return {"ok": True, "status": _ping(url)}
    except (OSError, urllib.error.URLError) as error:
        return {"ok": False, "error": str(error)[:300]}


def run_cycle(conn: sqlite3.Connection | None = None, *, force: bool = False) -> dict[str, Any]:
    global _last_signature
    own = conn is None
    if own:
        from .db import connect

        conn = connect()
    try:
        values = repository.get_all_settings(conn)
        health = collect_health(conn, values)
        signature = "|".join(health["issues"])
        status = "ok" if health["ok"] else "alert"
        configured = bool(
            values.get("alert_webhook_url") or values.get("uptime_ping_url")
        )
        delivery: dict[str, Any] = {}
        if configured and (force or signature != (_last_signature or "")):
            webhook = send_webhook(
                values,
                status=status,
                issues=health["issues"],
                extra={"backup_age_hours": health["backup_age_hours"]},
            )
            if webhook is not None:
                delivery["webhook"] = webhook
            repository.log_audit(
                conn,
                "monitor_alert",
                f"{status}: {signature[:300]}",
                "system",
            )
            _last_signature = signature
        if health["ok"]:
            ping = ping_uptime(values)
            if ping is not None:
                delivery["ping"] = ping
            if not configured:
                _last_signature = ""
        if delivery:
            health["delivery"] = delivery
        return health
    finally:
        if own:
            conn.close()


def report_backup_failure(settings_values: dict[str, Any], error: Exception) -> None:
    send_webhook(
        settings_values,
        status="alert",
        issues=[f"自动备份失败：{str(error)[:300]}"],
    )


def test_alerts(values: dict[str, Any]) -> dict[str, Any]:
    webhook = send_webhook(values, status="test", issues=["测试告警"])
    ping = ping_uptime(values)
    if webhook is None and ping is None:
        raise ValueError("请先填写 Webhook 地址或 Uptime ping 地址。")
    return {"webhook": webhook, "ping": ping}
