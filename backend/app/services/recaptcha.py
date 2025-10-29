"""
Google reCAPTCHA v3 Integration
"""
from typing import Optional
import httpx
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class RecaptchaService:
    """Service for verifying reCAPTCHA v3 tokens"""

    VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

    @staticmethod
    async def verify_token(token: str, remote_ip: Optional[str] = None) -> tuple[bool, float]:
        """
        Verify reCAPTCHA token with Google
        Returns: (is_valid, score)
        """
        if not settings.RECAPTCHA_SECRET_KEY:
            logger.warning("reCAPTCHA secret key not configured, skipping verification")
            return True, 1.0  # Allow in development

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    RecaptchaService.VERIFY_URL,
                    data={
                        'secret': settings.RECAPTCHA_SECRET_KEY,
                        'response': token,
                        'remoteip': remote_ip
                    },
                    timeout=5.0
                )

                result = response.json()

                if not result.get('success', False):
                    logger.warning(f"reCAPTCHA verification failed: {result.get('error-codes', [])}")
                    return False, 0.0

                score = result.get('score', 0.0)
                logger.info(f"reCAPTCHA verification successful. Score: {score}")

                # Check against threshold
                is_valid = score >= settings.RECAPTCHA_THRESHOLD

                return is_valid, score

        except Exception as e:
            logger.error(f"reCAPTCHA verification error: {e}")
            # In case of error, you might want to fail closed (return False)
            # or fail open (return True) depending on your security requirements
            return False, 0.0  # Fail closed
