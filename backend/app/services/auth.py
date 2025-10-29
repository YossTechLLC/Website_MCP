import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.auth import UserSignup, UserLogin
from fastapi import HTTPException, status


class AuthService:
    """Authentication service for user management"""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash"""
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )

    @staticmethod
    async def create_user(db: AsyncSession, signup_data: UserSignup) -> User:
        """Create a new user account"""
        # Check if email already exists
        result = await db.execute(
            select(User).where(User.email == signup_data.email)
        )
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Check if username already exists
        result = await db.execute(
            select(User).where(User.username == signup_data.username.lower())
        )
        existing_username = result.scalar_one_or_none()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        # Create new user
        hashed_password = AuthService.hash_password(signup_data.password)
        new_user = User(
            email=signup_data.email,
            username=signup_data.username.lower(),
            password_hash=hashed_password,
            is_active=True,
            is_verified=False  # Can be set to True for testing
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return new_user

    @staticmethod
    async def authenticate_user(db: AsyncSession, login_data: UserLogin) -> User:
        """Authenticate a user by email and password"""
        # Find user by email
        result = await db.execute(
            select(User).where(User.email == login_data.email)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Verify password
        if not AuthService.verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is disabled"
            )

        return user
