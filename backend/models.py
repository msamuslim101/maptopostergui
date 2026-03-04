from pydantic import BaseModel
from typing import Optional

class GenerateRequest(BaseModel):
    city: str
    country: str
    theme: str = "noir"
    distance: int = 15000
    show_city_name: bool = True
    show_country_name: bool = True
    show_coordinates: bool = True
    orientation: str = "portrait"
    poster_size: str = "18x24"
    filename: str = ""

class GenerateResponse(BaseModel):
    job_id: str
    status: str
    message: str

class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: int
    message: str
    result_path: Optional[str] = None
    error: Optional[str] = None

class ThemeInfo(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    colors: dict
