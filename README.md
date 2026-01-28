# MapToPoster 🗺️

A premium, open-source desktop application for generating beautiful city map posters. Built with React (Frontend), FastAPI (Backend), and Electron (Desktop wrapper).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Electron%20%7C%20Python-blueviolet)

> [!WARNING]
> **Status & Performance Note**: This application is currently in an experimental state. The Electron + Python architecture is resource-intensive and may exhibit lag or bugs. Please use with caution while we work on optimization.

## ✨ Features

- **Global Coverage**: Generate high-resolution map posters for *any* city in the world using OpenStreetMap data.
- **Premium Themes**: Choose from 10+ professionally designed themes (Noir, Blueprint, Sunset, Ocean, etc.).
- **Customizable**:
  - Toggle city name, country, and coordinate overlays.
  - Adjust map radius (5km - 30km) for perfect framing.
  - Portrait and Landscape orientation support.
- **Multiple Sizes**: Pre-configured for standard framing sizes:
  - 18" x 24" (3:4)
  - 24" x 36" (2:3)
  - 12" x 16" (3:4)
  - A3 (ISO)
  - A2 (ISO)
- **Native Experience**:
  - Full desktop integration with native save dialogs.
  - Minimimalist, frameless UI with custom window controls.
  - "Download to PC" for web-style usage.

## 🏗️ Technical Architecture

The application follows a modular architecture:

```
map-cool/
├── react-windows/     # Frontend (UI)
│   ├── src/           # React components, Tailwind styling
│   └── dist/          # Compiled static assets
├── backend/           # Backend (Logic)
│   ├── server.py      # FastAPI REST server
│   ├── server.spec    # PyInstaller build configuration
│   └── .venv/         # Python environment
├── maptoposter-main/  # Core Engine
│   └── create_map_poster.py # OSMnx & Matplotlib poster generator
├── electron-app/      # Desktop Wrapper
│   ├── main.js        # Main process: Window mgmt + Backend spawning
│   ├── preload.js     # IPC Bridge (Safe API exposure)
│   └── dist/          # Final Windows Installer (.exe)
└── build.bat          # Master Build Script
```

## 🚀 Developer Guide

Follow these steps to set up the project locally for development or contributions.

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **Git**

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn osmnx matplotlib scipy networkx geopandas geopy pydantic
   ```
4. Run the development server:
   ```bash
   python server.py
   ```
   *Server runs on: http://127.0.0.1:8000*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend:
   ```bash
   cd react-windows
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *App opens at: http://localhost:5173*

### 3. Electron Setup (Optional)
To test the desktop wrapper behavior in dev mode:
1. Ensure both Backend and Frontend servers are running.
2. Open a third terminal:
   ```bash
   cd electron-app
   npm install
   npm start
   ```

## 📦 Building for Distribution

To create a standalone Windows Installer (`.exe`) that doesn't require Python or Node on the user's machine, use the provided build script.

**How it works:**
1. **Frontend**: Builds React app to static files (`npm run build`).
2. **Backend**: Bundles Python environment + scripts into a single `server.exe` using PyInstaller.
3. **Electron**: Packages the React static files and copies the `server.exe` into its resources.
4. **Installer**: Generates a standard Windows installer using `electron-builder` (NSIS).

**Run the build:**
```bash
# From project root
build.bat
```

**Output:**
The final installer will be located at:
`electron-app\dist\MapToPoster Setup 1.0.0.exe`

## 🔮 Future Roadmap
- [ ] **Architecture Migration**: Replace Electron/Python with **Wails (Go)** for a lightweight, single-process app (<100MB RAM).

## 🙏 Acknowledgements
Special thanks to [Ankur (originalankur)](https://github.com/originalankur/maptoposter) for the original `maptoposter` backend implementation which powers the map generation logic in this project.

## 📄 License
MIT License. Free for personal and commercial use.
