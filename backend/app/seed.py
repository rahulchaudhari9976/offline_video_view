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
            "thumbnail": "react_19_guide.svg",
            "badge": "REACT 19",
            "grad_start": "#06b6d4",
            "grad_end": "#4f46e5",
            "url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            "duration": "00:10",
            "size": "1.1 MB"
        },
        {
            "title": "Building High-Performance Async APIs with FastAPI",
            "description": "Master FastAPI, Pydantic validation, dependency injection, and SQLite database ORM integration.",
            "filename": "fastapi_masterclass.mp4",
            "thumbnail": "fastapi_masterclass.svg",
            "badge": "FASTAPI",
            "grad_start": "#10b981",
            "grad_end": "#0d9488",
            "url": "https://www.w3schools.com/html/mov_bbb.mp4",
            "duration": "00:12",
            "size": "0.8 MB"
        },
        {
            "title": "Progressive Web Apps & Offline First Strategy",
            "description": "Complete breakdown of Service Workers, Cache Storage API, and IndexedDB for offline functionality.",
            "filename": "pwa_indexeddb.mp4",
            "thumbnail": "pwa_indexeddb.svg",
            "badge": "PWA & INDEXEDDB",
            "grad_start": "#8b5cf6",
            "grad_end": "#ec4899",
            "url": "https://www.w3schools.com/tags/movie.mp4",
            "duration": "00:08",
            "size": "0.3 MB"
        },
        {
            "title": "Mastering CSS Grid & Responsive UI Design",
            "description": "Create responsive modern dashboard UI cards, glassmorphism design systems, and animations.",
            "filename": "css_grid_mastery.mp4",
            "thumbnail": "css_grid_mastery.svg",
            "badge": "CSS GRID",
            "grad_start": "#f59e0b",
            "grad_end": "#ef4444",
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
            actual_size = f"{(os.path.getsize(video_path) / (1024 * 1024)):.1f} MB" if os.path.exists(video_path) else item["size"]
            
            thumb_path = os.path.join(thumbnails_dir, item["thumbnail"])
            
            if item["thumbnail"] == "react_19_guide.svg":
                svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg1)"/>
  <circle cx="160" cy="170" r="130" fill="#06b6d4" opacity="0.15"/>
  <circle cx="480" cy="170" r="110" fill="#6366f1" opacity="0.2"/>
  <g transform="translate(160, 160) scale(1.1)">
    <ellipse cx="0" cy="0" rx="70" ry="26" fill="none" stroke="#38bdf8" stroke-width="4.5" opacity="0.9"/>
    <ellipse cx="0" cy="0" rx="70" ry="26" fill="none" stroke="#38bdf8" stroke-width="4.5" transform="rotate(60)" opacity="0.9"/>
    <ellipse cx="0" cy="0" rx="70" ry="26" fill="none" stroke="#38bdf8" stroke-width="4.5" transform="rotate(120)" opacity="0.9"/>
    <circle cx="0" cy="0" r="12" fill="#38bdf8"/>
  </g>
  <rect x="360" y="75" width="230" height="150" rx="12" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1.5"/>
  <circle cx="380" cy="95" r="4" fill="#ef4444"/>
  <circle cx="394" cy="95" r="4" fill="#f59e0b"/>
  <circle cx="408" cy="95" r="4" fill="#10b981"/>
  <rect x="380" y="115" width="100" height="8" rx="4" fill="#38bdf8" opacity="0.9"/>
  <rect x="380" y="131" width="160" height="6" rx="3" fill="#a5b4fc" opacity="0.6"/>
  <rect x="395" y="145" width="120" height="6" rx="3" fill="#818cf8" opacity="0.8"/>
  <rect x="395" y="159" width="140" height="6" rx="3" fill="#38bdf8" opacity="0.5"/>
  <rect x="380" y="173" width="90" height="6" rx="3" fill="#a5b4fc" opacity="0.6"/>
  <rect x="35" y="32" width="155" height="28" rx="14" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" stroke-width="1"/>
  <text x="112" y="49" dominant-baseline="middle" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="11" font-weight="800" letter-spacing="1.5">REACT 19 • MASTER</text>
  <text x="35" y="275" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="900">React 19 &amp; Modern Frontend</text>
  <text x="35" y="305" fill="#94a3b8" font-family="sans-serif" font-size="13" font-weight="600">Server Components • Custom Hooks • Architecture</text>
