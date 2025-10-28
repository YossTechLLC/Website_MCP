"""
Pydantic Schemas for Channel Registration
"""
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class ChannelRegistrationBase(BaseModel):
    """Base schema for channel registration"""
    open_channel_id: str = Field(..., min_length=5, max_length=50, description="Open channel Telegram ID")
    open_channel_title: str = Field(..., min_length=1, max_length=200, description="Open channel title")
    open_channel_description: str = Field(..., min_length=1, max_length=1000, description="Open channel description")

    closed_channel_id: str = Field(..., min_length=5, max_length=50, description="Closed channel Telegram ID")
    closed_channel_title: str = Field(..., min_length=1, max_length=200, description="Closed channel title")
    closed_channel_description: str = Field(..., min_length=1, max_length=1000, description="Closed channel description")

    # Subscription tiers
    sub_1_price: Optional[float] = Field(None, ge=0.01, description="Tier 1 price in USD")
    sub_1_time: Optional[int] = Field(None, ge=1, description="Tier 1 duration in days")
    sub_2_price: Optional[float] = Field(None, ge=0.01, description="Tier 2 price in USD")
    sub_2_time: Optional[int] = Field(None, ge=1, description="Tier 2 duration in days")
    sub_3_price: Optional[float] = Field(None, ge=0.01, description="Tier 3 price in USD")
    sub_3_time: Optional[int] = Field(None, ge=1, description="Tier 3 duration in days")

    # Payment info
    client_wallet_address: str = Field(..., min_length=10, max_length=110, description="Wallet address")
    client_payout_currency: str = Field(..., min_length=2, max_length=10, description="Currency code")
    client_payout_network: str = Field(..., min_length=2, max_length=20, description="Network code")

    @validator('open_channel_id', 'closed_channel_id')
    def validate_channel_id(cls, v):
        """Validate channel ID format"""
        if not v.startswith('-'):
            raise ValueError('Channel ID must start with "-"')
        if not v[1:].isdigit():
            raise ValueError('Channel ID must contain only digits after "-"')
        return v

    @validator('client_payout_currency', 'client_payout_network')
    def to_uppercase(cls, v):
        """Convert to uppercase"""
        return v.upper()


class ChannelRegistrationCreate(ChannelRegistrationBase):
    """Schema for creating a channel registration"""
    captcha_token: str = Field(..., description="reCAPTCHA token")


class ChannelRegistrationResponse(BaseModel):
    """Schema for channel registration response"""
    id: int
    open_channel_id: str
    open_channel_title: str
    closed_channel_id: str
    closed_channel_title: str
    created_at: datetime
    is_active: bool
    verified: bool

    class Config:
        from_attributes = True


class NetworkCurrencyMappingSchema(BaseModel):
    """Schema for network-currency mapping"""
    network_code: str
    network_name: str
    currency_code: str
    currency_name: str

    class Config:
        from_attributes = True


class HealthCheckResponse(BaseModel):
    """Health check response schema"""
    status: str
    service: str
    version: str
    database: Optional[str] = None
