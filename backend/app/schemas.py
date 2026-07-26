from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    filename: str
    thumbnail: Optional[str] = None
    duration: Optional[str] = None
    size: Optional[str] = None

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
