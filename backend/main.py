"""
Full-Stack AI Dashboard - FastAPI Backend
Production-Grade API with Authentication, AI Features, and Real-time Updates
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import asyncio
from loguru import logger
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

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
    title="AI Dashboard API",
    description="Production-Grade Full-Stack AI Dashboard Backend with Authentication, Real-time Updates, and AI Features",
    version="2.0.0",
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
cors_origins = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

logger.info("🚀 AI Dashboard API Starting...")


# ============================================================================
# MODELS
# ============================================================================

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    role: str = "user"
    created_at: Optional[datetime] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: User


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class DashboardStats(BaseModel):
    total_users: int
    active_sessions: int
    total_requests: int
    ai_queries: int
    uptime: str
    cpu_usage: float
    memory_usage: float
    response_time: float
    error_rate: float


class AIInsight(BaseModel):
    id: str
    title: str
    description: str
    severity: str  # critical, warning, info, success
    timestamp: datetime
    category: str
    action_required: bool = False
    confidence: float = 0.0


class AnalyticsData(BaseModel):
    date: str
    users: int
    requests: int
    ai_queries: int
    revenue: Optional[float] = 0.0
    conversion_rate: Optional[float] = 0.0


class AIQueryRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None


class AIQueryResponse(BaseModel):
    query: str
    response: str
    confidence: float
    timestamp: datetime
    sources: Optional[List[str]] = []
    suggestions: Optional[List[str]] = []


class SystemMetrics(BaseModel):
    cpu: Dict[str, Any]
    memory: Dict[str, Any]
    disk: Dict[str, Any]
    network: Dict[str, Any]
    timestamp: datetime


# ============================================================================
# WEBSOCKET CONNECTION MANAGER
# ============================================================================

class ConnectionManager:
    """Enhanced WebSocket connection manager with user tracking"""
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.connection_count = 0

    async def connect(self, websocket: WebSocket, user_id: str = "anonymous"):
        """Connect a WebSocket client"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(websocket)
        self.connection_count += 1
        
        logger.info(f"✅ WebSocket connected: {user_id} | Total: {self.connection_count}")
        
        # Send welcome message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "user_id": user_id,
            "timestamp": datetime.now().isoformat()
        })

    def disconnect(self, websocket: WebSocket, user_id: str = "anonymous"):
        """Disconnect a WebSocket client"""
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
                self.connection_count -= 1
                
                # Clean up empty user lists
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
                
                logger.info(f"❌ WebSocket disconnected: {user_id} | Total: {self.connection_count}")

    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending personal message to {user_id}: {str(e)}")

    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        disconnected = []
        
        for user_id, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to {user_id}: {str(e)}")
                    disconnected.append((connection, user_id))
        
        # Clean up disconnected clients
        for connection, user_id in disconnected:
            self.disconnect(connection, user_id)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        return {
            "total_connections": self.connection_count,
            "unique_users": len(self.active_connections),
            "connections_per_user": {
                user_id: len(connections) 
                for user_id, connections in self.active_connections.items()
            }
        }


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
