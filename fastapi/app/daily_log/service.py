"""
ⒸAngelaMos | 2026
service.py
"""

from collections.abc import Sequence
from datetime import date
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from core.exceptions import DailyLogNotFound, DailyLogAlreadyExists, PartnerNotFound
from partner.repository import PartnerRepository
from .DailyLog import DailyLog
from .repository import DailyLogRepository
from .schemas import DailyLogCreate, DailyLogResponse, DailyLogUpdate


class DailyLogService:
    """
    Business logic for daily log operations
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def _get_partner_id(self, user_id: UUID) -> UUID:
        """
        Get partner ID for user, raise if not found
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))
        return partner.id

    async def create_daily_log(
        self,
        user_id: UUID,
        data: DailyLogCreate,
    ) -> DailyLogResponse:
        """
        Create a new daily log entry
        """
        partner_id = await self._get_partner_id(user_id)

        existing = await DailyLogRepository.get_by_partner_and_date(
            self.session,
            partner_id,
            data.log_date,
        )
        if existing:
            raise DailyLogAlreadyExists(str(data.log_date))

        daily_log = await DailyLogRepository.create(
            self.session,
            partner_id = partner_id,
            log_date = data.log_date,
            mood = data.mood,
            energy_level = data.energy_level,
            symptoms = data.symptoms,
            notes = data.notes,
        )
        return DailyLogResponse.model_validate(daily_log)

    async def get_daily_logs(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 30,
    ) -> Sequence[DailyLogResponse]:
        """
        Get daily logs for user's partner
        """
        partner_id = await self._get_partner_id(user_id)

        logs = await DailyLogRepository.get_by_partner_id(
            self.session,
            partner_id,
            skip = skip,
            limit = limit,
        )
        return [DailyLogResponse.model_validate(log) for log in logs]

    async def get_daily_log_by_date(
        self,
        user_id: UUID,
        log_date: date,
    ) -> DailyLogResponse:
        """
        Get daily log for a specific date
        """
        partner_id = await self._get_partner_id(user_id)

        log = await DailyLogRepository.get_by_partner_and_date(
            self.session,
            partner_id,
            log_date,
        )
        if not log:
            raise DailyLogNotFound(str(log_date))

        return DailyLogResponse.model_validate(log)

    async def get_date_range(
        self,
        user_id: UUID,
        start_date: date,
        end_date: date,
    ) -> Sequence[DailyLogResponse]:
        """
        Get daily logs within a date range
        """
        partner_id = await self._get_partner_id(user_id)

        logs = await DailyLogRepository.get_date_range(
            self.session,
            partner_id,
            start_date,
            end_date,
        )
        return [DailyLogResponse.model_validate(log) for log in logs]

    async def update_daily_log(
        self,
        user_id: UUID,
        log_date: date,
        data: DailyLogUpdate,
    ) -> DailyLogResponse:
        """
        Update a daily log entry by date
        """
        partner_id = await self._get_partner_id(user_id)

        log = await DailyLogRepository.get_by_partner_and_date(
            self.session,
            partner_id,
            log_date,
        )
        if not log:
            raise DailyLogNotFound(str(log_date))

        update_dict = data.model_dump(exclude_unset = True)
        updated = await DailyLogRepository.update(
            self.session,
            log,
            **update_dict,
        )
        return DailyLogResponse.model_validate(updated)

    async def delete_daily_log(
        self,
        user_id: UUID,
        log_date: date,
    ) -> None:
        """
        Delete a daily log entry by date
        """
        partner_id = await self._get_partner_id(user_id)

        log = await DailyLogRepository.get_by_partner_and_date(
            self.session,
            partner_id,
            log_date,
        )
        if not log:
            raise DailyLogNotFound(str(log_date))

        await DailyLogRepository.delete(self.session, log)
