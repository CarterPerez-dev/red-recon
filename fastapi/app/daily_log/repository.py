"""
ⒸAngelaMos | 2026
repository.py
"""

from collections.abc import Sequence
from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.base_repository import BaseRepository
from .DailyLog import DailyLog


class DailyLogRepository(BaseRepository[DailyLog]):
    """
    Database operations for DailyLog model
    """
    model = DailyLog

    @classmethod
    async def get_by_partner_id(
        cls,
        session: AsyncSession,
        partner_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[DailyLog]:
        """
        Get daily logs for a partner, ordered by log_date descending
        """
        result = await session.execute(
            select(DailyLog)
            .where(DailyLog.partner_id == partner_id)
            .order_by(DailyLog.log_date.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_by_partner_and_date(
        cls,
        session: AsyncSession,
        partner_id: UUID,
        log_date: date,
    ) -> DailyLog | None:
        """
        Get daily log by partner and date (unique constraint)
        """
        result = await session.execute(
            select(DailyLog)
            .where(
                DailyLog.partner_id == partner_id,
                DailyLog.log_date == log_date,
            )
        )
        return result.scalars().first()

    @classmethod
    async def get_date_range(
        cls,
        session: AsyncSession,
        partner_id: UUID,
        start_date: date,
        end_date: date,
    ) -> Sequence[DailyLog]:
        """
        Get daily logs within a date range
        """
        result = await session.execute(
            select(DailyLog)
            .where(
                DailyLog.partner_id == partner_id,
                DailyLog.log_date >= start_date,
                DailyLog.log_date <= end_date,
            )
            .order_by(DailyLog.log_date.desc())
        )
        return result.scalars().all()
