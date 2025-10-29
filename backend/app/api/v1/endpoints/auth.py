from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_async_db
from app.schemas.auth import UserSignup, UserLogin, AuthResponse, UserResponse
from app.services.auth import AuthService

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    signup_data: UserSignup,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Create a new user account

    - **email**: Valid email address
    - **username**: Username (3-30 characters, alphanumeric with _ and -)
    - **password**: Password (minimum 8 characters)
    - **confirm_password**: Must match password
    """
    try:
        # Create user
        user = await AuthService.create_user(db, signup_data)

        # Return response
        return AuthResponse(
            user=UserResponse.model_validate(user),
            message="Account created successfully! You can now log in.",
            token=None  # Can add JWT token here later
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {str(e)}"
        )


@router.post("/login", response_model=AuthResponse)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Login to an existing account

    - **email**: User email address
    - **password**: User password
    """
    try:
        # Authenticate user
        user = await AuthService.authenticate_user(db, login_data)

        # Return response
        return AuthResponse(
            user=UserResponse.model_validate(user),
            message="Login successful!",
            token=None  # Can add JWT token here later
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/health")
async def auth_health():
    """Health check endpoint for authentication service"""
    return {"status": "healthy", "service": "auth"}
