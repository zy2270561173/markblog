from __future__ import annotations

import base64
import io
import json
import os
import shutil
import tempfile
import threading
import time
import zipfile
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime, timezone
from urllib.parse import quote

import pytest

TEST_DATA_DIR = tempfile.mkdtemp(prefix="markblog-tests-")
os.environ["BLOG_DATA_DIR"] = TEST_DATA_DIR
os.environ["BLOG_ADMIN_USERNAME"] = "admin"
os.environ["BLOG_ADMIN_PASSWORD"] = "test-password-123"
os.environ["BLOG_ENV"] = "test"
os.environ["BLOG_LOGIN_MAX_ATTEMPTS"] = "20"
os.environ["BLOG_DISABLE_NTP"] = "1"

from fastapi.testclient import TestClient  # noqa: E402

from backend import totp  # noqa: E402
from backend.app import app  # noqa: E402

USERNAME = "admin"
PASSWORD = "test-password-123"


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client
    shutil.rmtree(TEST_DATA_DIR, ignore_errors=True)


def login(client: TestClient) -> dict[str, str]:
    response = client.post(
        "/api/admin/login",
        json={"username": USERNAME, "password": PASSWORD},
    )
    assert response.status_code == 200, response.text
    return {"X-CSRF-Token": response.json()["csrf_token"]}


def current_settings(client: TestClient, headers: dict[str, str]) -> dict:
    response = client.get("/api/admin/settings", headers=headers)
    assert response.status_code == 200, response.text
    return response.json()


def test_public_site_and_feeds(client: TestClient):
    assert client.get("/api/health").json()["status"] == "ok"

    ssl_validation = client.get(
        "/.well-known/pki-validation/jm4mlegvt7vqkfoaa3z8lt9f2l7pggdb.txt"
    )
    assert ssl_validation.status_code == 200
    assert ssl_validation.text == "jm4mlegvt7vqkfoaa3z8lt9f2l7pggdb"
    assert ssl_validation.headers["content-type"].startswith("text/plain")

    site = client.get("/api/public/site").json()
    assert site["site_title"] == "Markblog"
    assert site["author_name"] == "慕沄 (MuYun)"
    assert "慕沄 (MuYun)" in site["about_html"]
    assert "Markblog" in site["about_html"]
    assert site["ui_copy"]["nav_home"] == "首页"
    assert site["appearance"]["layout"] == "sketch"
    assert site["appearance"]["active"] in {"light", "dark"}
    assert site["seo_title"] == "Markblog · 电脑维修与使用笔记"
    assert site["icp_number"] == ""
    assert site["icp_link"] == "https://beian.miit.gov.cn/"
    assert site["police_link"] == "https://beian.mps.gov.cn/"
    assert "about_html" in site
    assert "about_md" not in site

    listing = client.get("/api/public/posts").json()
    assert listing["total"] == 6
    assert listing["tags"]
    assert any("电脑维修" in post["tags"] for post in listing["posts"])
    assert any("快捷键" in post["title"] for post in listing["posts"])

    slug = listing["posts"][0]["slug"]
    detail = client.get(f"/api/public/posts/{slug}").json()
    assert detail["content_html"]
    assert detail["adjacent"]

    sitemap = client.get("/sitemap.xml")
    assert sitemap.status_code == 200
    assert "<urlset" in sitemap.text
    assert "/admin" not in sitemap.text

    robots = client.get("/robots.txt").text
    assert "Disallow: /admin" in robots

    home = client.get("/")
    assert home.status_code == 200
    assert "Markblog · 电脑维修与使用笔记" in home.text
    assert home.headers["x-content-type-options"] == "nosniff"
    assert "frame-ancestors 'none'" in home.headers["content-security-policy"]
    assert "ICP" not in home.text  # SPA footer is rendered client-side.

    admin_page = client.get("/admin")
    assert admin_page.status_code == 200
    assert admin_page.headers["x-robots-tag"].startswith("noindex")
    assert 'name="robots" content="noindex' in admin_page.text

    missing = client.get("/no-such-page")
    assert missing.status_code == 404
    assert 'name="robots" content="noindex' in missing.text


