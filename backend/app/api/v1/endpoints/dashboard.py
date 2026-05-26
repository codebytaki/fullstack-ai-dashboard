"""Dashboard endpoints"""
from fastapi import APIRouter
from app.schemas import DashboardStats, AnalyticsData, SystemMetrics
from typing import List
from datetime import datetime, timedelta
import random

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get dashboard statistics"""
    return DashboardStats(
        total_users=random.randint(1000, 5000),
        active_sessions=random.randint(50, 200),
        total_requests=random.randint(10000, 50000),
        ai_queries=random.randint(500, 2000),
        uptime="99.9%",
        cpu_usage=random.uniform(20, 80),
        memory_usage=random.uniform(40, 70),
        response_time=random.uniform(50, 200),
        error_rate=random.uniform(0.1, 2.0)
    )


@router.get("/analytics", response_model=List[AnalyticsData])
async def get_analytics():
    """Get analytics data for charts"""
    data = []
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(30):
        date = base_date + timedelta(days=i)
        data.append(AnalyticsData(
            date=date.strftime("%Y-%m-%d"),
            users=random.randint(100, 500),
            requests=random.randint(1000, 5000),
            ai_queries=random.randint(50, 200),
            revenue=random.uniform(1000, 5000),
            conversion_rate=random.uniform(2, 8)
        ))
    
    return data


@router.get("/metrics", response_model=SystemMetrics)
async def get_system_metrics():
    """Get system metrics"""
    return SystemMetrics(
        cpu={
            "usage": random.uniform(20, 80),
            "cores": 8,
            "temperature": random.uniform(40, 70)
        },
        memory={
            "used": random.uniform(4, 12),
            "total": 16,
            "percentage": random.uniform(30, 75)
        },
        disk={
            "used": random.uniform(100, 400),
            "total": 500,
            "percentage": random.uniform(20, 80)
        },
        network={
            "upload": random.uniform(1, 10),
            "download": random.uniform(5, 50)
        },
        timestamp=datetime.now()
    )
