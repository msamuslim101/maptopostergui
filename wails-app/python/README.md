# Python Backend (Sidecar)

This folder contains the Python backend for map generation.

## Building the Server

1. Navigate to the original backend folder:
   ```powershell
   cd d:\sohai\code\Testing some new X projects\map-cool\backend
   ```

2. Build with PyInstaller:
   ```powershell
   pyinstaller server.spec
   ```

3. Copy the output to this folder:
   ```powershell
   Copy-Item -Path "dist\server.exe" -Destination "d:\sohai\code\Testing some new X projects\map-cool-wails\python\server.exe"
   ```

## How It Works

- The Go app spawns `python/server.exe` on startup
- Uses `exec.CommandContext` to tie the process to the app lifecycle
- When the Wails app closes, the Python backend is automatically killed
- **No more zombie processes!**

## API Endpoints

The server runs on `http://127.0.0.1:8000` and provides:
- `GET /` - Health check
- `GET /api/themes` - List available themes
- `POST /api/generate` - Start map generation job
- `GET /api/jobs/{job_id}` - Get job status
- `GET /api/posters/{filename}` - Serve generated poster
