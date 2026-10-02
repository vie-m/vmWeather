@echo off
setlocal
title vmWeather
cd /d "%~dp0"

rem Usage: start.bat            starts the app and opens the browser
rem        start.bat --no-open  starts the app without opening the browser
set "OPEN=--open"
if /i "%~1"=="--no-open" set "OPEN="

rem --- 1. Find Node.js / npm -------------------------------------------------
where npm >nul 2>nul
if not errorlevel 1 goto have_node

rem Not on PATH: look in the usual install folders and the Hermes bundled copy
for /d %%D in ("%ProgramFiles%\nodejs" "%LOCALAPPDATA%\Programs\nodejs" "%LOCALAPPDATA%\hermes\tools\node-*") do if exist "%%~D\npm.cmd" set "PATH=%%~D;%PATH%"
where npm >nul 2>nul
if not errorlevel 1 goto have_node
goto no_node

rem --- 2. Run with npm -------------------------------------------------------
:have_node
if not exist node_modules (
  echo Installing dependencies. This only happens on the first run...
  call npm install
  if errorlevel 1 goto failed
)
echo.
echo Starting vmWeather at http://localhost:5173
echo Keep this window open while you use the app. Close it to stop the server.
echo.
call npm run dev -- %OPEN%
goto failed

rem --- 3. No Node.js: serve the prebuilt dist folder with Python --------------
:no_node
echo Node.js was not found. Trying the prebuilt copy in the dist folder instead...
if not exist dist\index.html goto no_runtime
set "PY="
where py >nul 2>nul && set "PY=py"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY goto no_runtime
echo.
echo Serving at http://localhost:4173
echo Keep this window open while you use the app. Close it to stop the server.
echo.
if defined OPEN start "" /min cmd /c "ping -n 3 127.0.0.1 >nul & start http://localhost:4173"
%PY% -m http.server 4173 --bind 127.0.0.1 --directory dist
goto failed

:no_runtime
echo.
echo Could not find Node.js or Python.
echo Install Node.js from https://nodejs.org and run this file again.

:failed
echo.
echo The server stopped. If this was not on purpose, read the messages above.
pause
endlocal
