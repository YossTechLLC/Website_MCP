"""
API Router - Version 1
Aggregates all API endpoints
"""
from fastapi import APIRouter
from app.api.v1.endpoints import registration, networks, auth

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(registration.router, prefix="/register", tags=["registration"])
api_router.include_router(networks.router, prefix="/networks", tags=["networks"])
