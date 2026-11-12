"""Request validation for the public and admin APIs."""

from __future__ import annotations

import json
import re
from typing import Literal
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator

from .ui_copy import DEFAULT_UI_COPY

DEFAULT_ICP_LINK = "https://beian.miit.gov.cn/"
DEFAULT_POLICE_LINK = "https://beian.mps.gov.cn/"
ICP_OFFICIAL_HOSTS = {"beian.miit.gov.cn", "www.miit.gov.cn"}
POLICE_OFFICIAL_HOSTS = {"beian.mps.gov.cn", "www.beian.gov.cn"}
ALLOWED_TIMEZONES = {
    "Asia/Shanghai",
    "Asia/Hong_Kong",
    "Asia/Taipei",
    "Asia/Singapore",
    "Asia/Tokyo",
    "UTC",
}
DEFAULT_UI_COPY_JSON = json.dumps(DEFAULT_UI_COPY, ensure_ascii=False)


def _official_link(value: str, hosts: set[str], label: str, fallback: str) -> str:
    value = value.strip()
    if not value:
        return fallback
    parsed = urlparse(value)
    if parsed.scheme != "https" or not parsed.hostname:
        raise ValueError(f"{label}必须是 https:// 开头的完整地址。")
    if parsed.hostname.lower() not in hosts:
        raise ValueError(f"{label}必须指向官方备案查询网站。")
    if parsed.username or parsed.password:
        raise ValueError(f"{label}不能包含账号或密码。")
    try:
        _ = parsed.port
    except ValueError as error:
        raise ValueError(f"{label}的端口格式不正确。") from error
    return value


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class LoginIn(StrictModel):
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=256)


class PostIn(StrictModel):
    title: str = Field(min_length=1, max_length=120)
    slug: str | None = Field(default=None, max_length=100)
    excerpt: str = Field(default="", max_length=300)
    content_md: str = Field(default="", max_length=200_000)
    tags: list[str] = Field(default_factory=list)
    status: Literal["draft", "published"] = "draft"

    @field_validator("title")
    @classmethod
    def title_must_have_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("标题不能为空。")
        return value

    @field_validator("slug")
    @classmethod
    def empty_slug_becomes_none(cls, value: str | None) -> str | None:
        value = (value or "").strip()
        return value or None

    @field_validator("tags")
    @classmethod
    def clean_tags(cls, value: list[str]) -> list[str]:
        cleaned: list[str] = []
        seen: set[str] = set()
        for raw in value:
            tag = re.sub(r"\s+", " ", str(raw)).strip()
            if not tag:
                continue
            if len(tag) > 24:
                raise ValueError("每个标签最多 24 个字符。")
            if tag in seen:
                continue
            seen.add(tag)
            cleaned.append(tag)
        if len(cleaned) > 8:
            raise ValueError("每篇文章最多 8 个标签。")
        return cleaned


