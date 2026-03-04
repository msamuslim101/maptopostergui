# Changelog

All notable changes to MapToPosterGUI will be documented in this file.

---

## [1.1.0] - 2026-03-04

### 🏗️ Major Refactoring & Modularization
- **Frontend Architecture**: Split monolithic `App.tsx` into reusable components (`MainCanvas`, `SidebarLeft`, `SidebarRight`, etc.).
- **State Management**: Extracted global state to `AppContext.tsx` for better performance and maintainability.
- **Backend Isolation**: Moved server logic to `tasks.py`, `models.py`, and `store.py`; converted to a robust background task-queue system.
- **Go Logic Extraction**: Separated window management and Python process control into dedicated Go modules.

### ✨ Added
- **Improved UI**: Enhanced sidebars with better grouping, glassmorphism headers, and smoother transitions.

### 🔧 Fixed & Improved
- **Process Management**: Fixed zombie Python processes by implementing a robust `taskkill` signal handler in the Go wrapper.
- **Race conditions**: Implemented a retry loop for the GUI to fetch themes, ensuring the backend is ready before the UI fails.
- **Project Structure**: Cleaned up the root directory and organized research documentation.

---

## [1.0.0] - 2026-01-31

### 🎉 Initial Release

The first public release of MapToPosterGUI — a Windows desktop GUI for generating beautiful city map posters.

![MapToPoster GUI](assets/screenshot.png)

### ✨ Added

**Desktop Application**
- Windows desktop app built with Wails (Go + React)
- Native window with custom title bar
- Lightweight: ~15MB app, ~80MB RAM idle
- Modern dark theme UI with glassmorphism effects

**Map Generation**
- Global city coverage via OpenStreetMap data
- 10 premium themes: Noir, Blueprint, Sunset, Magma, Ocean, Forest, Vintage, Atlas, Minimal, Copper
- Adjustable map radius: 5km - 30km
- Overlay toggles: City name, Country name, Coordinates

**Print Settings**
- Multiple poster sizes: 18×24", 24×36", 12×16", A3, A2
- Portrait and Landscape orientation
- High-resolution PNG output

**Technical**
- FastAPI backend with Python sidecar architecture
- Automatic server.exe lifecycle management (start/stop with app)
- PyInstaller bundling for zero-dependency distribution
- OSMnx caching for faster repeat generations

### 🔧 Based On

- **Core Engine**: [originalankur/maptoposter](https://github.com/originalankur/maptoposter)
- **Snapshot**: January 18, 2026
- **License**: MIT

### 📦 Distribution

- Platform: Windows 10/11 (64-bit)
- Download: [GitHub Releases](https://github.com/msamuslim101/maptopostergui/releases)
- Size: ~121 MB (ZIP includes MapToPoster.exe + python/server.exe)

---

## Upcoming Features

See the [Roadmap](README.md#-roadmap-planned-features) for planned features including:
- Custom city display names (`--name` parameter)
- Dynamic font sizing
- Aspect ratio options (Instagram Stories, A4, etc.)
- SVG/PDF vector export
- macOS and Linux support
