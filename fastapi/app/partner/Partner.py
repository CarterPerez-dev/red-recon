"""
ⒸAngelaMos | 2026
Partner.py
"""

from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Date, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.Base import Base, TimestampMixin, UUIDMixin
from core.enums import CycleRegularity, SafeEnum

if TYPE_CHECKING:
    from user.User import User
    from period_log.PeriodLog import PeriodLog
    from daily_log.DailyLog import DailyLog


class Partner(Base, UUIDMixin, TimestampMixin):
    """
    Partner profile for cycle tracking
    """
    __tablename__ = "partners"

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete = "CASCADE"),
        unique = True,
        index = True,
    )

    name: Mapped[str] = mapped_column(String(50))

    average_cycle_length: Mapped[int] = mapped_column(
        Integer,
        default = 28,
    )

    average_period_length: Mapped[int] = mapped_column(
        Integer,
        default = 5,
    )

    cycle_regularity: Mapped[CycleRegularity] = mapped_column(
        SafeEnum(CycleRegularity),
        default = CycleRegularity.REGULAR,
    )

    last_period_start: Mapped[date | None] = mapped_column(
        Date,
        default = None,
    )

    notification_period_reminder: Mapped[bool] = mapped_column(
        Boolean,
        default = True,
    )

    notification_pms_alert: Mapped[bool] = mapped_column(
        Boolean,
        default = True,
    )

    notification_ovulation_alert: Mapped[bool] = mapped_column(
        Boolean,
        default = False,
    )

    reminder_days_before: Mapped[int] = mapped_column(
        Integer,
        default = 3,
    )

    timezone: Mapped[str] = mapped_column(
        String(50),
        default = "UTC",
    )

    user: Mapped["User"] = relationship(
        back_populates = "partner",
        lazy = "raise",
    )

    period_logs: Mapped[list["PeriodLog"]] = relationship(
        back_populates = "partner",
        cascade = "all, delete-orphan",
        lazy = "raise",
    )

    daily_logs: Mapped[list["DailyLog"]] = relationship(
        back_populates = "partner",
        cascade = "all, delete-orphan",
        lazy = "raise",
    )
