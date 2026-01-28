@echo off
REM MapToPoster Build Script for Windows
REM Builds both the Python backend and Electron frontend

echo ========================================
echo MapToPoster Build Script
echo ========================================

REM Check if we're in the right directory
if not exist "backend" (
    echo Error: Please run this script from the map-cool directory
    exit /b 1
)

echo.
echo [1/4] Building React Frontend...
echo ========================================
cd react-windows
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error: React build failed
    exit /b 1
)
cd ..

echo.
echo [2/4] Building Python Backend with PyInstaller...
echo ========================================
cd backend
call .\.venv\Scripts\activate
pyinstaller --clean server.spec
if %ERRORLEVEL% neq 0 (
    echo Error: PyInstaller build failed
    exit /b 1
)
cd ..

echo.
echo [3/4] Setting up Electron app...
echo ========================================
REM Copy React build to Electron
if not exist "electron-app\renderer" mkdir electron-app\renderer
xcopy /E /Y react-windows\dist\* electron-app\renderer\

REM Copy backend to electron-app
if not exist "backend-dist" mkdir backend-dist
copy backend\dist\server.exe backend-dist\

cd electron-app
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Electron npm install failed
    exit /b 1
)

echo.
echo [4/4] Building Electron Installer...
echo ========================================
call npm run dist
if %ERRORLEVEL% neq 0 (
    echo Error: Electron build failed
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo Installer: electron-app\dist\MapToPoster-Setup.exe
echo.
