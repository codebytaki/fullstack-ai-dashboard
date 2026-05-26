"""Authentication endpoints"""
from fastapi import APIRouter, HTTPException, status
from app.schemas import LoginRequest, LoginResponse, UserCreate, User
from app.core import create_access_token, create_refresh_token, verify_password, get_password_hash
from datetime import datetime

router = APIRouter()

# Mock user database (replace with real database)
# Password hash will be generated on first access
fake_users_db = {}


def _get_admin_user():
    """Lazy load admin user with hashed password"""
    if "admin" not in fake_users_db:
        fake_users_db["admin"] = {
            "id": 1,
            "username": "admin",
            "email": "admin@example.com",
            "full_name": "Admin User",
            "hashed_password": get_password_hash("admin"),
            "is_active": True,
            "role": "admin",
            "created_at": datetime.now()
        }
    return fake_users_db["admin"]


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """User login endpoint"""
    # Initialize admin user if needed
    _get_admin_user()
    
    user = fake_users_db.get(request.username)
    
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["username"], "user_id": user["id"]})
    refresh_token = create_refresh_token(data={"sub": user["username"], "user_id": user["id"]})
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=User(**user)
    )


@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    """User registration endpoint"""
    # Check if user exists
    if user_data.username in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Create new user
    new_user = {
        "id": len(fake_users_db) + 1,
        "username": user_data.username,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": get_password_hash(user_data.password),
        "is_active": True,
        "role": "user",
        "created_at": datetime.now()
    }
    
    fake_users_db[user_data.username] = new_user
    
    return User(**new_user)


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token"""
    # Implement token refresh logic
    return {"access_token": "new-token", "token_type": "bearer"}


@router.post("/logout")
async def logout():
    """User logout endpoint"""
    return {"message": "Successfully logged out"}
