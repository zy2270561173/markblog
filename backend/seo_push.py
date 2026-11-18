"""Best-effort search engine URL submission."""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


def _post_json(url: str, payload: Any, headers: dict[str, str] | None = None) -> str:
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={"Content-Type": "application/json; charset=utf-8", **(headers or {})},
    )
    with urllib.request.urlopen(request, timeout=10) as response:
        return response.read().decode("utf-8", "replace")[:1000]


def push_urls(site_url: str, urls: list[str], *, baidu_token: str, indexnow_key: str) -> dict[str, Any]:
    site_url = (site_url or "").rstrip("/")
    results: dict[str, Any] = {"baidu": None, "indexnow": None}
    if not site_url or not urls:
        return results
    if baidu_token:
        try:
            query = urllib.parse.urlencode({"site": site_url, "token": baidu_token})
            body = "\n".join(urls).encode("utf-8")
            request = urllib.request.Request(
                f"http://data.zz.baidu.com/urls?{query}",
                data=body,
                method="POST",
                headers={"Content-Type": "text/plain"},
            )
            with urllib.request.urlopen(request, timeout=10) as response:
                results["baidu"] = {
                    "ok": True,
                    "response": response.read().decode("utf-8", "replace")[:1000],
                }
        except (OSError, urllib.error.URLError) as error:
            results["baidu"] = {"ok": False, "error": str(error)[:500]}
    if indexnow_key:
        host = urllib.parse.urlparse(site_url).netloc
        try:
            response = _post_json(
                "https://api.indexnow.org/indexnow",
                {
                    "host": host,
                    "key": indexnow_key,
                    "keyLocation": f"{site_url}/indexnow/{indexnow_key}.txt",
                    "urlList": urls,
                },
            )
            results["indexnow"] = {"ok": True, "response": response}
        except (OSError, urllib.error.URLError) as error:
            results["indexnow"] = {"ok": False, "error": str(error)[:500]}
    return results
