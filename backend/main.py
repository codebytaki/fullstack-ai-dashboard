"""
Full-Stack AI Dashboard - FastAPI Backend
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import asyncio
from loguru import logger
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Dashboard API",
    description="Full-Stack AI Dashboard Backend",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logger
logger.add("logs/api_{time}.log", rotation="10 MB", retention="30 days")


# Models
class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True


class LoginRequest(BaseModel):
    username: str
    password: str


class DashboardStats(BaseModel):
    total_users: int
    active_sessions: int
    total_requests: int
    ai_queries: int
    uptime: str
    cpu_usage: float
    memory_usage: float


class AIInsight(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    timestamp: datetime
    category: str


class AnalyticsData(BaseModel):
    date: str
    users: int
    requests: int
    ai_queries: int


# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {str(e)}")


manager = ConnectionManager()


# Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Dashboard API",
        "version": "2.0.0",
        "docs": "/api/docs",
        "status": "running"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }


@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """User login endpoint"""
    # Simulate authentication (replace with real auth)
    if request.username == "admin" and request.password == "admin":
        return {
            "access_token": "fake-jwt-token-12345",
            "token_type": "bearer",
            "user": {
                "id": 1,
                "username": request.username,
                "email": "admin@example.com",
                "full_name": "Admin User"
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.post("/api/auth/register")
async def register(user: User):
    """User registration endpoint"""
    # Simulate registration
    return {
        "message": "User registered successfully",
        "user": {
            "id": 1,
            "username": user.username,
            "email": user.email
        }
    }


@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get dashboard statistics"""
    import random
    
    return DashboardStats(
        total_users=random.randint(1000, 5000),
        active_sessions=random.randint(50, 200),
        total_requests=random.randint(10000, 50000),
        ai_queries=random.randint(500, 2000),
        uptime="99.9%",
        cpu_usage=random.uniform(20, 80),
        memory_usage=random.uniform(40, 70)
    )


@app.get("/api/analytics", response_model=List[AnalyticsData])
async def get_analytics():
    """Get analytics data for charts"""
    import random
    from datetime import timedelta
    
    data = []
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(30):
        date = base_date + timedelta(days=i)
        data.append(AnalyticsData(
            date=date.strftime("%Y-%m-%d"),
            users=random.randint(100, 500),
            requests=random.randint(1000, 5000),
            ai_queries=random.randint(50, 200)
        ))
    
    return data


@app.get("/api/ai/insights", response_model=List[AIInsight])
async def get_ai_insights():
    """Get AI-powered insights"""
    insights = [
        AIInsight(
            id="1",
            title="High Traffic Detected",
            description="Unusual spike in user activity detected in the last hour",
            severity="warning",
            timestamp=datetime.now(),
            category="performance"
        ),
        AIInsight(
            id="2",
            title="Optimization Opportunity",
            description="Database queries can be optimized for 30% better performance",
            severity="info",
            timestamp=datetime.now() - timedelta(hours=2),
            category="optimization"
        ),
        AIInsight(
            id="3",
            title="Security Alert",
            description="Multiple failed login attempts detected from same IP",
            severity="critical",
            timestamp=datetime.now() - timedelta(hours=1),
            category="security"
        )
    ]
    
    return insights


@app.post("/api/ai/query")
async def ai_query(query: dict):
    """AI-powered query endpoint"""
    user_query = query.get("query", "")
    
    # Simulate AI response
    response = {
        "query": user_query,
        "response": f"AI analysis for: {user_query}. This is a simulated response. In production, this would use OpenAI or other AI services.",
        "confidence": 0.95,
        "timestamp": datetime.now().isoformat()
    }
    
    return response


@app.get("/api/users")
async def get_users():
    """Get list of users"""
    users = [
        {"id": 1, "username": "admin", "email": "admin@example.com", "role": "admin"},
        {"id": 2, "username": "user1", "email": "user1@example.com", "role": "user"},
        {"id": 3, "username": "user2", "email": "user2@example.com", "role": "user"},
    ]
    return users


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Send real-time updates every 5 seconds
            await asyncio.sleep(5)
            
            import random
            update = {
                "type": "stats_update",
                "data": {
                    "active_users": random.randint(50, 200),
                    "requests_per_second": random.randint(10, 100),
                    "timestamp": datetime.now().isoformat()
                }
            }
            
            await websocket.send_json(update)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket)


@app.get("/api/metrics")
async def get_metrics():
    """Get system metrics"""
    import random
    
    return {
        "cpu": {
            "usage": random.uniform(20, 80),
            "cores": 8,
            "temperature": random.uniform(40, 70)
        },
        "memory": {
            "used": random.uniform(4, 12),
            "total": 16,
            "percentage": random.uniform(30, 75)
        },
        "disk": {
            "used": random.uniform(100, 400),
            "total": 500,
            "percentage": random.uniform(20, 80)
        },
        "network": {
            "upload": random.uniform(1, 10),
            "download": random.uniform(5, 50)
        }
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "detail": str(exc)}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
