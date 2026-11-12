"""Markblog: a small, file-backed personal blog.

FastAPI serves the JSON API and the built Vue single-page app from one origin.
The public site deliberately contains no links to sign-in, sign-up or the admin
area. The single administrator entry is available only at /admin.
"""

from __future__ import annotations

import hmac
import html
import logging
import re
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from email.utils import format_datetime
from typing import Annotated, Any
from urllib.parse import quote
from xml.sax.saxutils import escape as xml_escape

from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import (
    FileResponse,
    HTMLResponse,
    JSONResponse,
    PlainTextResponse,
    RedirectResponse,
)
from starlette.exceptions import HTTPException as StarletteHTTPException

from . import repository
from .auth import (
    create_session,
    csrf_matches,
    delete_session,
    login_throttle,
    password_problem,
    read_session,
)
from .config import get_settings
from .db import get_db, init_db
from .rendering import reading_minutes, render_markdown
from .schemas import LoginIn, PasswordIn, PostIn, PreviewIn, SettingsIn
from .security import dummy_password_hash, verify_password

logger = logging.getLogger("markblog")
settings = get_settings()

CSP = (
    "default-src 'self'; "
    "script-src 'self'; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data: https:; "
    "font-src 'self' data:; "
    "connect-src 'self'; "
    "object-src 'none'; "
    "frame-src 'none'; "
    "base-uri 'self'; "
    "form-action 'self'; "
    "frame-ancestors 'none'"
)
MAX_API_BODY_BYTES = 1_500_000
FALLBACK_SITE_URL = "http://127.0.0.1:8000"

# Temporary domain-validation token for www.muysky.cn.
# This route lets certificate authorities read their validation file directly
# from FastAPI, without an extra Nginx location. Remove this block after the
# certificate has been issued.
SSL_VALIDATION_TOKEN = "jm4mlegvt7vqkfoaa3z8lt9f2l7pggdb"


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    if not (settings.frontend_dist / "index.html").is_file():
        logger.warning(
            "Frontend build not found at %s. Run the frontend build before serving.",
            settings.frontend_dist,
        )
    yield


app = FastAPI(
    title="Markblog",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    lifespan=lifespan,
)
app.add_middleware(GZipMiddleware, minimum_size=1200)


# ---------------------------------------------------------------------------
# Security headers and request limits
# ---------------------------------------------------------------------------


def _request_is_https(request: Request) -> bool:
    forwarded = request.headers.get("x-forwarded-proto", "")
    if forwarded.split(",")[0].strip().lower() == "https":
        return True
    return request.url.scheme == "https"


def _cookie_is_secure(request: Request, conn: Any) -> bool:
    if _request_is_https(request):
        return True
    configured = repository.get_all_settings(conn).get("site_url", "")
    return configured.startswith("https://")


def _apply_security_headers(
    response: Response, path: str, *, secure_request: bool = False
) -> None:
    response.headers.setdefault("Content-Security-Policy", CSP)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault(
        "Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()"
    )
    response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
    if secure_request:
        response.headers.setdefault(
            "Strict-Transport-Security", "max-age=31536000; includeSubDomains"
        )
    if path == "/admin" or path.startswith("/admin/") or path.startswith("/api/admin"):
        response.headers.setdefault("X-Robots-Tag", "noindex, nofollow, noarchive")
        response.headers.setdefault("Cache-Control", "no-store")
    if path.startswith("/api/"):
        response.headers.setdefault("Cache-Control", "no-store")
    content_type = response.headers.get("content-type", "")
    if content_type.startswith("text/html"):
        response.headers.setdefault("Cache-Control", "no-cache")


