"""
Channel Registration API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_async_db
from app.schemas.channel import ChannelRegistrationCreate, ChannelRegistrationResponse
from app.models.channel import ChannelRegistration
from app.services.validators import CryptoAddressValidator, validate_channel_id, sanitize_input
from app.services.recaptcha import RecaptchaService
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@router.post("/", response_model=ChannelRegistrationResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")  # 5 registrations per hour per IP
async def register_channel(
    request: Request,
    registration_data: ChannelRegistrationCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Register a new Telegram channel for subscription payments

    Rate limited to 5 registrations per hour per IP address
    """
    logger.info(f"Registration attempt from IP: {get_remote_address(request)}")

    # 1. Verify reCAPTCHA
    is_valid, score = await RecaptchaService.verify_token(
        registration_data.captcha_token,
        get_remote_address(request)
    )

    if not is_valid:
        logger.warning(f"reCAPTCHA verification failed. Score: {score}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="reCAPTCHA verification failed. Please try again."
        )

    # 2. Validate channel IDs
    is_valid, error_msg = validate_channel_id(registration_data.open_channel_id)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Open channel: {error_msg}")

    is_valid, error_msg = validate_channel_id(registration_data.closed_channel_id)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Closed channel: {error_msg}")

    # 3. Check if channel already exists
    stmt = select(ChannelRegistration).where(
        (ChannelRegistration.open_channel_id == registration_data.open_channel_id) |
        (ChannelRegistration.closed_channel_id == registration_data.closed_channel_id)
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        logger.warning(f"Duplicate channel registration attempt: {registration_data.open_channel_id}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Channel already registered. Please contact support if you need to update your registration."
        )

    # 4. Validate cryptocurrency address
    is_valid, error_msg = CryptoAddressValidator.validate_address(
        registration_data.client_wallet_address,
        registration_data.client_payout_network
    )

    if not is_valid:
        logger.warning(f"Invalid wallet address: {error_msg}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)

    # 5. Validate tier configuration
    if registration_data.sub_1_price and not registration_data.sub_1_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tier 1 duration is required when price is specified"
        )

    # 6. Sanitize text inputs
    sanitized_data = {
        'open_channel_id': registration_data.open_channel_id,
        'open_channel_title': sanitize_input(registration_data.open_channel_title, 200),
        'open_channel_description': sanitize_input(registration_data.open_channel_description, 1000),
        'closed_channel_id': registration_data.closed_channel_id,
        'closed_channel_title': sanitize_input(registration_data.closed_channel_title, 200),
        'closed_channel_description': sanitize_input(registration_data.closed_channel_description, 1000),
        'sub_1_price': registration_data.sub_1_price,
        'sub_1_time': registration_data.sub_1_time,
        'sub_2_price': registration_data.sub_2_price,
        'sub_2_time': registration_data.sub_2_time,
        'sub_3_price': registration_data.sub_3_price,
        'sub_3_time': registration_data.sub_3_time,
        'client_wallet_address': registration_data.client_wallet_address.strip(),
        'client_payout_currency': registration_data.client_payout_currency.upper(),
        'client_payout_network': registration_data.client_payout_network.upper(),
    }

    # 7. Create database record
    try:
        new_registration = ChannelRegistration(**sanitized_data)
        db.add(new_registration)
        await db.commit()
        await db.refresh(new_registration)

        logger.info(f"Successfully registered channel: {new_registration.open_channel_id}")

        return new_registration

    except Exception as e:
        await db.rollback()
        logger.error(f"Database error during registration: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again later."
        )


@router.get("/health")
async def registration_health():
    """Health check for registration endpoint"""
    return {"status": "healthy", "endpoint": "registration"}
