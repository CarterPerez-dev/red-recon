"""
ⒸAngelaMos | 2026
schemas.py
"""

from datetime import date
from uuid import UUID

from pydantic import Field, model_validator

from core.base_schema import BaseSchema, BaseResponseSchema
from core.enums import FlowIntensity


NOTES_MAX_LENGTH = 500


class PeriodLogCreate(BaseSchema):
    """
    Schema for creating a period log entry
    """
    start_date: date
    end_date: date | None = None
    flow_intensity: FlowIntensity | None = None
    notes: str | None = Field(default = None, max_length = NOTES_MAX_LENGTH)

    @model_validator(mode = "after")
    def validate_dates(self) -> "PeriodLogCreate":
        """
        Ensure end_date is not before start_date
        """
        if self.end_date is not None and self.end_date < self.start_date:
            raise ValueError("end_date cannot be before start_date")
        return self


class PeriodLogUpdate(BaseSchema):
    """
    Schema for updating a period log entry
    """
    end_date: date | None = None
    flow_intensity: FlowIntensity | None = None
    notes: str | None = Field(default = None, max_length = NOTES_MAX_LENGTH)


class PeriodLogResponse(BaseResponseSchema):
    """
    Schema for period log API responses
    """
    partner_id: UUID
    start_date: date
    end_date: date | None
    cycle_length: int | None
    flow_intensity: FlowIntensity | None
    is_predicted: bool
    notes: str | None