@app.middleware("http")
async def security_headers(request: Request, call_next):
    secure_request = _request_is_https(request)
    if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
        raw_length = request.headers.get("content-length")
        if raw_length:
            try:
                if int(raw_length) > MAX_API_BODY_BYTES:
                    response: Response = JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={"detail": "提交的内容过大，请缩小后再试。"},
                    )
                    _apply_security_headers(
                        response, request.url.path, secure_request=secure_request
                    )
                    return response
            except ValueError:
                response = PlainTextResponse("Invalid Content-Length", status_code=400)
                _apply_security_headers(
                    response, request.url.path, secure_request=secure_request
                )
                return response

    response = await call_next(request)
    _apply_security_headers(
        response, request.url.path, secure_request=secure_request
    )
    return response


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    message = "提交的数据不完整，请检查后再试。"
    errors = exc.errors()
    if errors:
        first = errors[0]
        raw_message = str(first.get("msg", "")).strip()
        if raw_message.startswith("Value error, "):
            raw_message = raw_message[len("Value error, ") :]
        if raw_message:
            message = raw_message
    return JSONResponse(
        status_code=422,
        content={"detail": message, "errors": jsonable_encoder(errors)},
    )


@app.exception_handler(StarletteHTTPException)
async def http_error_handler(_: Request, exc: StarletteHTTPException):
    detail = exc.detail if isinstance(exc.detail, str) else "请求未能完成。"
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": detail},
        headers=exc.headers,
    )


# ---------------------------------------------------------------------------
# Admin authentication dependencies
# ---------------------------------------------------------------------------


def _session_cookie(request: Request) -> str | None:
    return request.cookies.get(settings.session_cookie_name)


def require_session(
    request: Request,
    conn: Annotated[Any, Depends(get_db)],
) -> dict[str, Any]:
    session = read_session(conn, _session_cookie(request))
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="管理员会话已失效，请重新验证。",
        )
    return session


def require_csrf(
    request: Request,
    session: Annotated[dict[str, Any], Depends(require_session)],
) -> dict[str, Any]:
    if not csrf_matches(session["csrf_token"], request.headers.get("X-CSRF-Token")):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="安全校验失败，请刷新页面后重试。",
        )
    return session


def _client_key(request: Request) -> str:
    host = request.client.host if request.client else "unknown"
    return host or "unknown"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


@app.get("/api/health", include_in_schema=False)
def health(conn: Annotated[Any, Depends(get_db)]):
    conn.execute("SELECT 1").fetchone()
    return {"status": "ok"}


@app.get("/.well-known/pki-validation/{filename:path}", include_in_schema=False)
def ssl_domain_validation(filename: str):
    """Answer the CA's HTTP file validation challenge.

    The verification URL uses an arbitrary file name; the token is what the
    certificate authority checks. This is intentionally a small, temporary
    route that can be removed once the certificate has been issued.
    """

    if not filename.strip("/"):
        raise HTTPException(status_code=404, detail="验证文件不存在。")
    return PlainTextResponse(
        SSL_VALIDATION_TOKEN,
        media_type="text/plain; charset=utf-8",
        headers={"Cache-Control": "no-store"},
    )


@app.get("/api/public/site", include_in_schema=False)
def public_site(conn: Annotated[Any, Depends(get_db)]):
    return repository.get_public_site(conn)


@app.get("/api/public/posts", include_in_schema=False)
def public_posts(
    conn: Annotated[Any, Depends(get_db)],
    tag: str | None = Query(default=None, max_length=24),
    q: str | None = Query(default=None, max_length=100),
    limit: int | None = Query(default=None, ge=1, le=50),
):
    return repository.list_public_posts(conn, tag=tag, query=q, limit=limit)


@app.get("/api/public/posts/{slug}", include_in_schema=False)
def public_post(slug: str, conn: Annotated[Any, Depends(get_db)]):
    if len(slug) > 120:
        raise HTTPException(status_code=404, detail="没有找到这篇文章。")
    post = repository.get_public_post(conn, slug)
    if post is None:
        raise HTTPException(status_code=404, detail="没有找到这篇文章。")
    return post


# ---------------------------------------------------------------------------
# Admin API
# ---------------------------------------------------------------------------