def test_admin_is_private_and_csrf_protected(client: TestClient):
    assert client.get("/api/admin/posts").status_code == 401
    assert client.get("/api/admin/dashboard").status_code == 401

    wrong = client.post(
        "/api/admin/login",
        json={"username": USERNAME, "password": "definitely-wrong"},
    )
    assert wrong.status_code == 401
    assert "password" not in wrong.text.lower()

    headers = login(client)
    me = client.get("/api/admin/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["username"] == USERNAME

    dashboard = client.get("/api/admin/dashboard", headers=headers)
    assert dashboard.status_code == 200, dashboard.text
    assert dashboard.json()["counts"]["all"] == 6
    assert dashboard.json()["recent"]
    assert "appearance" in dashboard.json()

    payload = {
        "title": "CSRF check",
        "slug": "csrf-check",
        "excerpt": "",
        "content_md": "Body",
        "tags": [],
        "status": "draft",
    }
    assert client.post("/api/admin/posts", json=payload).status_code == 403


def test_post_crud_and_markdown_safety(client: TestClient):
    headers = login(client)
    payload = {
        "title": "测试文章",
        "slug": "test-post",
        "excerpt": "",
        "content_md": "## 标题\n\n正文 **加粗**。\n\n<script>alert(1)</script>\n\n```js\nconsole.log(1)\n```",
        "tags": ["测试", "测试", "Markdown"],
        "status": "published",
    }
    created = client.post("/api/admin/posts", json=payload, headers=headers)
    assert created.status_code == 201, created.text
    post = created.json()
    assert post["slug"] == "test-post"
    assert post["tags"] == ["测试", "Markdown"]
    assert post["status"] == "published"

    public = client.get("/api/public/posts/test-post").json()
    assert "&lt;script&gt;" in public["content_html"]
    assert "<script>" not in public["content_html"]
    assert "language-js" in public["content_html"]

    updated = client.put(
        f"/api/admin/posts/{post['id']}",
        json={**payload, "title": "修改后的文章", "status": "draft"},
        headers=headers,
    )
    assert updated.status_code == 200
    assert updated.json()["status"] == "draft"
    assert client.get("/api/public/posts/test-post").status_code == 404

    deleted = client.delete(f"/api/admin/posts/{post['id']}", headers=headers)
    assert deleted.status_code == 200
    assert client.get("/api/admin/posts").json()["counts"]["all"] == 6


def test_media_search_series_views_backup_and_schedule(client: TestClient):
    headers = login(client)
    post_ids: list[int] = []
    media_id = None
    try:
        base = {
            "slug": None,
            "excerpt": "",
            "content_md": "",
            "tags": ["检索", "维修"],
            "status": "published",
            "series": "测试系列",
            "series_order": 0,
            "seo_title": "",
            "seo_description": "",
            "seo_keywords": "",
            "scheduled_at": None,
        }
        first = client.post(
            "/api/admin/posts",
            json={
                **base,
                "title": "全文索引测试一",
                "slug": "search-series-one",
                "series_order": 1,
                "content_md": "## 第一节\n\n这是用于全文索引测试的唯一词甲。\n\n```txt\ncopy me\n```",
                "seo_title": "全文索引测试 SEO 标题",
                "seo_description": "全文索引测试 SEO 描述",
                "seo_keywords": "全文索引, 测试",
            },
            headers=headers,
        )
        assert first.status_code == 201, first.text
        post_ids.append(first.json()["id"])
        second = client.post(
            "/api/admin/posts",
            json={
                **base,
                "title": "全文索引测试二",
                "slug": "search-series-two",
                "series_order": 2,
                "content_md": "## 第二节\n\n第二篇系列文章。",
            },
            headers=headers,
        )
        assert second.status_code == 201, second.text
        post_ids.append(second.json()["id"])

        search = client.get("/api/public/posts", params={"q": "唯一词甲"})
        assert search.status_code == 200
        results = search.json()["posts"]
        assert results and results[0]["slug"] == "search-series-one"
        assert results[0]["search_snippet"]["match"] == "唯一词甲"

        series = client.get(f"/api/public/series/{quote('测试系列')}")
        assert series.status_code == 200, series.text
        assert [item["slug"] for item in series.json()["posts"]] == [
            "search-series-one",
            "search-series-two",
        ]

        detail = client.get("/api/public/posts/search-series-one")
        assert detail.status_code == 200
        assert detail.json()["series_info"]["total"] == 2
        assert detail.json()["related"]
        assert detail.json()["toc"]

        view = client.post("/api/public/posts/search-series-one/view")
        assert view.status_code == 200
        assert view.json()["counted"] is True
        again = client.post("/api/public/posts/search-series-one/view")
        assert again.json()["counted"] is False

        article_html = client.get("/posts/search-series-one").text
        assert "全文索引测试 SEO 标题" in article_html
        assert "全文索引测试 SEO 描述" in article_html
        assert "application/ld+json" in article_html

        scheduled = client.post(
            "/api/admin/posts",
            json={
                **base,
                "title": "定时发布测试",
                "slug": "scheduled-test",
                "status": "draft",
                "series": "",
                "content_md": "定时内容。",
                "scheduled_at": "2000-01-01T00:00:00Z",
            },
            headers=headers,
        )
        assert scheduled.status_code == 201, scheduled.text
        assert scheduled.json()["status"] == "scheduled"
        post_ids.append(scheduled.json()["id"])
        client.get("/api/public/posts")
        published = client.get("/api/public/posts/scheduled-test")
        assert published.status_code == 200, published.text

        png = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z0YQAAAAASUVORK5CYII="
        )
        uploaded = client.post(
            "/api/admin/media?filename=test.png&alt=测试图&width=1&height=1",
            content=png,
            headers={**headers, "Content-Type": "image/png"},
        )
        assert uploaded.status_code == 201, uploaded.text
        media = uploaded.json()
        media_id = media["id"]
        assert client.get(media["url"]).status_code == 200
        assert client.get("/api/admin/media", headers=headers).json()["media"]
        updated_alt = client.patch(
            f"/api/admin/media/{media_id}", json={"alt": "新的说明"}, headers=headers
        )
        assert updated_alt.status_code == 200
        assert updated_alt.json()["alt"] == "新的说明"

        backup = client.get("/api/admin/backup", headers=headers)
        assert backup.status_code == 200
        with zipfile.ZipFile(io.BytesIO(backup.content)) as archive:
            names = archive.namelist()
            assert "markblog.db" in names
            assert any(name.startswith("media/") for name in names)
        export = client.get("/api/admin/export/markdown", headers=headers)
        assert export.status_code == 200
        with zipfile.ZipFile(io.BytesIO(export.content)) as archive:
            assert any(name.startswith("posts/") for name in archive.namelist())

        imported = client.post(
            "/api/admin/import/markdown",
            json={
                "files": [
                    {
                        "name": "import-test.md",
                        "content": "---\ntitle: \"导入测试\"\nslug: \"import-test\"\nstatus: \"draft\"\ntags: [\"导入\"]\n---\n\n正文。",
                    }
                ]
            },
            headers=headers,
        )
        assert imported.status_code == 200, imported.text
        for item in imported.json()["imported"]:
            post_ids.append(item["id"])
    finally:
        for post_id in post_ids:
            client.delete(f"/api/admin/posts/{post_id}", headers=headers)
        if media_id is not None:
            client.delete(f"/api/admin/media/{media_id}", headers=headers)


