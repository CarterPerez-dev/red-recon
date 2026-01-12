"""
ⒸAngelaMos | 2026
DailyLog.py
"""

from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import (
    Date, 
    ForeignKey, 
    Integer, 
    Text, 
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import (
    Mapped, 
    mapped_column, 
    relationship
)
from core.Base import (
    Base, 
    TimestampMixin, 
    UUIDMixin,
)
from core.enums import Mood, SafeEnum

if TYPE_CHECKING:
    from partner.Partner import Partner


class DailyLog(Base, UUIDMixin, TimestampMixin):
    """
    Daily mood and symptom log entry
    """
    __tablename__ = "daily_logs"
    __table_args__ = (
        UniqueConstraint("partner_id", "log_date", name = "uq_daily_log_partner_date"),
    )

    partner_id: Mapped[UUID] = mapped_column(
        ForeignKey("partners.id", ondelete = "CASCADE"),
        index = True,
    )

    log_date: Mapped[date] = mapped_column(Date)

    mood: Mapped[Mood | None] = mapped_column(
        SafeEnum(Mood),
        default = None,
    )

    energy_level: Mapped[int | None] = mapped_column(
        Integer,
        default = None,
    )

    symptoms: Mapped[list[str]] = mapped_column(
        JSONB,
        default = list,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        default = None,
    )

    partner: Mapped["Partner"] = relationship(
        back_populates = "daily_logs",
        lazy = "raise",
    )
