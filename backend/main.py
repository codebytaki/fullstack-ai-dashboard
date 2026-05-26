"""
Full-Stack AI Dashboard — FastAPI Backend v2.0
Production-grade API: JWT auth, real-time WebSocket, AI endpoints, system metrics
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import asyncio
import random
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from loguru import logger
from jose import JWTError, jwt
import bcrypt

# ── Bootstrap ─────────────────────────────────────────────────────────────────
load_dotenv()

logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)

logger.remove()
logger.add(sys.stderr, level="INFO", colorize=True,
           format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | {message}")
logger.add("logs/api_{time}.log", rotation="10 MB", retention="30 days",
           level="DEBUG", backtrace=True, diagnose=True)

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production-super-secret-key-32chars")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7
CORS_ORIGINS = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Dashboard API",
    description="Production-Grade Full-Stack AI Dashboard — FastAPI + React",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


# ── Models ────────────────────────────────────────────────────────────────────
class UserDB(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    role: str = "user"
    created_at: datetime = datetime.now()


class User(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool = True
    role: str = "user"
    created_at: datetime


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


class AnalyticsData(BaseModel):
    date: str
    users: int
    requests: int
    ai_queries: int
    revenue: float = 0.0
    conversion_rate: float = 0.0


class AIInsight(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    timestamp: datetime
    category: str
    action_required: bool = False
    confidence: float = 0.0


class AIQueryRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None


class AIQueryResponse(BaseModel):
    query: str
    response: str
    confidence: float
    timestamp: datetime
    sources: List[str] = []
    suggestions: List[str] = []


class SystemMetrics(BaseModel):
    cpu: Dict[str, Any]
    memory: Dict[str, Any]
    disk: Dict[str, Any]
    network: Dict[str, Any]
    timestamp: datetime


# ── In-memory "database" ──────────────────────────────────────────────────────
_users_db: Dict[str, UserDB] = {}


def _seed_users():
    """Seed default users on startup."""
    defaults = [
        ("admin", "admin@example.com", "admin", "Admin User", "admin"),
        ("alice", "alice@example.com", "alice123", "Alice Johnson", "user"),
        ("bob", "bob@example.com", "bob123", "Bob Smith", "user"),
        ("carol", "carol@example.com", "carol123", "Carol White", "viewer"),
    ]
    for i, (username, email, password, full_name, role) in enumerate(defaults, start=1):
        _users_db[username] = UserDB(
            id=i,
            username=username,
            email=email,
            full_name=full_name,
            hashed_password=hash_password(password),
            role=role,
            created_at=datetime.now() - timedelta(days=random.randint(1, 365)),
        )


# ── Security helpers ──────────────────────────────────────────────────────────
def create_token(data: dict, expires_delta: timedelta, token_type: str = "access") -> str:
    payload = {**data, "type": token_type, "exp": datetime.utcnow() + expires_delta}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub", "")
        if not username or payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    user = _users_db.get(username)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    return User(**user.model_dump(exclude={"hashed_password"}))


# ── WebSocket manager ─────────────────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.append(ws)
        logger.info(f"WS connected | total={len(self.connections)}")

    def disconnect(self, ws: WebSocket):
        if ws in self.connections:
            self.connections.remove(ws)
        logger.info(f"WS disconnected | total={len(self.connections)}")

    async def broadcast(self, data: dict):
        dead = []
        for ws in self.connections:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)


manager = ConnectionManager()


# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    _seed_users()
    logger.info("✅ AI Dashboard API v2.0 started")
    logger.info("📚 Docs: http://localhost:8000/api/docs")


# ── Root / Health ─────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "AI Dashboard API", "version": "2.0.0", "docs": "/api/docs"}


@app.get("/api/health", tags=["health"])
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat(), "version": "2.0.0"}


# ── Auth ──────────────────────────────────────────────────────────────────────
@app.post("/api/auth/login", response_model=LoginResponse, tags=["auth"])
async def login(req: LoginRequest):
    user = _users_db.get(req.username)
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access = create_token(
        {"sub": user.username, "user_id": user.id},
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    refresh = create_token(
        {"sub": user.username},
        timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        token_type="refresh",
    )
    return LoginResponse(
        access_token=access,
        refresh_token=refresh,
        user=User(**user.model_dump(exclude={"hashed_password"})),
    )


@app.post("/api/auth/register", response_model=User, tags=["auth"])
async def register(req: RegisterRequest):
    if req.username in _users_db:
        raise HTTPException(status_code=400, detail="Username already taken")
    new_id = max((u.id for u in _users_db.values()), default=0) + 1
    new_user = UserDB(
        id=new_id,
        username=req.username,
        email=req.email,
        full_name=req.full_name,
        hashed_password=hash_password(req.password),
        role="user",
    )
    _users_db[req.username] = new_user
    return User(**new_user.model_dump(exclude={"hashed_password"}))


@app.post("/api/auth/logout", tags=["auth"])
async def logout():
    return {"message": "Logged out successfully"}


# ── Dashboard ─────────────────────────────────────────────────────────────────
@app.get("/api/dashboard/stats", response_model=DashboardStats, tags=["dashboard"])
async def get_stats(current_user: User = Depends(get_current_user)):
    return DashboardStats(
        total_users=len(_users_db),
        active_sessions=random.randint(50, 200),
        total_requests=random.randint(10_000, 50_000),
        ai_queries=random.randint(500, 2_000),
        uptime="99.9%",
        cpu_usage=random.uniform(20, 75),
        memory_usage=random.uniform(40, 70),
        response_time=random.uniform(45, 180),
        error_rate=random.uniform(0.05, 1.5),
    )


@app.get("/api/dashboard/analytics", response_model=List[AnalyticsData], tags=["dashboard"])
async def get_analytics(current_user: User = Depends(get_current_user)):
    base = datetime.now() - timedelta(days=30)
    return [
        AnalyticsData(
            date=(base + timedelta(days=i)).strftime("%Y-%m-%d"),
            users=random.randint(80, 500),
            requests=random.randint(800, 5_000),
            ai_queries=random.randint(40, 250),
            revenue=round(random.uniform(800, 6_000), 2),
            conversion_rate=round(random.uniform(1.5, 9.0), 2),
        )
        for i in range(30)
    ]


@app.get("/api/dashboard/metrics", response_model=SystemMetrics, tags=["dashboard"])
async def get_metrics(current_user: User = Depends(get_current_user)):
    return SystemMetrics(
        cpu={"usage": random.uniform(20, 80), "cores": 8, "temperature": random.uniform(38, 72)},
        memory={"used": round(random.uniform(4, 12), 1), "total": 16, "percentage": random.uniform(25, 75)},
        disk={"used": round(random.uniform(80, 380), 1), "total": 500, "percentage": random.uniform(16, 76)},
        network={"upload": round(random.uniform(0.5, 12), 2), "download": round(random.uniform(3, 55), 2)},
        timestamp=datetime.now(),
    )


# ── AI ────────────────────────────────────────────────────────────────────────
@app.get("/api/ai/insights", response_model=List[AIInsight], tags=["ai"])
async def get_insights(current_user: User = Depends(get_current_user)):
    now = datetime.now()
    return [
        AIInsight(id="1", title="High Traffic Detected",
                  description="Unusual spike in user activity detected in the last hour. Consider auto-scaling.",
                  severity="warning", timestamp=now, category="performance",
                  action_required=True, confidence=0.92),
        AIInsight(id="2", title="Database Optimization Available",
                  description="Query analysis shows 30% performance gain possible with index optimization.",
                  severity="info", timestamp=now - timedelta(hours=2), category="optimization",
                  action_required=False, confidence=0.85),
        AIInsight(id="3", title="Security Alert",
                  description="Multiple failed login attempts from IP 192.168.1.105. Consider blocking.",
                  severity="critical", timestamp=now - timedelta(hours=1), category="security",
                  action_required=True, confidence=0.98),
        AIInsight(id="4", title="Cost Savings Identified",
                  description="Unused compute resources detected. Estimated savings: $480/month.",
                  severity="success", timestamp=now - timedelta(hours=3), category="cost",
                  action_required=False, confidence=0.88),
        AIInsight(id="5", title="Memory Usage Trending Up",
                  description="Memory consumption has increased 18% over the past 24 hours.",
                  severity="warning", timestamp=now - timedelta(minutes=30), category="performance",
                  action_required=True, confidence=0.79),
    ]


@app.post("/api/ai/query", response_model=AIQueryResponse, tags=["ai"])
async def ai_query(req: AIQueryRequest, current_user: User = Depends(get_current_user)):
    # Simulate AI processing delay
    await asyncio.sleep(0.5)

    # Build a contextual response based on keywords
    q = req.query.lower()
    if any(w in q for w in ["performance", "slow", "speed", "latency"]):
        response = (
            f"Based on current metrics, your system response time averages 120ms with CPU at 45%. "
            f"The main bottleneck appears to be database query latency. "
            f"I recommend enabling query result caching and reviewing the top 5 slowest queries in your logs."
        )
        suggestions = ["Enable Redis query caching", "Add database indexes on user_id and created_at", "Review slow query log"]
        sources = ["System Metrics", "Database Analytics", "Performance Baseline"]
    elif any(w in q for w in ["security", "threat", "attack", "login"]):
        response = (
            f"Security analysis shows 3 suspicious login attempts in the last hour from the same IP range. "
            f"Your current error rate is within normal bounds. "
            f"I recommend enabling rate limiting on the auth endpoint and reviewing access logs."
        )
        suggestions = ["Enable IP-based rate limiting", "Set up fail2ban", "Review auth logs for patterns"]
        sources = ["Security Logs", "Auth Analytics", "Threat Intelligence"]
    elif any(w in q for w in ["user", "users", "activity", "traffic"]):
        response = (
            f"User activity analysis: {len(_users_db)} registered users, with peak activity between 9-11 AM UTC. "
            f"Active sessions are trending up 8.2% week-over-week. "
            f"User retention rate is strong at approximately 73%."
        )
        suggestions = ["Send re-engagement emails to inactive users", "Optimize onboarding flow", "A/B test landing page"]
        sources = ["User Analytics", "Session Data", "Retention Metrics"]
    elif any(w in q for w in ["cost", "money", "saving", "resource"]):
        response = (
            f"Cost analysis identifies $480/month in potential savings from right-sizing compute resources. "
            f"Your current infrastructure utilization is at 62% average. "
            f"Switching to reserved instances for baseline load could save an additional 30%."
        )
        suggestions = ["Right-size underutilized instances", "Switch to reserved pricing", "Enable auto-scaling policies"]
        sources = ["Cost Analytics", "Resource Utilization", "Cloud Pricing Data"]
    else:
        response = (
            f"I've analyzed your query: '{req.query}'. "
            f"Based on current dashboard data, your system is operating within normal parameters. "
            f"Key metrics: {len(_users_db)} users, 99.9% uptime, average response time 120ms. "
            f"No critical issues detected at this time."
        )
        suggestions = ["Review AI insights panel for latest alerts", "Check analytics for trends", "Monitor system metrics"]
        sources = ["Dashboard Analytics", "System Metrics", "User Behavior"]

    return AIQueryResponse(
        query=req.query,
        response=response,
        confidence=round(random.uniform(0.82, 0.98), 2),
        timestamp=datetime.now(),
        sources=sources,
        suggestions=suggestions,
    )


@app.get("/api/ai/recommendations", tags=["ai"])
async def get_recommendations(current_user: User = Depends(get_current_user)):
    return {
        "recommendations": [
            {"id": "1", "title": "Scale Database", "description": "Current load suggests scaling needed",
             "priority": "high", "estimated_impact": "30% performance improvement"},
            {"id": "2", "title": "Enable Redis Caching", "description": "Implement caching for hot data",
             "priority": "medium", "estimated_impact": "50% reduction in response time"},
            {"id": "3", "title": "Optimize Images", "description": "Serve WebP format for 40% size reduction",
             "priority": "low", "estimated_impact": "Faster page loads"},
        ]
    }


# ── Users ─────────────────────────────────────────────────────────────────────
@app.get("/api/users", response_model=List[User], tags=["users"])
async def get_users(current_user: User = Depends(get_current_user)):
    return [User(**u.model_dump(exclude={"hashed_password"})) for u in _users_db.values()]


@app.get("/api/users/{user_id}", response_model=User, tags=["users"])
async def get_user(user_id: int, current_user: User = Depends(get_current_user)):
    user = next((u for u in _users_db.values() if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user.model_dump(exclude={"hashed_password"}))


@app.put("/api/users/{user_id}", response_model=User, tags=["users"])
async def update_user(user_id: int, data: dict, current_user: User = Depends(get_current_user)):
    user = next((u for u in _users_db.values() if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Only allow safe fields
    safe_fields = {"full_name", "email", "is_active"}
    for k, v in data.items():
        if k in safe_fields:
            setattr(user, k, v)
    return User(**user.model_dump(exclude={"hashed_password"}))


@app.delete("/api/users/{user_id}", tags=["users"])
async def delete_user(user_id: int, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    key = next((k for k, u in _users_db.items() if u.id == user_id), None)
    if not key:
        raise HTTPException(status_code=404, detail="User not found")
    del _users_db[key]
    return {"message": "User deleted"}


# ── WebSocket ─────────────────────────────────────────────────────────────────
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send welcome
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "timestamp": datetime.now().isoformat(),
        })
        while True:
            await asyncio.sleep(5)
            await websocket.send_json({
                "type": "stats_update",
                "data": {
                    "active_users": random.randint(50, 200),
                    "requests_per_second": random.randint(10, 100),
                    "cpu_usage": round(random.uniform(20, 80), 1),
                    "memory_usage": round(random.uniform(40, 70), 1),
                    "timestamp": datetime.now().isoformat(),
                },
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WS error: {e}")
        manager.disconnect(websocket)


# ── Exception handler ─────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(status_code=500, content={"message": "Internal server error"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
