import os
import urllib.request
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Video

def seed_database(force_redownload=True):
    """Seed the database with sample video entries and real playable sample MP4 files."""
    Base.metadata.create_all(bind=engine)
    
    videos_dir = os.path.join("uploads", "videos")
    thumbnails_dir = os.path.join("uploads", "thumbnails")
    
    os.makedirs(videos_dir, exist_ok=True)
    os.makedirs(thumbnails_dir, exist_ok=True)
    
    sample_videos = [
        {
            "title": "React 19 & Modern Frontend Architecture",
            "description": "Learn the core concepts of React 19, Server Components, Hooks, and modern web application patterns.",
            "filename": "react_19_guide.mp4",
            "thumbnail": "react_19_guide.jpg",
            "url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            "duration": "00:10",
            "size": "1.1 MB"
        },
        {
            "title": "Building High-Performance Async APIs with FastAPI",
            "description": "Master FastAPI, Pydantic validation, dependency injection, and SQLite database ORM integration.",
            "filename": "fastapi_masterclass.mp4",
            "thumbnail": "fastapi_masterclass.jpg",
            "url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "duration": "00:12",
            "size": "0.8 MB"
        },
        {
            "title": "Progressive Web Apps & Offline First Strategy",
            "description": "Complete breakdown of Service Workers, Cache Storage API, and IndexedDB for offline functionality.",
            "filename": "pwa_indexeddb.mp4",
            "thumbnail": "pwa_indexeddb.jpg",
            "url": "https://www.w3schools.com/tags/movie.mp4",
            "duration": "00:08",
            "size": "0.3 MB"
        },
        {
            "title": "Mastering CSS Grid & Responsive UI Design",
            "description": "Create responsive modern dashboard UI cards, glassmorphism design systems, and animations.",
            "filename": "css_grid_mastery.mp4",
            "thumbnail": "css_grid_mastery.jpg",
            "url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            "duration": "00:10",
            "size": "1.1 MB"
        }
    ]
    
    db: Session = SessionLocal()
    try:
        db.query(Video).delete()
        db.commit()
        
        for item in sample_videos:
            video_path = os.path.join(videos_dir, item["filename"])
            
            # Download real playable MP4 sample video
            if force_redownload or not os.path.exists(video_path) or os.path.getsize(video_path) == 512012:
                print(f"Downloading real sample video: {item['title']}...")
                try:
                    req = urllib.request.Request(
                        item["url"],
                        headers={'User-Agent': 'Mozilla/5.0'}
                    )
                    with urllib.request.urlopen(req) as resp, open(video_path, 'wb') as out_file:
                        out_file.write(resp.read())
                    print(f"Downloaded {item['filename']} ({os.path.getsize(video_path)} bytes) successfully.")
                except Exception as e:
                    print(f"Failed to download remote video sample ({e}). Keeping fallback binary...")
            
            thumb_path = os.path.join(thumbnails_dir, item["thumbnail"])
            if not os.path.exists(thumb_path):
                svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
                    <defs>
                        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#1e1b4b"/>
                            <stop offset="50%" stop-color="#312e81"/>
                            <stop offset="100%" stop-color="#4c1d95"/>
                        </linearGradient>
                    </defs>
                    <rect width="640" height="360" fill="url(#g)"/>
                    <circle cx="320" cy="180" r="45" fill="rgba(99, 102, 241, 0.4)"/>
                    <polygon points="310,160 340,180 310,200" fill="#ffffff"/>
                    <text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" fill="#f3f4f6" font-family="sans-serif" font-size="22" font-weight="bold">{item['title']}</text>
                </svg>'''
                with open(thumb_path, "w", encoding="utf-8") as f:
                    f.write(svg_content)

            video_obj = Video(
                title=item["title"],
                description=item["description"],
                filename=item["filename"],
                thumbnail=f"/uploads/thumbnails/{item['thumbnail']}",
                duration=item["duration"],
                size=item["size"]
            )
            db.add(video_obj)
        db.commit()
        print("Database successfully seeded with real playable sample videos!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(force_redownload=True)
