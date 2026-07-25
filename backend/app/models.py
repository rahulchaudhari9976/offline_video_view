from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base


class Video(Base):
    """Database model representing a video entity."""
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    filename = Column(String, nullable=False)
    thumbnail = Column(String)
    duration = Column(String)
    size = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)