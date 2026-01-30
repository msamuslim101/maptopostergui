# MapToPoster Wails App

This is the main desktop application built with **Wails** (Go + React).

## Why Wails?

| Feature | Electron | Wails |
|---------|----------|-------|
| Binary Size | ~300MB | ~15MB |
| RAM (Idle) | 500MB+ | 50-80MB |
| Processes | Multiple (zombies) | Single (managed) |
| Startup Time | 3-5s | <1s |

## Development

```powershell
# Ensure Go and Wails are in PATH
$env:Path += ";C:\Program Files\Go\bin;$env:USERPROFILE\go\bin"

# Run in dev mode
wails dev
```

## Building

```powershell
wails build
# Output: build/bin/MapToPoster.exe
```

## Project Structure

```
wails-app/
├── app.go          # Go backend: Window controls, file dialogs, Python sidecar
├── main.go         # Wails entry point
├── frontend/       # React UI
│   ├── src/        # Source code
│   └── wailsjs/    # Auto-generated Go bindings
├── python/         # Python backend (server.exe)
│   └── README.md   # Build instructions
└── build/          # Compiled binaries
```

## Python Backend

The `python/server.exe` is spawned as a managed sidecar:
- Starts with the app
- Auto-killed when app closes (no zombies!)
- Health-checked before frontend connects

Build it from `../backend/`:
```powershell
cd ../backend
pyinstaller server.spec
Copy-Item "dist/server.exe" "../wails-app/python/server.exe"
```

## Author

**msamuslim101** - GUI Design & Wails Implementation