@app.post("/api/admin/login", include_in_schema=False)
def admin_login(
    payload: LoginIn,
    request: Request,
    response: Response,
    conn: Annotated[Any, Depends(get_db)],
):
    throttle_key = _client_key(request)
    wait = login_throttle().retry_after(throttle_key)
    if wait:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="尝试次数过多，请稍后再试。",
            headers={"Retry-After": str(wait)},
        )

    account = repository.get_admin_account(conn)
    username_ok = bool(
        account
        and payload.username
        and len(payload.username) == len(account["username"])
        and hmac.compare_digest(
            payload.username.encode("utf-8"), account["username"].encode("utf-8")
        )
    )
    encoded_hash = account["password_hash"] if account else dummy_password_hash()
    password_ok = verify_password(payload.password, encoded_hash)

    if not (account and username_ok and password_ok):
        login_throttle().record_failure(throttle_key)
        logger.warning("Failed admin login from %s", throttle_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="账号或密码不正确。",
        )

    login_throttle().clear(throttle_key)
    token, csrf_token, expires_at = create_session(
        conn, account["username"], settings.session_days
    )
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        max_age=settings.session_days * 24 * 60 * 60,
        httponly=True,
        secure=_cookie_is_secure(request, conn),
        samesite="lax",
        path="/",
    )
    logger.info("Admin '%s' signed in from %s", account["username"], throttle_key)
    return {
        "authenticated": True,
        "username": account["username"],
        "csrf_token": csrf_token,
        "expires_at": expires_at,
    }


@app.get("/api/admin/me", include_in_schema=False)
def admin_me(session: Annotated[dict[str, Any], Depends(require_session)]):
    return {
        "authenticated": True,
        "username": session["username"],
        "csrf_token": session["csrf_token"],
        "expires_at": session["expires_at"],
    }


@app.post("/api/admin/logout", include_in_schema=False)
def admin_logout(
    request: Request,
    response: Response,
    conn: Annotated[Any, Depends(get_db)],
    _: Annotated[dict[str, Any], Depends(require_csrf)],
):
    delete_session(conn, _session_cookie(request))
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        secure=_cookie_is_secure(request, conn),
        httponly=True,
        samesite="lax",
    )
    return {"ok": True}


@app.get("/api/admin/posts", include_in_schema=False)
def admin_posts(
    conn: Annotated[Any, Depends(get_db)],
    _: Annotated[dict[str, Any], Depends(require_session)],
):
    return repository.list_admin_posts(conn)


@app.get("/api/admin/posts/{post_id}", include_in_schema=False)
def admin_post(
    post_id: int,
    conn: Annotated[Any, Depends(get_db)],
    _: Annotated[dict[str, Any], Depends(require_session)],
):
    post = repository.get_admin_post(conn, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="文章不存在。")
    return post


@app.post("/api/admin/posts", status_code=status.HTTP_201_CREATED, include_in_schema=False)
def admin_create_post(
    payload: PostIn,
    conn: Annotated[Any, Depends(get_db)],
    _: Annotated[dict[str, Any], Depends(require_csrf)],
):
    post = repository.create_post(
        conn,
        title=payload.title,
        slug=payload.slug,
        excerpt=payload.excerpt,
        content_md=payload.content_md,
        tags=payload.tags,
        status=payload.status,
    )
    return post


@app.put("/api/admin/posts/{post_id}", include_in_schema=False)
def admin_update_post(
    post_id: int,
    payload: PostIn,
    conn: Annotated[Any, Depends(get_db)],
    _: Annotated[dict[str, Any], Depends(require_csrf)],
):
    post = repository.update_post(
        conn,
        post_id,
        title=payload.title,
        slug=payload.slug,
        excerpt=payload.excerpt,
        content_md=payload.content_md,
        tags=payload.tags,
        status=payload.status,
    )
    if post is None:
        raise HTTPException(status_code=404, detail="文章不存在。")
    return post


@app.delete("/api/admin/posts/{post_id}", include_in_schema=False)
def admin_delete_post(
    post_id: int,
    conn: Annotated[Any, Depends(get_db)],
    _: Annotated[dict[str, Any], Depends(require_csrf)],
):
    if not repository.delete_post(conn, post_id):
        raise HTTPException(status_code=404, detail="文章不存在。")
    return {"ok": True}


