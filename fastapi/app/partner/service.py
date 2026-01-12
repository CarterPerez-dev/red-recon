"""
ⒸAngelaMos | 2026
service.py
"""

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from core.exceptions import PartnerAlreadyExists, PartnerNotFound
from .Partner import Partner
from .repository import PartnerRepository
from .schemas import PartnerCreate, PartnerResponse, PartnerUpdate


class PartnerService:
    """
    Business logic for partner operations
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_partner(
        self,
        user_id: UUID,
        data: PartnerCreate,
    ) -> PartnerResponse:
        """
        Create partner profile for user (enforces one per user)
        """
        if await PartnerRepository.exists_for_user(self.session, user_id):
            raise PartnerAlreadyExists(str(user_id))

        partner = await PartnerRepository.create(
            self.session,
            user_id = user_id,
            name = data.name,
            average_cycle_length = data.average_cycle_length,
            average_period_length = data.average_period_length,
            cycle_regularity = data.cycle_regularity,
            last_period_start = data.last_period_start,
            notification_period_reminder = data.notification_period_reminder,
            notification_pms_alert = data.notification_pms_alert,
            notification_ovulation_alert = data.notification_ovulation_alert,
            reminder_days_before = data.reminder_days_before,
            timezone = data.timezone,
        )
        return PartnerResponse.model_validate(partner)

    async def get_partner(
        self,
        user_id: UUID,
    ) -> PartnerResponse:
        """
        Get partner profile for user
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))
        return PartnerResponse.model_validate(partner)

    async def get_partner_model(
        self,
        user_id: UUID,
    ) -> Partner:
        """
        Get partner model for internal use
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))
        return partner

    async def update_partner(
        self,
        user_id: UUID,
        data: PartnerUpdate,
    ) -> PartnerResponse:
        """
        Update partner profile
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))

        update_dict = data.model_dump(exclude_unset = True)
        updated = await PartnerRepository.update(
            self.session,
            partner,
            **update_dict,
        )
        return PartnerResponse.model_validate(updated)

    async def delete_partner(
        self,
        user_id: UUID,
    ) -> None:
        """
        Delete partner profile
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))

        await PartnerRepository.delete(self.session, partner)

    async def has_partner(
        self,
        user_id: UUID,
    ) -> bool:
        """
        Check if user has a partner profile
        """
        return await PartnerRepository.exists_for_user(self.session, user_id)
