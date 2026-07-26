import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine, SessionLocal
from app.models import Video
from app.seed import seed_database
from app.routers import health, videos

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Offline Video Viewer API",
    description="REST API for online video streaming, download, and offline viewing support.",
    version="1.0.0"
)

# CORS Configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in allowed_origins_env.split(",")] if allowed_origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://offline-video-view.vercel.app",
        "https://offline-video-api.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directories exist and mount static files route
os.makedirs("uploads/videos", exist_ok=True)
os.makedirs("uploads/thumbnails", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(health.router)
app.include_router(videos.router)

# Auto-seed database if empty
db = SessionLocal()
try:
    if db.query(Video).count() == 0:
        print("Database empty. Seeding initial video dataset...")
        seed_database(force_redownload=True)
finally:
    db.close()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