class SettingsIn(StrictModel):
    site_title: str = Field(min_length=1, max_length=60)
    site_subtitle: str = Field(default="", max_length=120)
    site_description: str = Field(default="", max_length=300)
    seo_title: str = Field(default="", max_length=80)
    seo_description: str = Field(default="", max_length=300)
    seo_keywords: str = Field(default="", max_length=300)
    author_name: str = Field(min_length=1, max_length=50)
    author_bio: str = Field(default="", max_length=500)
    about_md: str = Field(default="", max_length=60_000)
    icp_number: str = Field(default="", max_length=80)
    icp_link: str = Field(default=DEFAULT_ICP_LINK, max_length=300)
    police_number: str = Field(default="", max_length=80)
    police_link: str = Field(default=DEFAULT_POLICE_LINK, max_length=300)
    copyright: str = Field(default="", max_length=160)
    footer_note: str = Field(default="", max_length=300)
    site_since: str = Field(default="", max_length=4)
    site_url: str = Field(default="", max_length=200)
    ui_copy: str = Field(default=DEFAULT_UI_COPY_JSON, max_length=100_000)
    layout_style: Literal["sketch", "minimal"] = "sketch"
    theme_mode: Literal["auto", "light", "dark"] = "auto"
    theme_timezone: str = Field(default="Asia/Shanghai", max_length=64)
    ntp_server: str = Field(default="ntp.aliyun.com", max_length=253)
    day_start: str = Field(default="07:00", max_length=5)
    night_start: str = Field(default="19:00", max_length=5)

    @field_validator("ui_copy")
    @classmethod
    def valid_ui_copy(cls, value: str) -> str:
        try:
            data = json.loads(value or "{}")
        except json.JSONDecodeError as error:
            raise ValueError("前台文案必须是合法的 JSON 对象。") from error
        if not isinstance(data, dict):
            raise ValueError("前台文案必须是 JSON 对象。")
        cleaned: dict[str, str] = {}
        for key, text in data.items():
            if key not in DEFAULT_UI_COPY:
                continue
            if not isinstance(text, str):
                raise ValueError("前台文案的每个字段都必须是文本。")
            if len(text) > 4000:
                raise ValueError("单条前台文案不能超过 4000 个字符。")
            cleaned[key] = text
        return json.dumps({**DEFAULT_UI_COPY, **cleaned}, ensure_ascii=False)

    @field_validator("theme_timezone")
    @classmethod
    def valid_timezone(cls, value: str) -> str:
        if value not in ALLOWED_TIMEZONES:
            raise ValueError("请选择支持的时区。")
        return value

    @field_validator("ntp_server")
    @classmethod
    def valid_ntp_server(cls, value: str) -> str:
        value = value.strip()
        if not value:
            return "ntp.aliyun.com"
        if not re.fullmatch(
            r"[A-Za-z0-9](?:[A-Za-z0-9.-]{0,251}[A-Za-z0-9])?", value
        ) or ".." in value:
            raise ValueError("NTP 服务器填写域名或 IP，不要带协议、端口或路径。")
        return value

    @field_validator("day_start", "night_start")
    @classmethod
    def valid_clock(cls, value: str) -> str:
        value = value.strip()
        if not re.fullmatch(r"(?:[01]\d|2[0-3]):[0-5]\d", value):
            raise ValueError("时间请使用 HH:MM 格式，例如 07:00。")
        return value

    @field_validator("icp_link")
    @classmethod
    def valid_icp_link(cls, value: str) -> str:
        return _official_link(value, ICP_OFFICIAL_HOSTS, "ICP 备案查询链接", DEFAULT_ICP_LINK)

    @field_validator("police_link")
    @classmethod
    def valid_police_link(cls, value: str) -> str:
        return _official_link(
            value, POLICE_OFFICIAL_HOSTS, "公安备案查询链接", DEFAULT_POLICE_LINK
        )

    @field_validator("site_url")
    @classmethod
    def valid_site_url(cls, value: str) -> str:
        value = value.strip().rstrip("/")
        if not value:
            raise ValueError("站点地址不能为空。")
        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"} or not parsed.hostname:
            raise ValueError("站点地址需要是以 http:// 或 https:// 开头的完整地址。")
        if parsed.username or parsed.password:
            raise ValueError("站点地址中不能包含账号密码。")
        if parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
            raise ValueError("站点地址只填写域名或站点根地址，不要包含子路径。")
        return value

    @field_validator("site_since")
    @classmethod
    def valid_site_since(cls, value: str) -> str:
        value = value.strip()
        if value and not re.fullmatch(r"\d{4}", value):
            raise ValueError("建站年份请填写四位数字，例如 2026。")
        return value


class PasswordIn(StrictModel):
    current_password: str = Field(min_length=1, max_length=256)
    new_password: str = Field(min_length=1, max_length=128)


class PreviewIn(StrictModel):
    content_md: str = Field(default="", max_length=200_000)
