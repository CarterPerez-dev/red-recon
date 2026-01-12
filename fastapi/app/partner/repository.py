"""
ⒸAngelaMos | 2026
repository.py
"""

from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.base_repository import BaseRepository
from .Partner import Partner


class PartnerRepository(BaseRepository[Partner]):
    """
    Database operations for Partner model
    """
    model = Partner

    @classmethod
    async def get_by_user_id(
        cls,
        session: AsyncSession,
        user_id: UUID,
    ) -> Partner | None:
        """
        Get partner by user ID (one partner per user)
        """
        result = await session.execute(
            select(Partner).where(Partner.user_id == user_id)
        )
        return result.scalars().first()

    @classmethod
    async def exists_for_user(
        cls,
        session: AsyncSession,
        user_id: UUID,
    ) -> bool:
        """
        Check if partner exists for user
        """
        result = await session.execute(
            select(Partner.id).where(Partner.user_id == user_id)
        )
        return result.scalars().first() is not None

    @classmethod
    async def update_last_period(
        cls,
        session: AsyncSession,
        partner: Partner,
        last_period_start: date,
    ) -> Partner:
        """
        Update last period start date
        """
        partner.last_period_start = last_period_start
        await session.flush()
        await session.refresh(partner)
        return partner
