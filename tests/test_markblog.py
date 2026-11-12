from __future__ import annotations

import os
import shutil
import tempfile

import pytest

TEST_DATA_DIR = tempfile.mkdtemp(prefix="markblog-tests-")
os.environ["BLOG_DATA_DIR"] = TEST_DATA_DIR
os.environ["BLOG_ADMIN_USERNAME"] = "admin"
os.environ["BLOG_ADMIN_PASSWORD"] = "test-password-123"
os.environ["BLOG_ENV"] = "test"
os.environ["BLOG_LOGIN_MAX_ATTEMPTS"] = "20"

from fastapi.testclient import TestClient  # noqa: E402

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


def test_settings_and_footer_records(client: TestClient):
    headers = login(client)
    settings = current_settings(client, headers)
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
    }
    saved = client.put("/api/admin/settings", json=payload, headers=headers)
    assert saved.status_code == 200, saved.text

    public_site = client.get("/api/public/site").json()
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
