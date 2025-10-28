"""
Cryptocurrency Address Validators
Validates wallet addresses for different blockchain networks
"""
import re
from typing import Optional


class CryptoAddressValidator:
    """Validator for cryptocurrency addresses across different networks"""

    @staticmethod
    def validate_bitcoin(address: str) -> bool:
        """
        Validate Bitcoin address (Legacy, SegWit, Native SegWit/Bech32)
        Formats: 1..., 3..., bc1...
        """
        # Legacy P2PKH (starts with 1)
        legacy_pattern = r'^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$'
        # P2SH (starts with 3)
        p2sh_pattern = r'^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$'
        # Bech32 (starts with bc1)
        bech32_pattern = r'^bc1[a-zA-HJ-NP-Z0-9]{39,87}$'

        return bool(
            re.match(legacy_pattern, address) or
            re.match(p2sh_pattern, address) or
            re.match(bech32_pattern, address)
        )

    @staticmethod
    def validate_ethereum(address: str) -> bool:
        """
        Validate Ethereum address (and EVM-compatible chains)
        Works for: ETH, BSC, Polygon, Arbitrum, Optimism, Avalanche, Base, Linea
        Format: 0x followed by 40 hex characters
        """
        pattern = r'^0x[a-fA-F0-9]{40}$'
        return bool(re.match(pattern, address))

    @staticmethod
    def validate_solana(address: str) -> bool:
        """
        Validate Solana address
        Format: Base58 encoded, 32-44 characters
        """
        # Solana addresses are base58 encoded, typically 32-44 chars
        pattern = r'^[1-9A-HJ-NP-Za-km-z]{32,44}$'
        return bool(re.match(pattern, address))

    @staticmethod
    def validate_tron(address: str) -> bool:
        """
        Validate Tron (TRX) address
        Format: Starts with T, followed by 33 alphanumeric characters
        """
        pattern = r'^T[a-zA-Z0-9]{33}$'
        return bool(re.match(pattern, address))

    @staticmethod
    def validate_ton(address: str) -> bool:
        """
        Validate TON (The Open Network) address
        Formats: Can be user-friendly (EQ...) or raw
        """
        # User-friendly format (base64url)
        friendly_pattern = r'^[EU]Q[a-zA-Z0-9_-]{46}$'
        # Also accept raw format (0:hex)
        raw_pattern = r'^-?[0-9]:[a-fA-F0-9]{64}$'

        return bool(
            re.match(friendly_pattern, address) or
            re.match(raw_pattern, address)
        )

    @staticmethod
    def validate_address(address: str, network: str) -> tuple[bool, Optional[str]]:
        """
        Main validation method - validates address based on network
        Returns: (is_valid, error_message)
        """
        address = address.strip()

        # Network to validator mapping
        validators = {
            'BTC': CryptoAddressValidator.validate_bitcoin,
            'ETH': CryptoAddressValidator.validate_ethereum,
            'BSC': CryptoAddressValidator.validate_ethereum,  # BSC uses Ethereum format
            'POLYGON': CryptoAddressValidator.validate_ethereum,
            'ARBITRUM': CryptoAddressValidator.validate_ethereum,
            'OPTIMISM': CryptoAddressValidator.validate_ethereum,
            'AVALANCHE': CryptoAddressValidator.validate_ethereum,
            'BASE': CryptoAddressValidator.validate_ethereum,
            'LINEA': CryptoAddressValidator.validate_ethereum,
            'SOL': CryptoAddressValidator.validate_solana,
            'TRX': CryptoAddressValidator.validate_tron,
            'TON': CryptoAddressValidator.validate_ton,
        }

        network_upper = network.upper()

        if network_upper not in validators:
            return False, f"Unsupported network: {network}"

        validator = validators[network_upper]

        if not validator(address):
            return False, f"Invalid {network_upper} address format"

        return True, None


def validate_channel_id(channel_id: str) -> tuple[bool, Optional[str]]:
    """
    Validate Telegram channel ID format
    Must start with '-' followed by digits
    """
    if not channel_id.startswith('-'):
        return False, "Channel ID must start with '-'"

    if not channel_id[1:].isdigit():
        return False, "Channel ID must contain only digits after '-'"

    if len(channel_id) < 5 or len(channel_id) > 50:
        return False, "Channel ID must be 5-50 characters"

    return True, None


def sanitize_input(text: str, max_length: int = 1000) -> str:
    """
    Sanitize user input to prevent XSS and injection attacks
    """
    # Remove null bytes
    text = text.replace('\x00', '')

    # Strip leading/trailing whitespace
    text = text.strip()

    # Limit length
    if len(text) > max_length:
        text = text[:max_length]

    # Remove potentially dangerous HTML/script tags (basic)
    dangerous_patterns = [
        r'<script[^>]*>.*?</script>',
        r'<iframe[^>]*>.*?</iframe>',
        r'javascript:',
        r'on\w+\s*=',  # onclick, onload, etc.
    ]

    for pattern in dangerous_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE | re.DOTALL)

    return text
