"""Configuration for Markblog, loaded from environment and an optional .env file."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent


def _load_dotenv(path: Path) -> None:
    """A deliberately small .env reader (no third-party dependency).

    Existing process environment variables always win. Values may be wrapped in
    single or double quotes; comments must start with '#'.
    """

    if not path.is_file():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        os.environ.setdefault(key, value)


def _env_int(name: str, default: int, minimum: int, maximum: int) -> int:
    raw = os.environ.get(name)
    if raw is None or not raw.strip():
        return default
    try:
        value = int(raw)
    except ValueError:
        return default
    return max(minimum, min(maximum, value))


@dataclass(frozen=True)
class Settings:
    root_dir: Path
    data_dir: Path
    db_path: Path
    frontend_dist: Path
    admin_username: str
    admin_password: str
    host: str
    port: int
    session_days: int
    login_max_attempts: int
    login_window_seconds: int
    environment: str

    @property
    def session_cookie_name(self) -> str:
        return "markblog_session"

    @property
    def is_production(self) -> bool:
        return self.environment.lower() in {"prod", "production"}


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    _load_dotenv(ROOT_DIR / ".env")

    data_dir = Path(os.environ.get("BLOG_DATA_DIR", ROOT_DIR / "data")).expanduser()
    if not data_dir.is_absolute():
        data_dir = ROOT_DIR / data_dir
    data_dir = data_dir.resolve()

    dist_dir = Path(
        os.environ.get("BLOG_FRONTEND_DIST", ROOT_DIR / "frontend" / "dist")
    ).expanduser()
    if not dist_dir.is_absolute():
        dist_dir = ROOT_DIR / dist_dir
    dist_dir = dist_dir.resolve()

    return Settings(
        root_dir=ROOT_DIR,
        data_dir=data_dir,
        db_path=data_dir / "markblog.db",
        frontend_dist=dist_dir,
        admin_username=os.environ.get("BLOG_ADMIN_USERNAME", "admin").strip() or "admin",
        admin_password=os.environ.get("BLOG_ADMIN_PASSWORD", ""),
        host=os.environ.get("BLOG_HOST", "127.0.0.1").strip() or "127.0.0.1",
        port=_env_int("BLOG_PORT", 8000, 1, 65535),
        session_days=_env_int("BLOG_SESSION_DAYS", 7, 1, 30),
        login_max_attempts=_env_int("BLOG_LOGIN_MAX_ATTEMPTS", 6, 1, 50),
        login_window_seconds=_env_int("BLOG_LOGIN_WINDOW_SECONDS", 600, 60, 86400),
        environment=os.environ.get("BLOG_ENV", "production").strip() or "production",
    )


def reset_settings_cache() -> None:
    get_settings.cache_clear()
