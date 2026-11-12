@echo off
chcp 65001 >nul
cd /d "%~dp0frontend"
call npm.cmd install
if errorlevel 1 (
  pause
  exit /b 1
)
call npm.cmd run build
if errorlevel 1 (
  pause
  exit /b 1
)
echo.
echo Frontend built into frontend\dist.
pause
