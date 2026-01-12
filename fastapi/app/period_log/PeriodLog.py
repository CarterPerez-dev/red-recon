"""
ⒸAngelaMos | 2026
PeriodLog.py
"""

from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Date, ForeignKey, Integer, String, Boolean, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.Base import Base, TimestampMixin, UUIDMixin
from core.enums import FlowIntensity, SafeEnum

if TYPE_CHECKING:
    from partner.Partner import Partner


class PeriodLog(Base, UUIDMixin, TimestampMixin):
    """
    Period/menstrual cycle log entry
    """
    __tablename__ = "period_logs"
    __table_args__ = (
        UniqueConstraint("partner_id", "start_date", name = "uq_period_log_partner_start"),
    )

    partner_id: Mapped[UUID] = mapped_column(
        ForeignKey("partners.id", ondelete = "CASCADE"),
        index = True,
    )

    start_date: Mapped[date] = mapped_column(Date)

    end_date: Mapped[date | None] = mapped_column(
        Date,
        default = None,
    )

    cycle_length: Mapped[int | None] = mapped_column(
        Integer,
        default = None,
    )

    flow_intensity: Mapped[FlowIntensity | None] = mapped_column(
        SafeEnum(FlowIntensity),
        default = None,
    )

    is_predicted: Mapped[bool] = mapped_column(
        Boolean,
        default = False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        default = None,
    )

    partner: Mapped["Partner"] = relationship(
        back_populates = "period_logs",
        lazy = "raise",
    )
