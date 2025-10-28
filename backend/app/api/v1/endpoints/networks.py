"""
Networks and Currencies API Endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_async_db
from app.models.channel import NetworkCurrencyMapping
from app.schemas.channel import NetworkCurrencyMappingSchema
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


# Hardcoded network-currency mappings for now
# In production, this would come from database
NETWORK_CURRENCY_MAPPINGS = [
    # Bitcoin
    {"network_code": "BTC", "network_name": "Bitcoin", "currency_code": "BTC", "currency_name": "Bitcoin"},

    # Ethereum
    {"network_code": "ETH", "network_name": "Ethereum", "currency_code": "ETH", "currency_name": "Ethereum"},
    {"network_code": "ETH", "network_name": "Ethereum", "currency_code": "USDT", "currency_name": "Tether USD"},
    {"network_code": "ETH", "network_name": "Ethereum", "currency_code": "USDC", "currency_name": "USD Coin"},
    {"network_code": "ETH", "network_name": "Ethereum", "currency_code": "DAI", "currency_name": "Dai Stablecoin"},

    # Binance Smart Chain (BSC)
    {"network_code": "BSC", "network_name": "Binance Smart Chain", "currency_code": "BNB", "currency_name": "BNB"},
    {"network_code": "BSC", "network_name": "Binance Smart Chain", "currency_code": "USDT", "currency_name": "Tether USD"},
    {"network_code": "BSC", "network_name": "Binance Smart Chain", "currency_code": "USDC", "currency_name": "USD Coin"},
    {"network_code": "BSC", "network_name": "Binance Smart Chain", "currency_code": "BUSD", "currency_name": "Binance USD"},

    # Polygon
    {"network_code": "POLYGON", "network_name": "Polygon", "currency_code": "MATIC", "currency_name": "Polygon"},
    {"network_code": "POLYGON", "network_name": "Polygon", "currency_code": "USDT", "currency_name": "Tether USD"},
    {"network_code": "POLYGON", "network_name": "Polygon", "currency_code": "USDC", "currency_name": "USD Coin"},

    # Arbitrum
    {"network_code": "ARBITRUM", "network_name": "Arbitrum", "currency_code": "ETH", "currency_name": "Ethereum"},
    {"network_code": "ARBITRUM", "network_name": "Arbitrum", "currency_code": "USDT", "currency_name": "Tether USD"},
    {"network_code": "ARBITRUM", "network_name": "Arbitrum", "currency_code": "USDC", "currency_name": "USD Coin"},

    # Optimism
    {"network_code": "OPTIMISM", "network_name": "Optimism", "currency_code": "ETH", "currency_name": "Ethereum"},
    {"network_code": "OPTIMISM", "network_name": "Optimism", "currency_code": "USDT", "currency_name": "Tether USD"},
    {"network_code": "OPTIMISM", "network_name": "Optimism", "currency_code": "USDC", "currency_name": "USD Coin"},

    # Avalanche
    {"network_code": "AVALANCHE", "network_name": "Avalanche C-Chain", "currency_code": "AVAX", "currency_name": "Avalanche"},
    {"network_code": "AVALANCHE", "network_name": "Avalanche C-Chain", "currency_code": "USDT", "currency_name": "Tether USD"},
    {"network_code": "AVALANCHE", "network_name": "Avalanche C-Chain", "currency_code": "USDC", "currency_name": "USD Coin"},

    # Base
    {"network_code": "BASE", "network_name": "Base", "currency_code": "ETH", "currency_name": "Ethereum"},
    {"network_code": "BASE", "network_name": "Base", "currency_code": "USDC", "currency_name": "USD Coin"},

    # Linea
    {"network_code": "LINEA", "network_name": "Linea", "currency_code": "ETH", "currency_name": "Ethereum"},
    {"network_code": "LINEA", "network_name": "Linea", "currency_code": "USDC", "currency_name": "USD Coin"},

    # Solana
    {"network_code": "SOL", "network_name": "Solana", "currency_code": "SOL", "currency_name": "Solana"},
    {"network_code": "SOL", "network_name": "Solana", "currency_code": "USDT", "currency_name": "Tether USD"},
    {"network_code": "SOL", "network_name": "Solana", "currency_code": "USDC", "currency_name": "USD Coin"},

    # Tron
    {"network_code": "TRX", "network_name": "Tron", "currency_code": "TRX", "currency_name": "Tron"},
    {"network_code": "TRX", "network_name": "Tron", "currency_code": "USDT", "currency_name": "Tether USD"},
    {"network_code": "TRX", "network_name": "Tron", "currency_code": "USDC", "currency_name": "USD Coin"},

    # TON
    {"network_code": "TON", "network_name": "The Open Network", "currency_code": "TON", "currency_name": "Toncoin"},
    {"network_code": "TON", "network_name": "The Open Network", "currency_code": "USDT", "currency_name": "Tether USD"},
]


@router.get("/mappings", response_model=List[NetworkCurrencyMappingSchema])
async def get_network_currency_mappings():
    """
    Get all network-currency mappings for dynamic form filtering
    Returns bidirectional mappings between networks and supported currencies
    """
    logger.info("Fetching network-currency mappings")
    return NETWORK_CURRENCY_MAPPINGS


@router.get("/list")
async def get_networks_list():
    """Get list of all supported networks"""
    networks = {}
    for mapping in NETWORK_CURRENCY_MAPPINGS:
        code = mapping["network_code"]
        if code not in networks:
            networks[code] = mapping["network_name"]

    return {
        "success": True,
        "data": [{"code": k, "name": v} for k, v in networks.items()]
    }


@router.get("/currencies")
async def get_currencies_list():
    """Get list of all supported currencies"""
    currencies = {}
    for mapping in NETWORK_CURRENCY_MAPPINGS:
        code = mapping["currency_code"]
        if code not in currencies:
            currencies[code] = mapping["currency_name"]

    return {
        "success": True,
        "data": [{"code": k, "name": v} for k, v in currencies.items()]
    }


@router.get("/health")
async def networks_health():
    """Health check for networks endpoint"""
    return {"status": "healthy", "endpoint": "networks"}
