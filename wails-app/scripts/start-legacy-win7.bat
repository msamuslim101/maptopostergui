@echo off
setlocal enabledelayedexpansion

set "APP_DIR=%~dp0.."
set "APP_EXE=%APP_DIR%\MapToPoster.exe"

if not exist "%APP_EXE%" (
    echo [ERROR] MapToPoster.exe not found at:
    echo         %APP_EXE%
    echo Place this script next to your packaged app folder:
    echo MapToPoster\scripts\start-legacy-win7.bat
    exit /b 1
)

set "WEBVIEW_FOUND="
for /f "delims=" %%f in ('dir /b /s "%ProgramFiles(x86)%\Microsoft\EdgeWebView\Application\*\msedgewebview2.exe" 2^>nul') do (
    set "WEBVIEW_FOUND=1"
    goto :webview_done
)
for /f "delims=" %%f in ('dir /b /s "%ProgramFiles%\Microsoft\EdgeWebView\Application\*\msedgewebview2.exe" 2^>nul') do (
    set "WEBVIEW_FOUND=1"
    goto :webview_done
)
:webview_done

if not defined WEBVIEW_FOUND (
    echo [WARNING] Microsoft Edge WebView2 Runtime was not detected.
    echo          MapToPoster (Wails) requires WebView2 to run.
    echo.
    echo Download (Evergreen Bootstrapper):
    echo https://go.microsoft.com/fwlink/p/?LinkId=2124703
    echo.
)

set MTP_LEGACY_WIN7=1
echo Starting MapToPoster in legacy Windows 7 mode...
start "" "%APP_EXE%"
