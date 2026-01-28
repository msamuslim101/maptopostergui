@echo off
echo ========================================
echo MapToPoster Backend Server
echo ========================================
echo.

REM Check if virtual environment exists in maptoposter directory
set VENV_PATH=..\maptoposter-main\maptoposter-main\.venv

if exist "%VENV_PATH%\Scripts\activate.bat" (
    echo Activating existing virtual environment...
    call "%VENV_PATH%\Scripts\activate.bat"
) else (
    echo Creating virtual environment...
    python -m venv .venv
    call .venv\Scripts\activate.bat
)

echo.
echo Installing FastAPI dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI server on http://127.0.0.1:8000
echo API Docs available at http://127.0.0.1:8000/docs
echo.
python server.py
