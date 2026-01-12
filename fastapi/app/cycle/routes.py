"""
ⒸAngelaMos | 2026
routes.py
"""

from datetime import date

from fastapi import APIRouter, Query

from core.dependencies import CurrentUser
from core.responses import AUTH_401, NOT_FOUND_404
from .dependencies import CycleServiceDep
from .schemas import CycleStatus, PhaseInfo, CalendarMonth, CyclePattern


router = APIRouter(prefix = "/partners/me/cycle", tags = ["cycle"])


@router.get(
    "/current",
    response_model = CycleStatus,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_current_status(
    cycle_service: CycleServiceDep,
    current_user: CurrentUser,
) -> CycleStatus:
    """
    Get current cycle status for dashboard
    """
    return await cycle_service.get_current_status(current_user.id)


@router.get(
    "/phases",
    response_model = list[PhaseInfo],
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_phase_info(
    cycle_service: CycleServiceDep,
    current_user: CurrentUser,
) -> list[PhaseInfo]:
    """
    Get information about all cycle phases
    """
    return await cycle_service.get_phase_info(current_user.id)


@router.get(
    "/calendar",
    response_model = CalendarMonth,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_calendar_month(
    cycle_service: CycleServiceDep,
    current_user: CurrentUser,
    year: int = Query(default_factory = lambda: date.today().year),
    month: int = Query(default_factory = lambda: date.today().month, ge = 1, le = 12),
) -> CalendarMonth:
    """
    Get calendar data for a specific month
    """
    return await cycle_service.get_calendar_month(current_user.id, year, month)


@router.get(
    "/patterns",
    response_model = CyclePattern,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_patterns(
    cycle_service: CycleServiceDep,
    current_user: CurrentUser,
) -> CyclePattern:
    """
    Get historical cycle patterns and insights
    """
    return await cycle_service.get_patterns(current_user.id)
