"""
ⒸAngelaMos | 2026
schemas.py
"""

from datetime import date

from pydantic import BaseModel

from core.enums import CyclePhase, Mood


class CycleStatus(BaseModel):
    """
    Current cycle status for dashboard display
    """
    current_day: int
    cycle_length: int
    phase: CyclePhase
    phase_day: int
    days_until_period: int | None
    predicted_period_start: date | None
    last_period_start: date | None
    is_period_active: bool


class PhaseInfo(BaseModel):
    """
    Information about a specific phase
    """
    phase: CyclePhase
    start_day: int
    end_day: int
    tip: str


class CalendarDay(BaseModel):
    """
    Single day data for calendar view
    """
    date: date
    cycle_day: int | None
    phase: CyclePhase
    is_period: bool
    is_predicted_period: bool
    has_daily_log: bool
    mood: Mood | None


class CalendarMonth(BaseModel):
    """
    Month data for calendar view
    """
    year: int
    month: int
    days: list[CalendarDay]


class CyclePattern(BaseModel):
    """
    Historical pattern analysis
    """
    average_cycle_length: float
    cycle_length_range: tuple[int, int]
    average_period_length: float
    common_symptoms_by_phase: dict[str, list[str]]
    mood_trends_by_phase: dict[str, str | None]


PHASE_TIPS: dict[CyclePhase, list[str]] = {
    CyclePhase.MENSTRUAL: [
        "Stock check: chocolate, heating pad, patience",
        "Comfort food season - no judgment zone",
        "Hot water bottle is your best friend right now",
        "Rest is productive. Remember that.",
    ],
    CyclePhase.FOLLICULAR: [
        "Good vibes zone - date night territory",
        "Energy's climbing - great time for plans",
        "She's feeling herself. Compliments land well.",
        "Green light for spontaneous adventures",
    ],
    CyclePhase.OVULATION: [
        "Peak energy window - she's glowing",
        "Fertility window open - plan accordingly",
        "Social battery fully charged",
        "Best time for important conversations",
    ],
    CyclePhase.LUTEAL: [
        "Tread lightly, king",
        "Cravings incoming - snacks on standby",
        "Extra patience loading...",
        "Pick your battles wisely this week",
        "Comfort > logic right now",
    ],
    CyclePhase.UNKNOWN: [
        "Log a period to unlock cycle insights",
        "More data = better predictions",
    ],
}
