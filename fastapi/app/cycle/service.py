"""
ⒸAngelaMos | 2026
service.py
"""

import random
from collections import defaultdict
from datetime import date, timedelta
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from core.enums import CyclePhase, Mood
from core.exceptions import PartnerNotFound
from partner.repository import PartnerRepository
from period_log.repository import PeriodLogRepository
from daily_log.repository import DailyLogRepository
from .schemas import (
    CycleStatus,
    PhaseInfo,
    CalendarDay,
    CalendarMonth,
    CyclePattern,
    PHASE_TIPS,
)


class CycleService:
    """
    Cycle phase calculations, predictions, and pattern analysis
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def _get_phase(self, cycle_day: int, cycle_length: int) -> CyclePhase:
        """
        Determine cycle phase based on cycle day
        """
        if cycle_day <= 0 or cycle_day > cycle_length:
            return CyclePhase.UNKNOWN

        if cycle_day <= 5:
            return CyclePhase.MENSTRUAL

        ovulation_day = cycle_length - 14
        follicular_end = ovulation_day - 2
        ovulation_end = ovulation_day + 2

        if cycle_day <= follicular_end:
            return CyclePhase.FOLLICULAR
        elif cycle_day <= ovulation_end:
            return CyclePhase.OVULATION
        else:
            return CyclePhase.LUTEAL

    def _get_phase_day(self, cycle_day: int, cycle_length: int) -> int:
        """
        Get day within current phase
        """
        phase = self._get_phase(cycle_day, cycle_length)

        if phase == CyclePhase.MENSTRUAL:
            return cycle_day

        ovulation_day = cycle_length - 14
        follicular_end = ovulation_day - 2
        ovulation_end = ovulation_day + 2

        if phase == CyclePhase.FOLLICULAR:
            return cycle_day - 5
        elif phase == CyclePhase.OVULATION:
            return cycle_day - follicular_end
        elif phase == CyclePhase.LUTEAL:
            return cycle_day - ovulation_end

        return 1

    def _get_random_tip(self, phase: CyclePhase) -> str:
        """
        Get a random tip for the phase
        """
        tips = PHASE_TIPS.get(phase, PHASE_TIPS[CyclePhase.UNKNOWN])
        return random.choice(tips)

    async def get_current_status(self, user_id: UUID) -> CycleStatus:
        """
        Get current cycle status for dashboard
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))

        cycle_length = partner.average_cycle_length
        last_period = partner.last_period_start
        today = date.today()

        if not last_period:
            return CycleStatus(
                current_day = 0,
                cycle_length = cycle_length,
                phase = CyclePhase.UNKNOWN,
                phase_day = 0,
                days_until_period = None,
                predicted_period_start = None,
                last_period_start = None,
                is_period_active = False,
            )

        days_since = (today - last_period).days + 1
        current_day = ((days_since - 1) % cycle_length) + 1

        predicted_start = last_period + timedelta(days = cycle_length)
        while predicted_start <= today:
            predicted_start += timedelta(days = cycle_length)

        days_until = (predicted_start - today).days

        phase = self._get_phase(current_day, cycle_length)
        phase_day = self._get_phase_day(current_day, cycle_length)

        is_period_active = current_day <= partner.average_period_length

        return CycleStatus(
            current_day = current_day,
            cycle_length = cycle_length,
            phase = phase,
            phase_day = phase_day,
            days_until_period = days_until,
            predicted_period_start = predicted_start,
            last_period_start = last_period,
            is_period_active = is_period_active,
        )

    async def get_phase_info(self, user_id: UUID) -> list[PhaseInfo]:
        """
        Get info about all phases for current cycle length
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))

        cycle_length = partner.average_cycle_length
        ovulation_day = cycle_length - 14
        follicular_end = ovulation_day - 2
        ovulation_end = ovulation_day + 2

        return [
            PhaseInfo(
                phase = CyclePhase.MENSTRUAL,
                start_day = 1,
                end_day = 5,
                tip = self._get_random_tip(CyclePhase.MENSTRUAL),
            ),
            PhaseInfo(
                phase = CyclePhase.FOLLICULAR,
                start_day = 6,
                end_day = follicular_end,
                tip = self._get_random_tip(CyclePhase.FOLLICULAR),
            ),
            PhaseInfo(
                phase = CyclePhase.OVULATION,
                start_day = follicular_end + 1,
                end_day = ovulation_end,
                tip = self._get_random_tip(CyclePhase.OVULATION),
            ),
            PhaseInfo(
                phase = CyclePhase.LUTEAL,
                start_day = ovulation_end + 1,
                end_day = cycle_length,
                tip = self._get_random_tip(CyclePhase.LUTEAL),
            ),
        ]

    async def get_calendar_month(
        self,
        user_id: UUID,
        year: int,
        month: int,
    ) -> CalendarMonth:
        """
        Get calendar data for a specific month
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))

        first_day = date(year, month, 1)
        if month == 12:
            last_day = date(year + 1, 1, 1) - timedelta(days = 1)
        else:
            last_day = date(year, month + 1, 1) - timedelta(days = 1)

        period_logs = await PeriodLogRepository.get_by_partner_id(
            self.session,
            partner.id,
            limit = 12,
        )

        daily_logs = await DailyLogRepository.get_date_range(
            self.session,
            partner.id,
            first_day,
            last_day,
        )
        daily_log_map = {log.log_date: log for log in daily_logs}

        period_dates: set[date] = set()
        predicted_dates: set[date] = set()

        for log in period_logs:
            period_length = partner.average_period_length
            if log.end_date:
                period_length = (log.end_date - log.start_date).days + 1

            for i in range(period_length):
                d = log.start_date + timedelta(days = i)
                if log.is_predicted:
                    predicted_dates.add(d)
                else:
                    period_dates.add(d)

        if partner.last_period_start:
            predicted_start = partner.last_period_start + timedelta(
                days = partner.average_cycle_length
            )
            while predicted_start <= last_day:
                if predicted_start >= first_day:
                    for i in range(partner.average_period_length):
                        d = predicted_start + timedelta(days = i)
                        if first_day <= d <= last_day and d not in period_dates:
                            predicted_dates.add(d)
                predicted_start += timedelta(days = partner.average_cycle_length)

        days: list[CalendarDay] = []
        current_date = first_day

        while current_date <= last_day:
            cycle_day = None
            phase = CyclePhase.UNKNOWN

            if partner.last_period_start:
                days_since = (current_date - partner.last_period_start).days + 1
                if days_since > 0:
                    cycle_day = ((days_since - 1) % partner.average_cycle_length) + 1
                    phase = self._get_phase(cycle_day, partner.average_cycle_length)

            daily_log = daily_log_map.get(current_date)

            days.append(CalendarDay(
                date = current_date,
                cycle_day = cycle_day,
                phase = phase,
                is_period = current_date in period_dates,
                is_predicted_period = current_date in predicted_dates,
                has_daily_log = daily_log is not None,
                mood = daily_log.mood if daily_log else None,
            ))

            current_date += timedelta(days = 1)

        return CalendarMonth(
            year = year,
            month = month,
            days = days,
        )

    async def get_patterns(self, user_id: UUID) -> CyclePattern:
        """
        Analyze historical patterns
        """
        partner = await PartnerRepository.get_by_user_id(self.session, user_id)
        if not partner:
            raise PartnerNotFound(str(user_id))

        period_logs = await PeriodLogRepository.get_actual_logs(
            self.session,
            partner.id,
            limit = 12,
        )

        cycle_lengths = [
            log.cycle_length for log in period_logs
            if log.cycle_length is not None
        ]

        if cycle_lengths:
            avg_cycle = sum(cycle_lengths) / len(cycle_lengths)
            cycle_range = (min(cycle_lengths), max(cycle_lengths))
        else:
            avg_cycle = float(partner.average_cycle_length)
            cycle_range = (partner.average_cycle_length, partner.average_cycle_length)

        period_lengths = []
        for log in period_logs:
            if log.end_date:
                length = (log.end_date - log.start_date).days + 1
                period_lengths.append(length)

        avg_period = (
            sum(period_lengths) / len(period_lengths)
            if period_lengths
            else float(partner.average_period_length)
        )

        daily_logs = await DailyLogRepository.get_by_partner_id(
            self.session,
            partner.id,
            limit = 90,
        )

        symptoms_by_phase: dict[str, list[str]] = defaultdict(list)
        mood_counts_by_phase: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))

        for log in daily_logs:
            if not partner.last_period_start:
                continue

            days_since = (log.log_date - partner.last_period_start).days + 1
            if days_since <= 0:
                continue

            cycle_day = ((days_since - 1) % partner.average_cycle_length) + 1
            phase = self._get_phase(cycle_day, partner.average_cycle_length)
            phase_key = phase.value

            for symptom in log.symptoms:
                if symptom not in symptoms_by_phase[phase_key]:
                    symptoms_by_phase[phase_key].append(symptom)

            if log.mood:
                mood_counts_by_phase[phase_key][log.mood.value] += 1

        common_symptoms = {
            phase: symptoms[:5] for phase, symptoms in symptoms_by_phase.items()
        }

        mood_trends: dict[str, str | None] = {}
        for phase, counts in mood_counts_by_phase.items():
            if counts:
                mood_trends[phase] = max(counts, key = counts.get)
            else:
                mood_trends[phase] = None

        return CyclePattern(
            average_cycle_length = round(avg_cycle, 1),
            cycle_length_range = cycle_range,
            average_period_length = round(avg_period, 1),
            common_symptoms_by_phase = common_symptoms,
            mood_trends_by_phase = mood_trends,
        )
