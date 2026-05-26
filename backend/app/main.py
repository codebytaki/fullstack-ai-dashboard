"""
Full-Stack AI Dashboard - FastAPI Backend
Production-Grade API with Authentication, AI Features, and Real-time Updates
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from loguru import logger
import sys
from pathlib import Path
from dotenv import load_dotenv
import asyncio
from datetime import datetime
import random

# Import app modules
from app.core import settings, manager
from app.api import api_router

# Load environment variables
load_dotenv()

# Create logs directory if it doesn't exist
logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)

# Configure logger
logger.remove()  # Remove default handler
logger.add(sys.stderr, level="INFO")  # Console output
logger.add(
    "logs/api_{time}.log",
    rotation="10 MB",
    retention="30 days",
    level="DEBUG",
    backtrace=True,
    diagnose=True
)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-Grade Full-Stack AI Dashboard Backend with Authentication, Real-time Updates, and AI Features",
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_tags=[
        {"name": "health", "description": "Health check endpoints"},
        {"name": "auth", "description": "Authentication and authorization"},
        {"name": "dashboard", "description": "Dashboard statistics and metrics"},
        {"name": "analytics", "description": "Analytics and data visualization"},
        {"name": "ai", "description": "AI-powered features and insights"},
        {"name": "users", "description": "User management"},
        {"name": "websocket", "description": "Real-time WebSocket connections"},
    ]
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

logger.info(f"🚀 {settings.PROJECT_NAME} API Starting...")


# ============================================================================
# ROOT ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"{settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "docs": "/api/docs",
        "status": "running"
    }


@app.get("/api/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": settings.VERSION
    }


# ============================================================================
# INCLUDE API ROUTERS
# ============================================================================

# Include API v1 router
app.include_router(api_router, prefix="/api")


# ============================================================================
# WEBSOCKET ENDPOINT
# ============================================================================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Send real-time updates every 5 seconds
            await asyncio.sleep(5)
            
            update = {
                "type": "stats_update",
                "data": {
                    "active_users": random.randint(50, 200),
                    "requests_per_second": random.randint(10, 100),
                    "cpu_usage": random.uniform(20, 80),
                    "memory_usage": random.uniform(40, 70),
                    "timestamp": datetime.now().isoformat()
                }
            }
            
            await websocket.send_json(update)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)


# ============================================================================
# EXCEPTION HANDLERS
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "detail": str(exc)}
    )


# ============================================================================
# STARTUP/SHUTDOWN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info(f"✅ {settings.PROJECT_NAME} API started successfully")
    logger.info(f"📚 API Documentation: http://localhost:8000/api/docs")
    logger.info(f"🔄 WebSocket endpoint: ws://localhost:8000/ws")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info(f"🛑 {settings.PROJECT_NAME} API shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