@app.post("/api/admin/preview", include_in_schema=False)
def admin_preview(
    payload: PreviewIn,
    _: Annotated[dict[str, Any], Depends(require_csrf)],
):
    return {
        "html": render_markdown(payload.content_md),
        "reading_minutes": reading_minutes(payload.content_md),
    }


@app.get("/api/admin/settings", include_in_schema=False)
def admin_settings(
    conn: Annotated[Any, Depends(get_db)],
    _: Annotated[dict[str, Any], Depends(require_session)],
):
    return repository.get_all_settings(conn)


@app.put("/api/admin/settings", include_in_schema=False)
def admin_update_settings(
    payload: SettingsIn,
    conn: Annotated[Any, Depends(get_db)],
    _: Annotated[dict[str, Any], Depends(require_csrf)],
):
    values = payload.model_dump()
    values = {key: str(value) for key, value in values.items()}
    return repository.update_settings(conn, values)


@app.post("/api/admin/password", include_in_schema=False)
def admin_change_password(
    payload: PasswordIn,
    request: Request,
    response: Response,
    conn: Annotated[Any, Depends(get_db)],
    session: Annotated[dict[str, Any], Depends(require_csrf)],
):
    account = repository.get_admin_account(conn)
    if account is None or account["username"] != session["username"]:
        raise HTTPException(status_code=401, detail="管理员会话已失效，请重新验证。")
    if not verify_password(payload.current_password, account["password_hash"]):
        raise HTTPException(status_code=400, detail="当前密码不正确。")
    problem = password_problem(payload.new_password)
    if problem:
        raise HTTPException(status_code=400, detail=problem)
    if payload.current_password == payload.new_password:
        raise HTTPException(status_code=400, detail="新密码不能与当前密码相同。")

    repository.update_admin_password(conn, account["username"], payload.new_password)
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        secure=_cookie_is_secure(request, conn),
        httponly=True,
        samesite="lax",
    )
    logger.info("Admin password changed; all sessions invalidated.")
    return {"ok": True, "message": "密码已更新，请使用新密码重新进入。"}


# ---------------------------------------------------------------------------
# Feeds, sitemap and robots
# ---------------------------------------------------------------------------


def _base_url(conn: Any) -> str:
    site = repository.get_all_settings(conn)
    return (site.get("site_url") or FALLBACK_SITE_URL).rstrip("/")


@app.get("/robots.txt", include_in_schema=False)
def robots(conn: Annotated[Any, Depends(get_db)]):
    base = _base_url(conn)
    body = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /admin\n"
        "Disallow: /api/\n"
        f"Sitemap: {base}/sitemap.xml\n"
    )
    return PlainTextResponse(body, media_type="text/plain; charset=utf-8")


