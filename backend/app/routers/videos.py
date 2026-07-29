import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Video
from app.schemas import VideoResponse

router = APIRouter(prefix="/videos", tags=["Videos"])

@router.get("", response_model=List[VideoResponse])
def list_videos(search: Optional[str] = None, db: Session = Depends(get_db)):
    """List all available videos with optional search query filter."""
    query = db.query(Video)
    if search and search.strip():
        clean_search = search.strip()
        query = query.filter(
            Video.title.ilike(f"%{clean_search}%") | Video.description.ilike(f"%{clean_search}%")
        )
    return query.order_by(Video.id.desc()).all()


@router.get("/{video_id}", response_model=VideoResponse)
def get_video_details(video_id: int, db: Session = Depends(get_db)):
    """Get metadata for a single video by ID."""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


MAX_CHUNK_SIZE = 2 * 1024 * 1024  # 2MB max chunk size per partial content response


@router.get("/{video_id}/stream")
def stream_video(
    video_id: int,
    range_header: Optional[str] = Header(None, alias="Range"),
    range: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Stream video with HTTP 206 Partial Content range requests for instant seek/buffering."""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    file_path = os.path.join("uploads", "videos", video.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video file missing on server")

    file_size = os.path.getsize(file_path)
    req_range = range_header or range

    if req_range:
        req_range = req_range.strip()
        unit, _, ranges = req_range.partition("=")
        if unit != "bytes":
            raise HTTPException(status_code=416, detail="Invalid Range Unit")

        range_start, _, range_end = ranges.partition("-")
        start = int(range_start) if range_start else 0

        if range_end:
            end = int(range_end)
        else:
            end = min(start + MAX_CHUNK_SIZE - 1, file_size - 1)

        if start >= file_size or start > end:
            raise HTTPException(status_code=416, detail="Requested Range Not Satisfiable")

        end = min(end, file_size - 1)
        chunk_size = (end - start) + 1

        def video_stream():
            with open(file_path, "rb") as f:
                f.seek(start)
                bytes_left = chunk_size
                while bytes_left > 0:
                    read_bytes = min(64 * 1024, bytes_left)
                    data = f.read(read_bytes)
                    if not data:
                        break
                    bytes_left -= len(data)
                    yield data

        headers = {
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(chunk_size),
            "Content-Type": "video/mp4",
            "Cache-Control": "public, max-age=3600",
        }
        return StreamingResponse(video_stream(), status_code=206, headers=headers)

    return FileResponse(
        file_path,
        media_type="video/mp4",
        headers={
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600",
        }
    )


@router.get("/{video_id}/download")
def download_video(video_id: int, db: Session = Depends(get_db)):
    """Download raw video file blob for offline IndexedDB caching."""
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    file_path = os.path.join("uploads", "videos", video.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video file missing on server")

    return FileResponse(
        file_path,
        filename=video.filename,
        media_type="application/octet-stream"
    )
