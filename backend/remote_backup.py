"""Optional off-site backups: WebDAV and Tencent COS / Aliyun OSS."""

from __future__ import annotations

import base64
import io
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from typing import Any

from . import repository, transfer


class RemoteError(RuntimeError):
    pass


def _filename() -> str:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    return f"markblog-remote-{stamp}.zip"


def _data(conn: Any) -> tuple[str, bytes]:
    output = transfer.build_backup(conn)
    return _filename(), output.getvalue()


def _webdav_request(
    url: str, *, username: str, password: str, method: str, data: bytes | None = None
) -> None:
    headers = {"User-Agent": "Markblog-Backup/1.0"}
    if data is not None:
        headers["Content-Type"] = "application/zip"
    if username or password:
        token = base64.b64encode(f"{username}:{password}".encode()).decode()
        headers["Authorization"] = f"Basic {token}"
    request = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            if response.status >= 300:
                raise RemoteError(f"WebDAV 返回 {response.status}")
    except urllib.error.HTTPError as error:
        if method == "MKCOL" and error.code in {405, 301, 409}:
            return
        raise RemoteError(f"WebDAV 请求失败：HTTP {error.code}") from error
    except (OSError, urllib.error.URLError) as error:
        raise RemoteError("WebDAV 连接失败，请检查地址和网络。") from error


def upload_webdav(conn: Any, values: dict[str, Any]) -> dict[str, Any]:
    base = (values.get("webdav_url") or "").strip().rstrip("/")
    if not base:
        raise RemoteError("还没有填写 WebDAV 地址。")
    path = (values.get("webdav_path") or "markblog").strip("/")
    filename, data = _data(conn)
    directory_url = f"{base}/{urllib.parse.quote(path)}/" if path else f"{base}/"
    file_url = directory_url + urllib.parse.quote(filename)
    username = values.get("webdav_username") or ""
    password = values.get("webdav_password") or ""
    if path:
        _webdav_request(
            directory_url,
            username=username,
            password=password,
            method="MKCOL",
        )
    _webdav_request(
        file_url,
        username=username,
        password=password,
        method="PUT",
        data=data,
    )
    return {"provider": "webdav", "filename": filename, "url": file_url, "bytes": len(data)}


def upload_cloud(conn: Any, values: dict[str, Any]) -> dict[str, Any]:
    provider = values.get("cloud_provider") or "none"
    if provider not in {"tencent", "aliyun"}:
        raise RemoteError("还没有选择腾讯云 COS 或阿里云 OSS。")
    bucket = (values.get("cloud_bucket") or "").strip()
    access_key = (values.get("cloud_access_key") or "").strip()
    secret_key = (values.get("cloud_secret_key") or "").strip()
    if not bucket or not access_key or not secret_key:
        raise RemoteError("对象存储的 Bucket、AccessKey 和 SecretKey 必须填写。")
    prefix = (values.get("cloud_prefix") or "").strip("/")
    filename, data = _data(conn)
    key = f"{prefix}/{filename}" if prefix else filename

    if provider == "tencent":
        try:
            from qcloud_cos import CosConfig, CosS3Client  # type: ignore
        except ImportError as error:
            raise RemoteError("未安装腾讯云 SDK，请执行 pip install cos-python-sdk-v5。") from error
        region = (values.get("cloud_region") or "").strip()
        if not region:
            raise RemoteError("腾讯云 COS 需要填写地域，例如 ap-guangzhou。")
        config = CosConfig(
            Region=region,
            SecretId=access_key,
            SecretKey=secret_key,
            Scheme="https",
        )
        client = CosS3Client(config)
        try:
            client.put_object(Bucket=bucket, Body=data, Key=key)
        except Exception as error:  # SDK exceptions vary by version.
            raise RemoteError(f"腾讯云 COS 上传失败：{error}") from error
    else:
        try:
            import oss2  # type: ignore
        except ImportError as error:
            raise RemoteError("未安装阿里云 SDK，请执行 pip install oss2。") from error
        endpoint = (values.get("cloud_endpoint") or "").strip() or (
            f"https://{bucket}.{values.get('cloud_region') or 'oss-cn-hangzhou'}.aliyuncs.com"
        )
        auth = oss2.Auth(access_key, secret_key)
        bucket_client = oss2.Bucket(auth, endpoint, bucket)
        try:
            bucket_client.put_object(key, data)
        except Exception as error:
            raise RemoteError(f"阿里云 OSS 上传失败：{error}") from error

    return {"provider": provider, "filename": filename, "key": key, "bytes": len(data)}


def upload_remote(conn: Any, kind: str) -> dict[str, Any]:
    values = repository.get_all_settings(conn)
    if kind == "webdav":
        return upload_webdav(conn, values)
    if kind == "cloud":
        return upload_cloud(conn, values)
    raise RemoteError("未知的远程备份类型。")


def upload_auto_backup(conn: Any) -> list[dict[str, Any]]:
    """Best-effort upload used after the daily backup. Never blocks the app."""

    values = repository.get_all_settings(conn)
    if values.get("remote_auto_backup") != "1":
        return []
    results = []
    if (values.get("webdav_url") or "").strip():
        try:
            results.append(upload_webdav(conn, values))
        except RemoteError as error:
            results.append({"provider": "webdav", "ok": False, "error": str(error)})
    if (values.get("cloud_provider") or "none") != "none":
        try:
            results.append(upload_cloud(conn, values))
        except RemoteError as error:
            results.append({"provider": "cloud", "ok": False, "error": str(error)})
    return results
