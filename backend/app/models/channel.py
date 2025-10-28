"""
Database Models for Channel Registration
"""
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class ChannelRegistration(Base):
    """Channel registration model"""

    __tablename__ = "channel_registrations"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Open Channel (Public)
    open_channel_id = Column(String(50), unique=True, nullable=False, index=True)
    open_channel_title = Column(String(200), nullable=False)
    open_channel_description = Column(String(1000), nullable=False)

    # Closed Channel (Premium)
    closed_channel_id = Column(String(50), unique=True, nullable=False, index=True)
    closed_channel_title = Column(String(200), nullable=False)
    closed_channel_description = Column(String(1000), nullable=False)

    # Subscription Tiers
    sub_1_price = Column(Float, nullable=True)  # Tier 1 (Gold)
    sub_1_time = Column(Integer, nullable=True)  # Days
    sub_2_price = Column(Float, nullable=True)  # Tier 2 (Silver)
    sub_2_time = Column(Integer, nullable=True)  # Days
    sub_3_price = Column(Float, nullable=True)  # Tier 3 (Bronze)
    sub_3_time = Column(Integer, nullable=True)  # Days

    # Payment Information
    client_wallet_address = Column(String(110), nullable=False)
    client_payout_currency = Column(String(10), nullable=False)
    client_payout_network = Column(String(20), nullable=False)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True, nullable=False)

    # Admin fields
    verified = Column(Boolean, default=False, nullable=False)
    verification_notes = Column(String(500), nullable=True)

    def __repr__(self):
        return f"<ChannelRegistration(id={self.id}, open_channel_id='{self.open_channel_id}')>"


class NetworkCurrencyMapping(Base):
    """Network to currency mappings"""

    __tablename__ = "network_currency_mappings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    network_code = Column(String(20), nullable=False, index=True)
    network_name = Column(String(50), nullable=False)
    currency_code = Column(String(10), nullable=False, index=True)
    currency_name = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    def __repr__(self):
        return f"<NetworkCurrencyMapping(network={self.network_code}, currency={self.currency_code})>"
