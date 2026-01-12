"""
ⒸAngelaMos | 2026
routes.py
"""

from datetime import date

from fastapi import APIRouter, Query, status

from core.dependencies import CurrentUser
from core.responses import AUTH_401, CONFLICT_409, NOT_FOUND_404
from .dependencies import DailyLogServiceDep
from .schemas import DailyLogCreate, DailyLogResponse, DailyLogUpdate


router = APIRouter(prefix = "/partners/me/daily-logs", tags = ["daily-logs"])


@router.post(
    "",
    response_model = DailyLogResponse,
    status_code = status.HTTP_201_CREATED,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404,
        **CONFLICT_409
    },
)
async def create_daily_log(
    daily_log_service: DailyLogServiceDep,
    current_user: CurrentUser,
    data: DailyLogCreate,
) -> DailyLogResponse:
    """
    Create a daily mood/symptom log
    """
    return await daily_log_service.create_daily_log(current_user.id, data)


@router.get(
    "",
    response_model = list[DailyLogResponse],
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_daily_logs(
    daily_log_service: DailyLogServiceDep,
    current_user: CurrentUser,
    skip: int = Query(default = 0, ge = 0),
    limit: int = Query(default = 30, ge = 1, le = 100),
    start_date: date | None = Query(default = None),
    end_date: date | None = Query(default = None),
) -> list[DailyLogResponse]:
    """
    Get daily log history, optionally filtered by date range
    """
    if start_date and end_date:
        logs = await daily_log_service.get_date_range(
            current_user.id,
            start_date,
            end_date,
        )
        return list(logs)

    logs = await daily_log_service.get_daily_logs(
        current_user.id,
        skip = skip,
        limit = limit,
    )
    return list(logs)


@router.get(
    "/{log_date}",
    response_model = DailyLogResponse,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_daily_log(
    daily_log_service: DailyLogServiceDep,
    current_user: CurrentUser,
    log_date: date,
) -> DailyLogResponse:
    """
    Get daily log for a specific date
    """
    return await daily_log_service.get_daily_log_by_date(current_user.id, log_date)


@router.patch(
    "/{log_date}",
    response_model = DailyLogResponse,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def update_daily_log(
    daily_log_service: DailyLogServiceDep,
    current_user: CurrentUser,
    log_date: date,
    data: DailyLogUpdate,
) -> DailyLogResponse:
    """
    Update daily log for a specific date
    """
    return await daily_log_service.update_daily_log(current_user.id, log_date, data)


@router.delete(
    "/{log_date}",
    status_code = status.HTTP_204_NO_CONTENT,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def delete_daily_log(
    daily_log_service: DailyLogServiceDep,
    current_user: CurrentUser,
    log_date: date,
) -> None:
    """
    Delete daily log for a specific date
    """
    await daily_log_service.delete_daily_log(current_user.id, log_date)
