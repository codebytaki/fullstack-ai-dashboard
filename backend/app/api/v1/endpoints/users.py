"""User management endpoints"""
from fastapi import APIRouter, HTTPException, status
from app.schemas import User
from typing import List
from datetime import datetime

router = APIRouter()

# Mock users database
fake_users = [
    {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "full_name": "Admin User",
        "is_active": True,
        "role": "admin",
        "created_at": datetime.now()
    },
    {
        "id": 2,
        "username": "user1",
        "email": "user1@example.com",
        "full_name": "John Doe",
        "is_active": True,
        "role": "user",
        "created_at": datetime.now()
    },
    {
        "id": 3,
        "username": "user2",
        "email": "user2@example.com",
        "full_name": "Jane Smith",
        "is_active": True,
        "role": "user",
        "created_at": datetime.now()
    }
]


@router.get("/", response_model=List[User])
async def get_users():
    """Get list of users"""
    return [User(**user) for user in fake_users]


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int):
    """Get user by ID"""
    user = next((u for u in fake_users if u["id"] == user_id), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return User(**user)


@router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user_data: dict):
    """Update user"""
    user = next((u for u in fake_users if u["id"] == user_id), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user data
    user.update(user_data)
    
    return User(**user)


@router.delete("/{user_id}")
async def delete_user(user_id: int):
    """Delete user"""
    global fake_users
    fake_users = [u for u in fake_users if u["id"] != user_id]
    
    return {"message": "User deleted successfully"}
