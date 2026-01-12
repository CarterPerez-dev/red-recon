"""
ⒸAngelaMos | 2026
schemas.py
"""

from datetime import date

from pydantic import Field

from core.base_schema import BaseSchema, BaseResponseSchema
from core.enums import CycleRegularity


PARTNER_NAME_MAX_LENGTH = 50
CYCLE_LENGTH_MIN = 21
CYCLE_LENGTH_MAX = 35
PERIOD_LENGTH_MIN = 3
PERIOD_LENGTH_MAX = 7
REMINDER_DAYS_MIN = 1
REMINDER_DAYS_MAX = 7
TIMEZONE_MAX_LENGTH = 50


class PartnerCreate(BaseSchema):
    """
    Schema for creating a partner profile
    """
    name: str = Field(max_length = PARTNER_NAME_MAX_LENGTH)
    average_cycle_length: int = Field(
        default = 28,
        ge = CYCLE_LENGTH_MIN,
        le = CYCLE_LENGTH_MAX,
    )
    average_period_length: int = Field(
        default = 5,
        ge = PERIOD_LENGTH_MIN,
        le = PERIOD_LENGTH_MAX,
    )
    cycle_regularity: CycleRegularity = CycleRegularity.REGULAR
    last_period_start: date | None = None
    notification_period_reminder: bool = True
    notification_pms_alert: bool = True
    notification_ovulation_alert: bool = False
    reminder_days_before: int = Field(
        default = 3,
        ge = REMINDER_DAYS_MIN,
        le = REMINDER_DAYS_MAX,
    )
    timezone: str = Field(
        default = "UTC",
        max_length = TIMEZONE_MAX_LENGTH,
    )


class PartnerUpdate(BaseSchema):
    """
    Schema for updating partner profile
    """
    name: str | None = Field(
        default = None,
        max_length = PARTNER_NAME_MAX_LENGTH,
    )
    average_cycle_length: int | None = Field(
        default = None,
        ge = CYCLE_LENGTH_MIN,
        le = CYCLE_LENGTH_MAX,
    )
    average_period_length: int | None = Field(
        default = None,
        ge = PERIOD_LENGTH_MIN,
        le = PERIOD_LENGTH_MAX,
    )
    cycle_regularity: CycleRegularity | None = None
    last_period_start: date | None = None
    notification_period_reminder: bool | None = None
    notification_pms_alert: bool | None = None
    notification_ovulation_alert: bool | None = None
    reminder_days_before: int | None = Field(
        default = None,
        ge = REMINDER_DAYS_MIN,
        le = REMINDER_DAYS_MAX,
    )
    timezone: str | None = Field(
        default = None,
        max_length = TIMEZONE_MAX_LENGTH,
    )


class PartnerResponse(BaseResponseSchema):
    """
    Schema for partner API responses
    """
    name: str
    average_cycle_length: int
    average_period_length: int
    cycle_regularity: CycleRegularity
    last_period_start: date | None
    notification_period_reminder: bool
    notification_pms_alert: bool
    notification_ovulation_alert: bool
    reminder_days_before: int
    timezone: str
