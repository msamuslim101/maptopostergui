"""
MapToPoster FastAPI Backend
Wraps the existing map poster generator with a REST API
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import sys
import json
import asyncio
from datetime import datetime
import uuid

# Handle PyInstaller path resolution
if getattr(sys, 'frozen', False):
    # Running in a PyInstaller bundle
    MAPTOPOSTER_DIR = sys._MEIPASS
else:
    # Running in normal Python environment
    MAPTOPOSTER_DIR = os.path.join(os.path.dirname(__file__), '..', 'maptoposter-main', 'maptoposter-main')

sys.path.insert(0, MAPTOPOSTER_DIR)
os.chdir(MAPTOPOSTER_DIR)  # Change working directory for relative paths

from models import GenerateRequest, GenerateResponse, JobStatus, ThemeInfo
from store import jobs
from tasks import generate_map_task

# Import the map poster functions
from create_map_poster import get_available_themes

app = FastAPI(
    title="MapToPoster API",
    description="Generate beautiful city map posters",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "MapToPoster API is running"}


@app.get("/api/themes")
async def list_themes():
    """Get all available themes with their details"""
    theme_names = get_available_themes()
    themes = []
    
    themes_dir = os.path.join(MAPTOPOSTER_DIR, "themes")
    
    for name in theme_names:
        theme_path = os.path.join(themes_dir, f"{name}.json")
        try:
            with open(theme_path, 'r') as f:
                data = json.load(f)
                themes.append({
                    "id": name,
                    "name": data.get("name", name.replace("_", " ").title()),
                    "description": data.get("description", ""),
                    "bg": data.get("bg", "#000000"),
                    "text": data.get("text", "#FFFFFF")
                })
        except Exception as e:
            themes.append({
                "id": name,
                "name": name.replace("_", " ").title(),
                "description": "",
                "bg": "#000000",
                "text": "#FFFFFF"
            })
    
    return {"themes": themes, "count": len(themes)}


@app.post("/api/generate", response_model=GenerateResponse)
async def generate_poster(request: GenerateRequest, background_tasks: BackgroundTasks):
    """
    Start a map poster generation job.
    Returns a job_id that can be polled for status.
    """
    # Validate theme exists
    available_themes = get_available_themes()
    if request.theme not in available_themes:
        raise HTTPException(
            status_code=400, 
            detail=f"Theme '{request.theme}' not found. Available: {available_themes}"
        )
    
    # Create job
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "status": "pending",
        "progress": 0,
        "message": "Job queued...",
        "result_path": None,
        "error": None,
        "created_at": datetime.now().isoformat()
    }
    
    # Start background task
    background_tasks.add_task(generate_map_task, job_id, request)
    
    return GenerateResponse(
        job_id=job_id,
        status="pending",
        message="Generation started. Poll /api/jobs/{job_id} for status."
    )


@app.get("/api/jobs/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    """Get the status of a generation job"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    return JobStatus(
        job_id=job_id,
        status=job["status"],
        progress=job["progress"],
        message=job["message"],
        result_path=job.get("result_path"),
        error=job.get("error")
    )


@app.get("/api/posters/{filename}")
async def get_poster(filename: str):
    """Serve a generated poster image"""
    posters_dir = os.path.join(MAPTOPOSTER_DIR, "posters")
    file_path = os.path.join(posters_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Poster not found")
    
    return FileResponse(
        file_path, 
        media_type="image/png",
        filename=filename
    )


@app.get("/api/posters")
async def list_posters():
    """List all generated posters"""
    posters_dir = os.path.join(MAPTOPOSTER_DIR, "posters")
    
    if not os.path.exists(posters_dir):
        return {"posters": [], "count": 0}
    
    posters = []
    for f in os.listdir(posters_dir):
        if f.endswith('.png'):
            file_path = os.path.join(posters_dir, f)
            stat = os.stat(file_path)
            posters.append({
                "filename": f,
                "size_bytes": stat.st_size,
                "created_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "url": f"/api/posters/{f}"
            })
    
    # Sort by creation time, newest first
    posters.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {"posters": posters, "count": len(posters)}


if __name__ == "__main__":
    import uvicorn
    # Run server
    # Pass app object directly for PyInstaller compatibility (no module import)
    is_frozen = getattr(sys, 'frozen', False)
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)
