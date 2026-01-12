"""
ⒸAngelaMos | 2026
schemas.py
"""

from datetime import date

from pydantic import Field

from core.base_schema import BaseSchema, BaseResponseSchema
from core.enums import Mood


NOTES_MAX_LENGTH = 500
ENERGY_MIN = 1
ENERGY_MAX = 5

VALID_SYMPTOMS = [
    "cramps",
    "headache",
    "tired",
    "moody",
    "cravings",
    "bloated",
    "backache",
    "anxious",
    "nausea",
    "insomnia",
]


class DailyLogCreate(BaseSchema):
    """
    Schema for creating a daily log entry
    """
    log_date: date
    mood: Mood | None = None
    energy_level: int | None = Field(
        default = None,
        ge = ENERGY_MIN,
        le = ENERGY_MAX,
    )
    symptoms: list[str] = Field(default_factory = list)
    notes: str | None = Field(default = None, max_length = NOTES_MAX_LENGTH)


class DailyLogUpdate(BaseSchema):
    """
    Schema for updating a daily log entry
    """
    mood: Mood | None = None
    energy_level: int | None = Field(
        default = None,
        ge = ENERGY_MIN,
        le = ENERGY_MAX,
    )
    symptoms: list[str] | None = None
    notes: str | None = Field(default = None, max_length = NOTES_MAX_LENGTH)


class DailyLogResponse(BaseResponseSchema):
    """
    Schema for daily log API responses
    """
    partner_id: str
    log_date: date
    mood: Mood | None
    energy_level: int | None
    symptoms: list[str]
    notes: str | None