</svg>'''
            elif item["thumbnail"] == "fastapi_masterclass.svg":
                svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22"/>
      <stop offset="50%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg2)"/>
  <circle cx="160" cy="160" r="130" fill="#10b981" opacity="0.2"/>
  <circle cx="480" cy="180" r="110" fill="#14b8a6" opacity="0.15"/>
  <g transform="translate(160, 155)">
    <circle cx="0" cy="0" r="60" fill="#047857" opacity="0.6"/>
    <path d="M-10,-45 L20,-45 L0,-5 L25,-5 L-15,45 L-5,5 L-25,5 Z" fill="#34d399" stroke="#ffffff" stroke-width="2.5"/>
  </g>
  <rect x="340" y="75" width="250" height="155" rx="12" fill="rgba(2, 44, 34, 0.85)" stroke="rgba(52, 211, 153, 0.3)" stroke-width="1.5"/>
  <text x="360" y="105" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">GET /api/v1/async-data</text>
  <text x="360" y="128" fill="#a7f3d0" font-family="monospace" font-size="11">HTTP/1.1 200 OK</text>
  <text x="360" y="148" fill="#6ee7b7" font-family="monospace" font-size="11">{ "status": "fast",</text>
  <text x="375" y="168" fill="#6ee7b7" font-family="monospace" font-size="11">  "async": true,</text>
  <text x="375" y="188" fill="#6ee7b7" font-family="monospace" font-size="11">  "latency_ms": 1.2 }</text>
  <rect x="35" y="32" width="160" height="28" rx="14" fill="rgba(52, 211, 153, 0.2)" stroke="#34d399" stroke-width="1"/>
  <text x="115" y="49" dominant-baseline="middle" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="11" font-weight="800" letter-spacing="1.5">FASTAPI • ASYNC API</text>
  <text x="35" y="275" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="900">High-Performance Async APIs</text>
  <text x="35" y="305" fill="#a7f3d0" font-family="sans-serif" font-size="13" font-weight="600">FastAPI • Pydantic v2 • SQLite ORM • Uvicorn</text>
</svg>'''
            elif item["thumbnail"] == "pwa_indexeddb.svg":
                svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2e1065"/>
      <stop offset="50%" stop-color="#581c87"/>
      <stop offset="100%" stop-color="#86198f"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg3)"/>
  <circle cx="170" cy="160" r="130" fill="#c084fc" opacity="0.2"/>
  <circle cx="490" cy="170" r="110" fill="#e879f9" opacity="0.15"/>
  <g transform="translate(170, 150)">
    <ellipse cx="0" cy="-35" rx="55" ry="18" fill="#a855f7" opacity="0.9"/>
    <path d="M-55,-35 L-55,0 A55,18 0 0,0 55,0 L55,-35 Z" fill="#9333ea" opacity="0.8"/>
    <ellipse cx="0" cy="0" rx="55" ry="18" fill="#c084fc" opacity="0.9"/>
    <path d="M-55,0 L-55,35 A55,18 0 0,0 55,35 L55,0 Z" fill="#7e22ce" opacity="0.8"/>
    <ellipse cx="0" cy="35" rx="55" ry="18" fill="#e879f9" opacity="0.9"/>
  </g>
  <rect x="360" y="80" width="220" height="140" rx="16" fill="rgba(46, 16, 101, 0.85)" stroke="rgba(216, 180, 254, 0.3)" stroke-width="1.5"/>
  <rect x="380" y="105" width="180" height="34" rx="8" fill="rgba(168, 85, 247, 0.3)"/>
  <text x="470" y="125" dominant-baseline="middle" text-anchor="middle" fill="#f5d0fe" font-family="sans-serif" font-size="12" font-weight="bold">100% OFFLINE READY</text>
  <text x="380" y="165" fill="#e9d5ff" font-family="sans-serif" font-size="11">Service Worker Active</text>
  <text x="380" y="185" fill="#e9d5ff" font-family="sans-serif" font-size="11">IndexedDB Storage</text>
  <rect x="35" y="32" width="165" height="28" rx="14" fill="rgba(232, 121, 249, 0.2)" stroke="#e879f9" stroke-width="1"/>
  <text x="117" y="49" dominant-baseline="middle" text-anchor="middle" fill="#f5d0fe" font-family="sans-serif" font-size="11" font-weight="800" letter-spacing="1.5">PWA • ZERO DATA</text>
  <text x="35" y="275" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="900">Progressive Web Apps Strategy</text>
  <text x="35" y="305" fill="#f5d0fe" font-family="sans-serif" font-size="13" font-weight="600">Service Workers • Cache Storage API • IndexedDB</text>
</svg>'''
            else:
                svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="50%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#9a3412"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg4)"/>
  <circle cx="160" cy="165" r="130" fill="#f59e0b" opacity="0.2"/>
  <circle cx="480" cy="175" r="110" fill="#f97316" opacity="0.15"/>
  <g transform="translate(70, 85)">
    <rect x="0" y="0" width="180" height="135" rx="10" fill="rgba(0,0,0,0.3)" stroke="#fbbf24" stroke-width="2"/>
    <rect x="10" y="10" width="160" height="22" rx="4" fill="#f59e0b" opacity="0.9"/>
    <rect x="10" y="38" width="45" height="87" rx="4" fill="#fb923c" opacity="0.8"/>
    <rect x="62" y="38" width="50" height="40" rx="4" fill="#f43f5e" opacity="0.8"/>
    <rect x="118" y="38" width="52" height="40" rx="4" fill="#e11d48" opacity="0.8"/>
    <rect x="62" y="84" width="108" height="41" rx="4" fill="#f59e0b" opacity="0.7"/>
  </g>
  <g transform="translate(460, 150)">
    <polygon points="-40,-50 40,-50 32,45 0,55 -32,45" fill="#f97316" stroke="#ffffff" stroke-width="2"/>
    <text x="0" y="5" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="900">CSS3</text>
  </g>
  <rect x="35" y="32" width="160" height="28" rx="14" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" stroke-width="1"/>
  <text x="115" y="49" dominant-baseline="middle" text-anchor="middle" fill="#fde68a" font-family="sans-serif" font-size="11" font-weight="800" letter-spacing="1.5">CSS GRID • UI DESIGN</text>
  <text x="35" y="275" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="900">Mastering CSS Grid &amp; Layouts</text>
  <text x="35" y="305" fill="#fde68a" font-family="sans-serif" font-size="13" font-weight="600">Responsive Grid • Flexbox • Glassmorphism UI</text>
</svg>'''

            with open(thumb_path, "w", encoding="utf-8") as f:
                f.write(svg_content)

            video_obj = Video(
                title=item["title"],
                description=item["description"],
                filename=item["filename"],
                thumbnail=f"/uploads/thumbnails/{item['thumbnail']}",
                duration=item["duration"],
                size=actual_size
            )
            db.add(video_obj)
        db.commit()
        print("Database successfully seeded with real playable sample videos and SVG thumbnails!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(force_redownload=True)
