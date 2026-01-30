# MapToPosterGUI 🗺️

A premium, open-source desktop application for generating beautiful city map posters. Built with **Wails (Go + React)** for a lightweight, native Windows experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![Stack](https://img.shields.io/badge/stack-Wails%20%7C%20Go%20%7C%20React%20%7C%20Python-blueviolet)

> **Made with ❤️ by [msamuslim101](https://github.com/msamuslim101)**

## ✨ Features

- **Global Coverage**: Generate high-resolution map posters for *any* city in the world using OpenStreetMap data.
- **Premium Themes**: Choose from 10+ professionally designed themes (Noir, Blueprint, Sunset, Ocean, etc.).
- **Customizable**:
  - Toggle city name, country, and coordinate overlays.
  - Adjust map radius (5km - 30km) for perfect framing.
  - Portrait and Landscape orientation support.
- **Multiple Sizes**: Pre-configured for standard framing sizes (18×24", 24×36", A3, A2).
- **Native Experience**:
  - Lightweight single-binary app (~15MB + Python backend).
  - Low RAM usage (<100MB idle vs 500MB+ with Electron).
  - No zombie processes - managed Python lifecycle.
  - Native file dialogs and window controls.

## 🏗️ Architecture

```
MapToPoster/
├── wails-app/              # 🚀 Wails Desktop App (Recommended)
│   ├── app.go              # Go backend + Python sidecar management
│   ├── main.go             # Wails entry point
│   ├── frontend/           # React UI (ported from react-windows)
│   └── python/             # Python server.exe (bundled)
├── backend/                # Python FastAPI server (map generation)
│   ├── server.py           # REST API for themes & poster generation
│   └── server.spec         # PyInstaller build config
├── maptoposter-main/       # Core Engine (osmnx + matplotlib)
├── react-windows/          # Original React UI source
├── electron-app/           # Legacy Electron wrapper (deprecated)
└── design/                 # UI prototypes and mockups
```

## 🚀 Quick Start (Wails Version)

### Prerequisites
- **Go** 1.21+ ([download](https://go.dev/dl/))
- **Node.js** 18+ ([download](https://nodejs.org/))
- **Python** 3.11+ ([download](https://python.org/))
- **Wails CLI**: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`

### Development Mode

```powershell
# 1. Build Python backend
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt  # or install manually
pyinstaller server.spec

# 2. Copy to Wails app
Copy-Item "dist\server.exe" "..\wails-app\python\server.exe"

# 3. Run Wails dev
cd ..\wails-app
wails dev
```

### Production Build

```powershell
cd wails-app
wails build
# Output: build/bin/MapToPoster.exe
```

## 📦 Distribution

The final package includes:
- `MapToPoster.exe` (~15MB) - Wails app
- `python/server.exe` (~150MB) - Python backend (bundled osmnx)

**Total Install Size**: ~165MB (vs ~300MB+ with Electron)
**RAM Usage**: ~50-80MB idle (vs 500MB+ with Electron)

## 🔧 Legacy Electron Version

The `electron-app/` folder contains the original Electron implementation. It's deprecated but kept for reference.

```powershell
# To use legacy version:
build.bat
# Output: electron-app/dist/MapToPoster Setup 1.0.0.exe
```

## 🙏 Acknowledgements

- **[originalankur](https://github.com/originalankur/maptoposter)** - Original maptoposter backend
- **[Wails](https://wails.io/)** - Go + WebView framework

## 📄 License

MIT License. Free for personal and commercial use.
