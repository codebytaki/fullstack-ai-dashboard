"""Dashboard schemas"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class DashboardStats(BaseModel):
    """Dashboard statistics schema"""
    total_users: int
    active_sessions: int
    total_requests: int
    ai_queries: int
    uptime: str
    cpu_usage: float
    memory_usage: float
    response_time: Optional[float] = 0.0
    error_rate: Optional[float] = 0.0


class AIInsight(BaseModel):
    """AI insight schema"""
    id: str
    title: str
    description: str
    severity: str  # critical, warning, info, success
    timestamp: datetime
    category: str
    action_required: bool = False
    confidence: float = 0.0


class AnalyticsData(BaseModel):
    """Analytics data schema"""
    date: str
    users: int
    requests: int
    ai_queries: int
    revenue: Optional[float] = 0.0
    conversion_rate: Optional[float] = 0.0


class AIQueryRequest(BaseModel):
    """AI query request schema"""
    query: str
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None


class AIQueryResponse(BaseModel):
    """AI query response schema"""
    query: str
    response: str
    confidence: float
    timestamp: datetime
    sources: Optional[List[str]] = []
    suggestions: Optional[List[str]] = []


class SystemMetrics(BaseModel):
    """System metrics schema"""
    cpu: Dict[str, Any]
    memory: Dict[str, Any]
    disk: Dict[str, Any]
    network: Dict[str, Any]
    timestamp: datetime
