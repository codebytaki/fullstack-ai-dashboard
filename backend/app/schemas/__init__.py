"""Schemas module"""
from .user import User, UserCreate, UserUpdate, UserInDB
from .token import Token, TokenData, LoginRequest, LoginResponse
from .dashboard import (
    DashboardStats,
    AIInsight,
    AnalyticsData,
    AIQueryRequest,
    AIQueryResponse,
    SystemMetrics
)

__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    "Token",
    "TokenData",
    "LoginRequest",
    "LoginResponse",
    "DashboardStats",
    "AIInsight",
    "AnalyticsData",
    "AIQueryRequest",
    "AIQueryResponse",
    "SystemMetrics"
]
