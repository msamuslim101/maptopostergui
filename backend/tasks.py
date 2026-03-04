import os
import sys
import asyncio
from functools import partial
from models import GenerateRequest
from store import jobs

# Handle PyInstaller path resolution
if getattr(sys, 'frozen', False):
    MAPTOPOSTER_DIR = sys._MEIPASS
else:
    MAPTOPOSTER_DIR = os.path.join(os.path.dirname(__file__), '..', 'maptoposter-main', 'maptoposter-main')

async def generate_map_task(job_id: str, request: GenerateRequest):
    """Background task that generates the map poster"""
    try:
        jobs[job_id]["status"] = "processing"
        jobs[job_id]["progress"] = 10
        jobs[job_id]["message"] = "Looking up coordinates..."
        
        # We must import from create_map_poster AFTER changing dir in server.py
        # but to be safe, we import inside the function
        sys.path.insert(0, MAPTOPOSTER_DIR)
        
        from create_map_poster import (
            get_coordinates, 
            create_poster, 
            load_theme, 
            generate_output_filename
        )
        import create_map_poster
        
        # Get coordinates
        coords = get_coordinates(request.city, request.country)
        
        jobs[job_id]["progress"] = 30
        jobs[job_id]["message"] = "Loading theme..."
        
        # Load theme - need to set global THEME
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
        # Store ONLY the filename (not full path) - frontend appends /api/posters/
        jobs[job_id]["result_path"] = os.path.basename(output_file)
        
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
        jobs[job_id]["message"] = f"Error: {str(e)}"
