#!/usr/bin/env python
"""Small maintenance commands.

Usage:
    python -m backend.manage reset-password
    python -m backend.manage reset-password --password "a-long-new-password"
    python -m backend.manage info
"""

from __future__ import annotations

import argparse
import getpass
import sys

from .config import get_settings
from .db import connect, init_db
from .repository import get_admin_account, get_all_settings, update_admin_password
from .auth import password_problem


def _read_password(provided: str | None) -> str:
    if provided:
        return provided
    first = getpass.getpass("New password: ")
    second = getpass.getpass("Repeat new password: ")
    if first != second:
        print("Passwords do not match.", file=sys.stderr)
        raise SystemExit(1)
    return first


def reset_password(password: str | None) -> None:
    if password is None:
        password = _read_password(None)
    init_db()
    problem = password_problem(password)
    if problem:
        print(problem, file=sys.stderr)
        raise SystemExit(1)
    with connect() as conn:
        account = get_admin_account(conn)
        if account is None:
            print("Administrator account not found.", file=sys.stderr)
            raise SystemExit(1)
        update_admin_password(conn, account["username"], password)
    print("Password updated. All existing admin sessions were signed out.")


def show_info() -> None:
    init_db()
    settings = get_settings()
    with connect() as conn:
        account = get_admin_account(conn)
        site_url = (get_all_settings(conn).get("site_url") or "http://127.0.0.1:8000").rstrip("/")
    print(f"Database: {settings.db_path}")
    print(f"Admin username: {account['username'] if account else '(missing)'}")
    print(f"Public site: {site_url}/")
    print(f"Admin entry: {site_url}/admin")
    print("The admin entry is not linked from public pages.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Markblog maintenance")
    sub = parser.add_subparsers(dest="command", required=True)
    reset = sub.add_parser("reset-password", help="set a new admin password")
    reset.add_argument(
        "--password",
        help="password (prefer the interactive prompt so it does not stay in shell history)",
    )
    sub.add_parser("info", help="show database and admin metadata")
    args = parser.parse_args()

    if args.command == "reset-password":
        reset_password(args.password)
    elif args.command == "info":
        show_info()


if __name__ == "__main__":
    main()
