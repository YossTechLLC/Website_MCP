from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
import re


class UserSignup(BaseModel):
    """User signup request schema"""
    email: EmailStr = Field(..., description="User email address")
    username: str = Field(..., min_length=3, max_length=30, description="Username (3-30 characters)")
    password: str = Field(..., min_length=8, max_length=100, description="Password (min 8 characters)")
    confirm_password: str = Field(..., description="Password confirmation")

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        """Validate username format"""
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v.lower()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength (basic)"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

    def model_post_init(self, __context) -> None:
        """Validate password confirmation"""
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')


class UserLogin(BaseModel):
    """User login request schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    username: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Authentication response schema"""
    user: UserResponse
    message: str
    token: str | None = None  # Optional for now, can add JWT later
