@echo off
setlocal
echo =======================================================
echo Pushing ICMITE 2027 Website to GitHub
echo Repository: https://github.com/PraveenKumarDeveloper-AI/ICMITE-WEBSITE.git
echo =======================================================
echo.

set "GIT_PATH=%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe"
if not exist "%GIT_PATH%" set "GIT_PATH=git"

cd /d "%~dp0"

echo Staging changes...
"%GIT_PATH%" add -A

echo Committing...
"%GIT_PATH%" commit -m "Update ICMITE 2027 Website"

echo.
echo Configuring git buffer settings...
"%GIT_PATH%" config http.postBuffer 524288000
"%GIT_PATH%" config http.version HTTP/1.1
"%GIT_PATH%" config http.lowSpeedLimit 0
"%GIT_PATH%" config http.lowSpeedTime 999999

echo Ready to push to GitHub.
"%GIT_PATH%" push -u origin main

echo.
pause
