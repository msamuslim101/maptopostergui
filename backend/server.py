"""
MapToPoster FastAPI Backend
Wraps the existing map poster generator with a REST API
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
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

# Import the map poster functions
from create_map_poster import (
    get_coordinates, 
    create_poster, 
    load_theme, 
    get_available_themes,
    generate_output_filename
)

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

# Store for active generation jobs
jobs: dict = {}

# Request/Response Models
class GenerateRequest(BaseModel):
    city: str
    country: str
    theme: str = "noir"
    distance: int = 15000
    show_city_name: bool = True
    show_country_name: bool = True  # NEW
    show_coordinates: bool = True
    orientation: str = "portrait"    # NEW: 'portrait' or 'landscape'
    poster_size: str = "18x24"       # NEW: '18x24', '24x36', '12x16', 'A3', 'A2'
    filename: str = ""               # NEW: optional custom filename

class GenerateResponse(BaseModel):
    job_id: str
    status: str
    message: str

class JobStatus(BaseModel):
    job_id: str
    status: str  # pending, processing, completed, failed
    progress: int  # 0-100
    message: str
    result_path: Optional[str] = None
    error: Optional[str] = None

class ThemeInfo(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    colors: dict


# Background task for map generation
async def generate_map_task(job_id: str, request: GenerateRequest):
    """Background task that generates the map poster"""
    global jobs
    
    try:
        jobs[job_id]["status"] = "processing"
        jobs[job_id]["progress"] = 10
        jobs[job_id]["message"] = "Looking up coordinates..."
        
        # Get coordinates
        coords = get_coordinates(request.city, request.country)
        
        jobs[job_id]["progress"] = 30
        jobs[job_id]["message"] = "Loading theme..."
        
        # Load theme - need to set global THEME
        import create_map_poster
        create_map_poster.THEME = load_theme(request.theme)
        
        jobs[job_id]["progress"] = 40
        jobs[job_id]["message"] = "Downloading map data..."
        
        # Generate output filename (use custom if provided, else auto-generate)
        if request.filename and request.filename.strip():
            # Ensure filename ends with .png and is in posters dir
            clean_name = request.filename.strip().replace('.png', '')
            output_file = os.path.join(MAPTOPOSTER_DIR, "posters", f"{clean_name}.png")
        else:
            output_file = generate_output_filename(request.city, request.theme)
        
        jobs[job_id]["progress"] = 50
        jobs[job_id]["message"] = "Rendering poster..."
        
        # Create the poster with all parameters
        # Using functools.partial to pass keyword arguments
        from functools import partial
        poster_func = partial(
            create_poster,
            request.city, 
            request.country, 
            coords, 
            request.distance, 
            output_file,
            show_city_name=request.show_city_name,
            show_country_name=request.show_country_name,
            show_coordinates=request.show_coordinates,
            orientation=request.orientation,
            poster_size=request.poster_size
        )
        
        # Run in executor to not block
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, poster_func)
        
        jobs[job_id]["progress"] = 100
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["message"] = "Poster generated successfully!"
        jobs[job_id]["result_path"] = output_file
        
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
        jobs[job_id]["message"] = f"Error: {str(e)}"


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
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False if is_frozen else False)