@app.get("/sitemap.xml", include_in_schema=False)
def sitemap(conn: Annotated[Any, Depends(get_db)]):
    base = _base_url(conn)
    rows = conn.execute(
        "SELECT slug, updated_at FROM posts WHERE status = 'published' "
        "AND published_at IS NOT NULL ORDER BY published_at DESC"
    ).fetchall()
    entries = [
        (f"{base}/", None),
        (f"{base}/posts", None),
        (f"{base}/about", None),
    ]
    entries.extend((f"{base}/posts/{quote(row['slug'])}", row["updated_at"]) for row in rows)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url, lastmod in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{xml_escape(url)}</loc>")
        if lastmod:
            lines.append(f"    <lastmod>{xml_escape(lastmod[:10])}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return Response("\n".join(lines), media_type="application/xml; charset=utf-8")


@app.get("/feed.xml", include_in_schema=False)
def feed(conn: Annotated[Any, Depends(get_db)]):
    base = _base_url(conn)
    site = repository.get_public_site(conn)
    rows = conn.execute(
        "SELECT * FROM posts WHERE status = 'published' AND published_at IS NOT NULL "
        "ORDER BY published_at DESC LIMIT 20"
    ).fetchall()
    channel_title = xml_escape(site.get("site_title") or "Markblog")
    channel_desc = xml_escape(site.get("site_description") or "")
    last_build = format_datetime(datetime.now(timezone.utc), usegmt=True)
    items: list[str] = []
    for row in rows:
        link = f"{base}/posts/{quote(row['slug'])}"
        try:
            published = datetime.fromisoformat(row["published_at"].replace("Z", "+00:00"))
            pub_date = format_datetime(published, usegmt=True)
        except (ValueError, TypeError):
            pub_date = last_build
        items.append(
            "<item>"
            f"<title>{xml_escape(row['title'])}</title>"
            f"<link>{xml_escape(link)}</link>"
            f'<guid isPermaLink="true">{xml_escape(link)}</guid>'
            f"<pubDate>{pub_date}</pubDate>"
            f"<description>{xml_escape(row['excerpt'])}</description>"
            "</item>"
        )
    rss = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'
        "<channel>"
        f"<title>{channel_title}</title>"
        f"<link>{xml_escape(base + '/')}</link>"
        f"<description>{channel_desc}</description>"
        "<language>zh-CN</language>"
        f"<lastBuildDate>{last_build}</lastBuildDate>"
        f'<atom:link href="{xml_escape(base + "/feed.xml")}" rel="self" type="application/rss+xml"/>'
        + "".join(items)
        + "</channel></rss>"
    )
    return Response(rss, media_type="application/rss+xml; charset=utf-8")


# ---------------------------------------------------------------------------
# Vue SPA serving
# ---------------------------------------------------------------------------


def _upsert_meta(html_text: str, attribute: str, key: str, content: str) -> str:
    escaped_key = re.escape(key)
    escaped_content = html.escape(content, quote=True)
    pattern = re.compile(
        rf'<meta\s+{attribute}="{escaped_key}"\s+content="[^"]*"\s*/?>',
        re.IGNORECASE,
    )
    replacement = f'<meta {attribute}="{key}" content="{escaped_content}">'
    if pattern.search(html_text):
        return pattern.sub(replacement, html_text, count=1)
    return html_text.replace("</head>", f"  {replacement}\n</head>", 1)


def _upsert_canonical(html_text: str, href: str | None) -> str:
    html_text = re.sub(
        r'\s*<link\s+rel="canonical"[^>]*>\s*',
        "\n",
        html_text,
        flags=re.IGNORECASE,
    )
    if href:
        tag = f'  <link rel="canonical" href="{html.escape(href, quote=True)}">\n'
        html_text = html_text.replace("</head>", tag + "</head>", 1)
    return html_text


