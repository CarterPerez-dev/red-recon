"""
ⒸAngelaMos | 2026
service.py
"""

from collections.abc import Sequence
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from core.exceptions import PeriodLogNotFound, PeriodLogAlreadyExists, PartnerNotFound
from partner.repository import PartnerRepository
from .PeriodLog import PeriodLog
from .repository import PeriodLogRepository
from .schemas import PeriodLogCreate, PeriodLogResponse, PeriodLogUpdate


class PeriodLogService:
    """
    Business logic for period log operations
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

    async def create_period_log(
        self,
        user_id: UUID,
        data: PeriodLogCreate,
    ) -> PeriodLogResponse:
        """
        Create a new period log entry
        """
        partner_id = await self._get_partner_id(user_id)

        existing = await PeriodLogRepository.get_by_partner_and_date(
            self.session,
            partner_id,
            data.start_date,
        )
        if existing:
            raise PeriodLogAlreadyExists(str(data.start_date))

        previous_log = await PeriodLogRepository.get_latest_for_partner(
            self.session,
            partner_id,
        )
        cycle_length = None
        if previous_log and not previous_log.is_predicted:
            days_diff = (data.start_date - previous_log.start_date).days
            if 21 <= days_diff <= 45:
                cycle_length = days_diff

        await PeriodLogRepository.delete_predicted_after_date(
            self.session,
            partner_id,
            data.start_date,
        )

        period_log = await PeriodLogRepository.create(
            self.session,
            partner_id = partner_id,
            start_date = data.start_date,
            end_date = data.end_date,
            flow_intensity = data.flow_intensity,
            notes = data.notes,
            cycle_length = cycle_length,
            is_predicted = False,
        )

        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if partner:
            await PartnerRepository.update_last_period(
                self.session,
                partner,
                data.start_date,
            )

        return PeriodLogResponse.model_validate(period_log)

    async def get_period_logs(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 20,
    ) -> Sequence[PeriodLogResponse]:
        """
        Get period logs for user's partner
        """
        partner_id = await self._get_partner_id(user_id)

        logs = await PeriodLogRepository.get_by_partner_id(
            self.session,
            partner_id,
            skip = skip,
            limit = limit,
        )
        return [PeriodLogResponse.model_validate(log) for log in logs]

    async def get_period_log(
        self,
        user_id: UUID,
        log_id: UUID,
    ) -> PeriodLogResponse:
        """
        Get a specific period log by ID
        """
        partner_id = await self._get_partner_id(user_id)

        log = await PeriodLogRepository.get_by_id(self.session, log_id)
        if not log or log.partner_id != partner_id:
            raise PeriodLogNotFound(str(log_id))

        return PeriodLogResponse.model_validate(log)

    async def update_period_log(
        self,
        user_id: UUID,
        log_id: UUID,
        data: PeriodLogUpdate,
    ) -> PeriodLogResponse:
        """
        Update a period log entry
        """
        partner_id = await self._get_partner_id(user_id)

        log = await PeriodLogRepository.get_by_id(self.session, log_id)
        if not log or log.partner_id != partner_id:
            raise PeriodLogNotFound(str(log_id))

        update_dict = data.model_dump(exclude_unset = True)
        updated = await PeriodLogRepository.update(
            self.session,
            log,
            **update_dict,
        )
        return PeriodLogResponse.model_validate(updated)

    async def delete_period_log(
        self,
        user_id: UUID,
        log_id: UUID,
    ) -> None:
        """
        Delete a period log entry
        """
        partner_id = await self._get_partner_id(user_id)

        log = await PeriodLogRepository.get_by_id(self.session, log_id)
        if not log or log.partner_id != partner_id:
            raise PeriodLogNotFound(str(log_id))

        await PeriodLogRepository.delete(self.session, log)
