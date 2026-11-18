"""Optional OpenAI-compatible AI assistant.

The site owner stores the endpoint, model and API key in SQLite from the
hidden admin area. The public endpoint only receives a short conversation and
returns an answer plus the site posts used as context.
"""

from __future__ import annotations

import json
import threading
import urllib.error
import urllib.request
from datetime import date
from typing import Any

from . import repository


class AiUnavailable(RuntimeError):
    pass


_USAGE: dict[tuple[str, str], int] = {}
_USAGE_LOCK = threading.Lock()


def enabled(settings_values: dict[str, Any]) -> bool:
    return (
        settings_values.get("ai_enabled") == "1"
        and bool(settings_values.get("ai_api_key", "").strip())
        and bool(settings_values.get("ai_model", "").strip())
    )


def _limit(settings_values: dict[str, Any]) -> int:
    try:
        return max(1, min(1000, int(settings_values.get("ai_daily_limit", "30"))))
    except (TypeError, ValueError):
        return 30


def consume_quota(client_key: str, settings_values: dict[str, Any]) -> tuple[bool, int]:
    today = date.today().isoformat()
    key = (today, client_key)
    limit = _limit(settings_values)
    with _USAGE_LOCK:
        if len(_USAGE) > 5000:
            _USAGE.clear()
        used = _USAGE.get(key, 0)
        if used >= limit:
            return False, 0
        _USAGE[key] = used + 1
        return True, limit - used - 1


def _context(conn: Any, message: str) -> tuple[str, list[dict[str, str]]]:
    result = repository.list_public_posts(conn, query=message[:80], limit=4)
    posts = result.get("posts") or []
    if not posts:
        posts = repository.list_public_posts(conn, limit=4).get("posts") or []
    sources: list[dict[str, str]] = []
    chunks: list[str] = []
    for post in posts:
        sources.append(
            {
                "title": post["title"],
                "slug": post["slug"],
                "url": f"/posts/{post['slug']}",
            }
        )
        chunks.append(
            f"- 《{post['title']}》/{post['slug']}：{post.get('excerpt', '')}"
            f"（标签：{', '.join(post.get('tags') or [])}）"
        )
    return "\n".join(chunks), sources


def answer(
    conn: Any,
    settings_values: dict[str, Any],
    *,
    message: str,
    history: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    if not enabled(settings_values):
        raise AiUnavailable("站娘 AI 还没有配置。")
    context, sources = _context(conn, message)
    system_prompt = (
        (settings_values.get("ai_system_prompt") or "").strip()
        or "你是 Markblog 的站娘大肥鱼，一个懂电脑维修的中文助手。"
    )
    site_title = settings_values.get("site_title") or "Markblog"
    system_prompt += (
        f"\n\n当前站点：{site_title}。"
        "\n下面是从本站检索到的相关文章，可以引用标题和链接：\n"
        f"{context or '（暂时没有匹配文章）'}"
        "\n回答使用简体中文，先给结论，再给最多 4 个步骤；不要编造本站没有的文章。"
    )
    messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]
    for item in (history or [])[-6:]:
        role = item.get("role")
        content = (item.get("content") or "").strip()
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content[:2000]})
    messages.append({"role": "user", "content": message})

    base = (settings_values.get("ai_base_url") or "https://api.deepseek.com").rstrip("/")
    if base.endswith("/chat/completions"):
        endpoint = base
    else:
        endpoint = base + "/chat/completions"
    payload = {
        "model": settings_values.get("ai_model") or "deepseek-chat",
        "messages": messages,
        "temperature": 0.35,
        "max_tokens": 900,
    }
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": f"Bearer {settings_values.get('ai_api_key', '').strip()}",
            "User-Agent": "Markblog-AI/1.0",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=35) as response:
            data = json.loads(response.read().decode("utf-8"))
    except (OSError, urllib.error.URLError, json.JSONDecodeError) as error:
        raise AiUnavailable("AI 服务暂时没有响应。") from error
    try:
        text = data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError) as error:
        raise AiUnavailable("AI 返回了无法识别的结果。") from error
    return {
        "answer": text[:6000],
        "sources": sources,
        "model": settings_values.get("ai_model") or "",
    }
