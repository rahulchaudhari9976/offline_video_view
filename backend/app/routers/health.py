from fastapi import APIRouter

router = APIRouter(tags=["Health Check"])

@router.get("/")
@router.get("/health")
def health_check():
    """Health check endpoint for platform deployment (Render / Vercel ping)."""
    return {
        "status": "online",
        "app": "Offline Learning Hub API",
        "version": "1.0.0"
    }
