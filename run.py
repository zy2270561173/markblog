#!/usr/bin/env python
"""Run the Markblog application using the settings in .env / environment."""

from __future__ import annotations

import logging

import uvicorn

from backend.config import get_settings


def main() -> None:
    settings = get_settings()
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    )
    print()
    print("  Markblog")
    print(f"  公开站点: http://{settings.host}:{settings.port}/")
    print(f"  管理入口: http://{settings.host}:{settings.port}/admin")
    print("  管理入口未在公开页面中链接。")
    print()
    uvicorn.run(
        "backend.app:app",
        host=settings.host,
        port=settings.port,
        log_level="info",
        server_header=False,
        proxy_headers=True,
        forwarded_allow_ips="127.0.0.1",
        reload=False,
    )


if __name__ == "__main__":
    main()
