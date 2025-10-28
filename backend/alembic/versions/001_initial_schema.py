"""Initial schema

Revision ID: 001
Revises:
Create Date: 2025-10-28

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create channel_registrations table
    op.create_table(
        'channel_registrations',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('open_channel_id', sa.String(length=50), nullable=False),
        sa.Column('open_channel_title', sa.String(length=100), nullable=False),
        sa.Column('open_channel_description', sa.Text(), nullable=False),
        sa.Column('closed_channel_id', sa.String(length=50), nullable=False),
        sa.Column('closed_channel_title', sa.String(length=100), nullable=False),
        sa.Column('closed_channel_description', sa.Text(), nullable=False),
        sa.Column('sub_1_price', sa.Float(), nullable=True),
        sa.Column('sub_1_time', sa.Integer(), nullable=True),
        sa.Column('sub_2_price', sa.Float(), nullable=True),
        sa.Column('sub_2_time', sa.Integer(), nullable=True),
        sa.Column('sub_3_price', sa.Float(), nullable=True),
        sa.Column('sub_3_time', sa.Integer(), nullable=True),
        sa.Column('client_wallet_address', sa.String(length=110), nullable=False),
        sa.Column('client_payout_currency', sa.String(length=10), nullable=False),
        sa.Column('client_payout_network', sa.String(length=20), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('verified', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), onupdate=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes for better query performance
    op.create_index('ix_channel_registrations_id', 'channel_registrations', ['id'])
    op.create_index('ix_channel_registrations_open_channel_id', 'channel_registrations', ['open_channel_id'], unique=True)
    op.create_index('ix_channel_registrations_closed_channel_id', 'channel_registrations', ['closed_channel_id'], unique=True)
    op.create_index('ix_channel_registrations_created_at', 'channel_registrations', ['created_at'])
    op.create_index('ix_channel_registrations_is_active', 'channel_registrations', ['is_active'])

    # Create network_currency_mappings table
    op.create_table(
        'network_currency_mappings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('network_code', sa.String(length=20), nullable=False),
        sa.Column('network_name', sa.String(length=50), nullable=False),
        sa.Column('currency_code', sa.String(length=10), nullable=False),
        sa.Column('currency_name', sa.String(length=50), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('ix_network_currency_mappings_id', 'network_currency_mappings', ['id'])
    op.create_index('ix_network_currency_mappings_network_code', 'network_currency_mappings', ['network_code'])
    op.create_index('ix_network_currency_mappings_currency_code', 'network_currency_mappings', ['currency_code'])

    # Seed network-currency mapping data
    op.execute("""
        INSERT INTO network_currency_mappings (network_code, network_name, currency_code, currency_name) VALUES
        -- Bitcoin
        ('BTC', 'Bitcoin', 'BTC', 'Bitcoin'),

        -- Ethereum and EVM chains
        ('ETH', 'Ethereum', 'ETH', 'Ethereum'),
        ('ETH', 'Ethereum', 'USDT', 'Tether USD'),
        ('ETH', 'Ethereum', 'USDC', 'USD Coin'),

        ('BSC', 'BNB Smart Chain', 'BNB', 'Binance Coin'),
        ('BSC', 'BNB Smart Chain', 'USDT', 'Tether USD'),
        ('BSC', 'BNB Smart Chain', 'BUSD', 'Binance USD'),

        ('POLYGON', 'Polygon', 'MATIC', 'Polygon'),
        ('POLYGON', 'Polygon', 'USDT', 'Tether USD'),
        ('POLYGON', 'Polygon', 'USDC', 'USD Coin'),

        ('ARBITRUM', 'Arbitrum', 'ETH', 'Ethereum'),
        ('ARBITRUM', 'Arbitrum', 'USDT', 'Tether USD'),
        ('ARBITRUM', 'Arbitrum', 'USDC', 'USD Coin'),

        ('OPTIMISM', 'Optimism', 'ETH', 'Ethereum'),
        ('OPTIMISM', 'Optimism', 'USDT', 'Tether USD'),
        ('OPTIMISM', 'Optimism', 'USDC', 'USD Coin'),

        ('AVALANCHE', 'Avalanche', 'AVAX', 'Avalanche'),
        ('AVALANCHE', 'Avalanche', 'USDT', 'Tether USD'),
        ('AVALANCHE', 'Avalanche', 'USDC', 'USD Coin'),

        ('BASE', 'Base', 'ETH', 'Ethereum'),
        ('BASE', 'Base', 'USDC', 'USD Coin'),

        ('LINEA', 'Linea', 'ETH', 'Ethereum'),
        ('LINEA', 'Linea', 'USDT', 'Tether USD'),
        ('LINEA', 'Linea', 'USDC', 'USD Coin'),

        -- Solana
        ('SOLANA', 'Solana', 'SOL', 'Solana'),
        ('SOLANA', 'Solana', 'USDT', 'Tether USD'),
        ('SOLANA', 'Solana', 'USDC', 'USD Coin'),

        -- Tron
        ('TRON', 'Tron', 'TRX', 'Tron'),
        ('TRON', 'Tron', 'USDT', 'Tether USD'),

        -- TON
        ('TON', 'The Open Network', 'TON', 'Toncoin'),
        ('TON', 'The Open Network', 'USDT', 'Tether USD');
    """)


def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_network_currency_mappings_currency_code', table_name='network_currency_mappings')
    op.drop_index('ix_network_currency_mappings_network_code', table_name='network_currency_mappings')
    op.drop_index('ix_network_currency_mappings_id', table_name='network_currency_mappings')
    op.drop_table('network_currency_mappings')

    op.drop_index('ix_channel_registrations_is_active', table_name='channel_registrations')
    op.drop_index('ix_channel_registrations_created_at', table_name='channel_registrations')
    op.drop_index('ix_channel_registrations_closed_channel_id', table_name='channel_registrations')
    op.drop_index('ix_channel_registrations_open_channel_id', table_name='channel_registrations')
    op.drop_index('ix_channel_registrations_id', table_name='channel_registrations')
    op.drop_table('channel_registrations')