def _spa_page(conn: Any, path: str) -> tuple[str, int, bool]:
    """Return (HTML, status code, is_admin)."""

    dist = settings.frontend_dist
    index_path = dist / "index.html"
    if not index_path.is_file():
        message = (
            "<!doctype html><html lang=\"zh-CN\"><meta charset=\"utf-8\">"
            "<title>Markblog</title><body style=\"font-family:serif;padding:48px\">"
            "<h1>前端尚未构建</h1>"
            "<p>请先在 frontend 目录运行 <code>npm run build</code>，然后重启服务。</p>"
            "</body></html>"
        )
        return message, 503, False

    site = repository.get_public_site(conn)
    site_title = site.get("site_title") or "Markblog"
    base = (site.get("site_url") or FALLBACK_SITE_URL).rstrip("/")
    seo_description = site.get("seo_description") or site.get("site_description") or ""
    seo_title = site.get("seo_title") or f"{site_title} · {site.get('site_subtitle') or '个人博客'}"

    clean_path = path.strip("/")
    is_admin = clean_path == "admin" or clean_path.startswith("admin/")
    not_found = False
    is_article = False
    canonical: str | None = None
    title = seo_title
    description = seo_description

    if is_admin:
        title = f"管理后台 · {site_title}"
        description = "仅限管理员访问。"
        canonical = None
    elif clean_path == "":
        canonical = f"{base}/"
    elif clean_path == "posts":
        title = f"文章 · {site_title}"
        canonical = f"{base}/posts"
    elif clean_path == "about":
        title = f"关于 · {site_title}"
        description = site.get("author_bio") or description
        canonical = f"{base}/about"
    elif clean_path.startswith("posts/"):
        slug = clean_path[len("posts/") :]
        post = repository.get_public_post(conn, slug)
        if post is None:
            not_found = True
            title = f"页面未找到 · {site_title}"
            description = "这一页似乎不存在，或者已经被移走了。"
        else:
            is_article = True
            title = f"{post['title']} · {site_title}"
            description = post["excerpt"]
            canonical = f"{base}/posts/{quote(slug)}"
    elif clean_path == "404":
        not_found = True
        title = f"页面未找到 · {site_title}"
    else:
        not_found = True
        title = f"页面未找到 · {site_title}"
        description = "这一页似乎不存在，或者已经被移走了。"

    html_text = index_path.read_text(encoding="utf-8")
    html_text = re.sub(
        r"<title>.*?</title>",
        f"<title>{html.escape(title)}</title>",
        html_text,
        count=1,
        flags=re.DOTALL | re.IGNORECASE,
    )
    html_text = _upsert_meta(html_text, "name", "description", description)
    html_text = _upsert_meta(
        html_text,
        "name",
        "robots",
        "noindex, nofollow, noarchive" if (is_admin or not_found) else "index, follow",
    )
    if not is_admin and site.get("seo_keywords"):
        html_text = _upsert_meta(html_text, "name", "keywords", site["seo_keywords"])
    html_text = _upsert_canonical(html_text, canonical)
    if not is_admin:
        html_text = _upsert_meta(html_text, "name", "author", site.get("author_name") or "")
        html_text = _upsert_meta(html_text, "property", "og:site_name", site_title)
        html_text = _upsert_meta(html_text, "property", "og:title", title)
        html_text = _upsert_meta(html_text, "property", "og:description", description)
        html_text = _upsert_meta(
            html_text, "property", "og:type", "article" if is_article else "website"
        )
        html_text = _upsert_meta(html_text, "property", "og:url", canonical or f"{base}/")
        html_text = _upsert_meta(html_text, "property", "og:image", f"{base}/og-cover.png")
        html_text = _upsert_meta(html_text, "name", "twitter:card", "summary_large_image")
    status_code = 404 if not_found else 200
    return html_text, status_code, is_admin


@app.get("/assets/{asset_path:path}", include_in_schema=False)
def built_asset(asset_path: str):
    assets_root = (settings.frontend_dist / "assets").resolve()
    target = (assets_root / asset_path).resolve()
    if not target.is_relative_to(assets_root) or not target.is_file():
        raise HTTPException(status_code=404, detail="资源不存在。")
    return FileResponse(
        target,
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


@app.get("/{full_path:path}", include_in_schema=False)
def spa_fallback(full_path: str, conn: Annotated[Any, Depends(get_db)]):
    if full_path == "api" or full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="接口不存在。")
    if full_path == "index.html":
        return RedirectResponse(url="/", status_code=307)

    dist = settings.frontend_dist.resolve()
    if full_path:
        candidate = (dist / full_path).resolve()
        if candidate.is_relative_to(dist) and candidate.is_file() and candidate.name != "index.html":
            if candidate.suffix in {".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico"}:
                max_age = 604800
            else:
                max_age = 3600
            return FileResponse(
                candidate,
                headers={"Cache-Control": f"public, max-age={max_age}"},
            )

    html_text, status_code, is_admin = _spa_page(conn, full_path)
    headers = {"X-Robots-Tag": "noindex, nofollow, noarchive"} if is_admin else None
    return HTMLResponse(
        content=html_text,
        status_code=status_code,
        headers=headers,
        media_type="text/html; charset=utf-8",
    )