def test_revisions_cover_batch_analytics_security_and_backup(client: TestClient):
    headers = login(client)
    post_ids: list[int] = []
    media_id = None
    redirect_id = None
    try:
        png = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z0YQAAAAASUVORK5CYII="
        )
        media = client.post(
            "/api/admin/media?filename=cover.png&alt=封面&width=1&height=1",
            content=png,
            headers={**headers, "Content-Type": "image/png"},
        )
        assert media.status_code == 201, media.text
        media_id = media.json()["id"]
        cover = media.json()["url"]

        payload = {
            "title": "第二阶段测试",
            "slug": "phase-two-test",
            "excerpt": "摘要",
            "content_md": "## 第一节\n\n旧正文。",
            "tags": ["测试", "维修"],
            "status": "published",
            "scheduled_at": None,
            "series": "",
            "series_order": 0,
            "seo_title": "",
            "seo_description": "",
            "seo_keywords": "",
            "cover_image": cover,
            "featured": True,
            "canonical_url": "",
            "repair": {
                "risk": "medium",
                "time": "30 分钟",
                "tools": "螺丝刀",
                "models": "通用",
                "safety": "先断电。",
            },
            "faq": [
                {"question": "会不会丢数据？", "answer": "先备份再操作。"},
            ],
        }
        created = client.post("/api/admin/posts", json=payload, headers=headers)
        assert created.status_code == 201, created.text
        post = created.json()
        post_ids.append(post["id"])
        assert post["cover_image"] == cover
        assert post["featured"] is True
        assert post["repair"]["risk"] == "medium"
        public_post = client.get("/api/public/posts/phase-two-test").json()
        assert public_post["repair"]["time"] == "30 分钟"
        assert public_post["cover_image"] == cover
        assert public_post["faq"][0]["question"] == "会不会丢数据？"
        assert "FAQPage" in client.get("/posts/phase-two-test").text

        compare_preview = client.post(
            "/api/admin/preview",
            json={
                "content_md": (
                    f":::compare\nbefore: {cover}\nafter: {cover}\nlabel: 清灰前后\n:::"
                )
            },
            headers=headers,
        )
        assert compare_preview.status_code == 200
        assert "image-compare" in compare_preview.json()["html"]
        assert ":::compare" not in compare_preview.json()["html"]

        draft = client.post(
            "/api/admin/posts",
            json={
                **payload,
                "title": "草稿预览测试",
                "slug": "phase-two-preview",
                "status": "draft",
                "featured": False,
            },
            headers=headers,
        )
        assert draft.status_code == 201
        draft_id = draft.json()["id"]
        post_ids.append(draft_id)
        token_response = client.post(
            f"/api/admin/posts/{draft_id}/preview-token", headers=headers
        )
        assert token_response.status_code == 200
        token = token_response.json()["token"]
        preview = client.get(f"/api/public/preview/{token}")
        assert preview.status_code == 200
        assert preview.json()["title"] == "草稿预览测试"
        assert preview.headers["x-robots-tag"].startswith("noindex")
        preview_page = client.get(f"/preview/{token}")
        assert preview_page.status_code == 200
        assert "noindex, nofollow, noarchive" in preview_page.text
        assert client.get("/api/public/preview/not-a-real-token").status_code == 404
        revoked = client.delete(
            f"/api/admin/posts/{draft_id}/preview-token", headers=headers
        )
        assert revoked.status_code == 200
        assert client.get(f"/api/public/preview/{token}").status_code == 404

        updated = client.put(
            f"/api/admin/posts/{post['id']}",
            json={**payload, "title": "第二阶段测试（新）", "content_md": "## 新正文"},
            headers=headers,
        )
        assert updated.status_code == 200
        revisions = client.get(
            f"/api/admin/posts/{post['id']}/revisions", headers=headers
        )
        assert revisions.status_code == 200
        assert revisions.json()["items"]
        old_revision = revisions.json()["items"][0]
        restored = client.post(
            f"/api/admin/posts/{post['id']}/revisions/{old_revision['id']}/restore",
            headers=headers,
        )
        assert restored.status_code == 200, restored.text
        assert restored.json()["title"] == "第二阶段测试"

        duplicated = client.post(
            f"/api/admin/posts/{post['id']}/duplicate", headers=headers
        )
        assert duplicated.status_code == 200
        post_ids.append(duplicated.json()["id"])
        assert duplicated.json()["status"] == "draft"

        batch = client.post(
            "/api/admin/posts/batch",
            json={
                "ids": [duplicated.json()["id"]],
                "action": "tag",
                "tags": ["批量"],
            },
            headers=headers,
        )
        assert batch.status_code == 200
        assert "批量" in client.get(
            f"/api/admin/posts/{duplicated.json()['id']}", headers=headers
        ).json()["tags"]

        view = client.post("/api/public/posts/phase-two-test/view?complete=true")
        assert view.status_code == 200
        dashboard = client.get("/api/admin/dashboard", headers=headers).json()
        assert dashboard["counts"]["completions_total"] >= 1
        assert "referrers" in dashboard
        csv_export = client.get("/api/admin/analytics/export.csv", headers=headers)
        assert csv_export.status_code == 200
        assert "title,slug,day,views,completions" in csv_export.text

        redirect = client.post(
            "/api/admin/redirects",
            json={"path": "/legacy-phase-two", "target": "/posts"},
            headers=headers,
        )
        assert redirect.status_code == 200
        redirect_id = redirect.json()["id"]
        hit = client.get("/legacy-phase-two", follow_redirects=False)
        assert hit.status_code == 308
        assert hit.headers["location"] == "/posts"

        client.get("/definitely-missing-phase-two")
        not_found = client.get("/api/admin/not-found", headers=headers)
        assert not_found.status_code == 200
        assert any(
            item["path"] == "/definitely-missing-phase-two"
            for item in not_found.json()["items"]
        )

        backup = client.post("/api/admin/backups/run", headers=headers)
        assert backup.status_code == 200
        filename = backup.json()["filename"]
        assert client.get(
            f"/api/admin/backups/{filename}", headers=headers
        ).status_code == 200
        assert client.get("/api/admin/backups", headers=headers).json()["items"]

        privacy = client.get("/privacy")
        assert privacy.status_code == 200
        assert "隐私" in privacy.text

        setup = client.post(
            "/api/admin/2fa/setup",
            json={"password": PASSWORD},
            headers=headers,
        )
        assert setup.status_code == 200, setup.text
        secret = setup.json()["secret"]
        code = totp._code_at(secret, int(time.time()) // 30)
        enable = client.post(
            "/api/admin/2fa/enable", json={"code": code}, headers=headers
        )
        assert enable.status_code == 200, enable.text
        assert client.get("/api/admin/2fa", headers=headers).json()["enabled"] is True
        disable = client.post(
            "/api/admin/2fa/disable",
            json={"password": PASSWORD, "code": totp._code_at(secret, int(time.time()) // 30)},
            headers=headers,
        )
        assert disable.status_code == 200, disable.text
        assert client.get("/api/admin/audit", headers=headers).json()["items"]
        health = client.get("/api/admin/health", headers=headers).json()
        assert "issues" in health
        assert "monitoring" in health
        assert client.post("/api/admin/alerts/test", headers=headers).status_code == 400
    finally:
        for post_id in post_ids:
            client.delete(f"/api/admin/posts/{post_id}", headers=headers)
        if media_id is not None:
            client.delete(f"/api/admin/media/{media_id}", headers=headers)
        if redirect_id is not None:
            client.delete(f"/api/admin/redirects/{redirect_id}", headers=headers)


def test_theme_faq_ai_taxonomy_search_and_webdav(client: TestClient):
    headers = login(client)
    original = current_settings(client, headers)
    post_ids: list[int] = []
    server = None

    class DavHandler(BaseHTTPRequestHandler):
        puts: list[tuple[str, bytes]] = []

        def do_MKCOL(self):
            self.send_response(201)
            self.end_headers()

        def do_PUT(self):
            size = int(self.headers.get("content-length", "0"))
            DavHandler.puts.append((self.path, self.rfile.read(size)))
            self.send_response(201)
            self.end_headers()

        def log_message(self, *_args):
            return

    try:
        # AI is opt-in; the default test database must not call an external model.
        ai_response = client.post(
            "/api/public/ai/chat",
            json={"message": "你好"},
        )
        assert ai_response.status_code == 503

        night = {**original, "theme_preset": "night"}
        saved = client.put("/api/admin/settings", json=night, headers=headers)
        assert saved.status_code == 200, saved.text
        assert client.get("/api/public/site").json()["appearance"]["preset"] == "night"

        payload = {
            "title": "分类管理测试",
            "slug": "taxonomy-test-a",
            "excerpt": "分类",
            "content_md": "## 正文",
            "tags": ["taxonomy-tag"],
            "status": "published",
            "scheduled_at": None,
            "series": "taxonomy-series",
            "series_order": 1,
            "seo_title": "",
            "seo_description": "",
            "seo_keywords": "",
            "cover_image": "",
            "featured": False,
            "canonical_url": "",
            "repair": {"risk": "low", "time": "", "tools": "", "models": "", "safety": ""},
            "faq": [],
        }
        first = client.post("/api/admin/posts", json=payload, headers=headers)
        assert first.status_code == 201, first.text
        post_ids.append(first.json()["id"])
        second = client.post(
            "/api/admin/posts",
            json={**payload, "title": "分类管理测试 B", "slug": "taxonomy-test-b"},
            headers=headers,
        )
        assert second.status_code == 201, second.text
        post_ids.append(second.json()["id"])

        taxonomy = client.get("/api/admin/taxonomy", headers=headers)
        assert taxonomy.status_code == 200
        assert any(tag["name"] == "taxonomy-tag" for tag in taxonomy.json()["tags"])
        assert any(item["name"] == "taxonomy-series" for item in taxonomy.json()["series"])

        renamed = client.post(
            "/api/admin/taxonomy/tags/rename",
            json={"old": "taxonomy-tag", "new": "taxonomy-tag-2"},
            headers=headers,
        )
        assert renamed.status_code == 200
        assert renamed.json()["updated"] == 2
        renamed_series = client.post(
            "/api/admin/taxonomy/series/rename",
            json={"old": "taxonomy-series", "new": "taxonomy-series-2"},
            headers=headers,
        )
        assert renamed_series.status_code == 200
        ordered = client.post(
            "/api/admin/taxonomy/series/order",
            json={
                "name": "taxonomy-series-2",
                "post_ids": [second.json()["id"], first.json()["id"]],
            },
            headers=headers,
        )
        assert ordered.status_code == 200

        client.get("/api/public/posts?q=taxonomy-zero-result")
        terms = client.get("/api/admin/search-terms", headers=headers).json()
        assert any(item["query"] == "taxonomy-zero-result" for item in terms["zero"])

        serve = HTTPServer(("127.0.0.1", 0), DavHandler)
        server = threading.Thread(target=serve.serve_forever, daemon=True)
        server.start()
        port = serve.server_address[1]
        webdav = {
            **night,
            "webdav_url": f"http://127.0.0.1:{port}",
            "webdav_path": "markblog",
            "webdav_username": "",
            "webdav_password": "",
            "remote_auto_backup": "0",
        }
        assert client.put("/api/admin/settings", json=webdav, headers=headers).status_code == 200
        upload = client.post(
            "/api/admin/backups/remote?kind=webdav", headers=headers
        )
        assert upload.status_code == 200, upload.text
        assert DavHandler.puts
        assert DavHandler.puts[-1][0].endswith(".zip")
        assert len(DavHandler.puts[-1][1]) > 1000
    finally:
        client.put("/api/admin/settings", json=original, headers=headers)
        for post_id in post_ids:
            client.delete(f"/api/admin/posts/{post_id}", headers=headers)
        client.delete("/api/admin/search-terms", headers=headers)
        if server is not None:
            server.join(timeout=1)


def test_settings_and_footer_records(client: TestClient):
    headers = login(client)
    settings = current_settings(client, headers)
    custom_copy = json.loads(settings["ui_copy"])
    custom_copy["nav_home"] = "开始"
    payload = {
        **settings,
        "seo_title": "Markblog · 自定义 SEO 标题",
        "seo_description": "自定义 SEO 描述，所有字段都存进数据库。",
        "seo_keywords": "电脑维修, 快捷键, 数据备份",
        "icp_number": "京ICP备00000000号-1",
        "icp_link": "https://beian.miit.gov.cn/",
        "police_number": "京公网安备 11010502000000号",
        "police_link": "https://beian.mps.gov.cn/#/query/webSearch",
        "copyright": "© {year} Test Blog. 保留所有权利。",
        "site_url": "http://testserver",
        "layout_style": "minimal",
        "theme_preset": "night",
        "theme_mode": "dark",
        "theme_timezone": "Asia/Shanghai",
        "ntp_server": "ntp.aliyun.com",
        "day_start": "07:00",
        "night_start": "19:00",
        "ui_copy": json.dumps(custom_copy, ensure_ascii=False),
    }
    saved = client.put("/api/admin/settings", json=payload, headers=headers)
    assert saved.status_code == 200, saved.text

    public_site = client.get("/api/public/site").json()
    assert public_site["ui_copy"]["nav_home"] == "开始"
    assert public_site["appearance"]["active"] == "dark"
    assert public_site["appearance"]["layout"] == "minimal"
    assert public_site["appearance"]["preset"] == "night"
    assert public_site["seo_title"] == payload["seo_title"]
    assert public_site["seo_description"] == payload["seo_description"]
    assert public_site["icp_number"] == payload["icp_number"]
    assert public_site["icp_link"] == payload["icp_link"]
    assert public_site["police_number"] == payload["police_number"]
    assert public_site["police_link"] == payload["police_link"]
    assert public_site["copyright"] == payload["copyright"]

    home = client.get("/")
    assert payload["seo_title"] in home.text

    invalid = client.put(
        "/api/admin/settings",
        json={**payload, "site_url": "javascript:alert(1)"},
        headers=headers,
    )
    assert invalid.status_code == 422

    unofficial_icp = client.put(
        "/api/admin/settings",
        json={**payload, "icp_link": "https://example.com/beian"},
        headers=headers,
    )
    assert unofficial_icp.status_code == 422

    unofficial_police = client.put(
        "/api/admin/settings",
        json={**payload, "police_link": "https://example.com/police"},
        headers=headers,
    )
    assert unofficial_police.status_code == 422


def test_appearance_day_night_window(monkeypatch):
    from backend import appearance

    values = {
        "theme_mode": "auto",
        "theme_timezone": "Asia/Shanghai",
        "ntp_server": "ntp.aliyun.com",
        "day_start": "07:00",
        "night_start": "19:00",
        "layout_style": "sketch",
    }
    monkeypatch.setattr(
        appearance,
        "_now_with_source",
        lambda _server: (datetime(2026, 7, 1, 2, 0, tzinfo=timezone.utc), "ntp", None),
    )
    assert appearance.compute_appearance(values)["active"] == "light"

    monkeypatch.setattr(
        appearance,
        "_now_with_source",
        lambda _server: (datetime(2026, 7, 1, 15, 0, tzinfo=timezone.utc), "ntp", None),
    )
    assert appearance.compute_appearance(values)["active"] == "dark"

    values["theme_mode"] = "dark"
    assert appearance.compute_appearance(values)["active"] == "dark"
    assert appearance.compute_appearance(values)["source"] == "manual"


def test_password_change_invalidates_sessions(client: TestClient):
    headers = login(client)
    wrong = client.post(
        "/api/admin/password",
        json={
            "current_password": "wrong-password",
            "new_password": "new-password-456",
        },
        headers=headers,
    )
    assert wrong.status_code == 400

    changed = client.post(
        "/api/admin/password",
        json={
            "current_password": PASSWORD,
            "new_password": "new-password-456",
        },
        headers=headers,
    )
    assert changed.status_code == 200, changed.text
    assert client.get("/api/admin/me").status_code == 401

    old_login = client.post(
        "/api/admin/login",
        json={"username": USERNAME, "password": PASSWORD},
    )
    assert old_login.status_code == 401

    new_login = client.post(
        "/api/admin/login",
        json={"username": USERNAME, "password": "new-password-456"},
    )
    assert new_login.status_code == 200
