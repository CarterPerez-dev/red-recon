"""
ⒸAngelaMos | 2026
routes.py
"""

from uuid import UUID

from fastapi import APIRouter, Query, status

from core.dependencies import CurrentUser
from core.responses import AUTH_401, CONFLICT_409, NOT_FOUND_404
from .dependencies import PeriodLogServiceDep
from .schemas import PeriodLogCreate, PeriodLogResponse, PeriodLogUpdate


router = APIRouter(prefix = "/partners/me/periods", tags = ["periods"])


@router.post(
    "",
    response_model = PeriodLogResponse,
    status_code = status.HTTP_201_CREATED,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404,
        **CONFLICT_409
    },
)
async def create_period_log(
    period_log_service: PeriodLogServiceDep,
    current_user: CurrentUser,
    data: PeriodLogCreate,
) -> PeriodLogResponse:
    """
    Log a new period start
    """
    return await period_log_service.create_period_log(current_user.id, data)


@router.get(
    "",
    response_model = list[PeriodLogResponse],
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_period_logs(
    period_log_service: PeriodLogServiceDep,
    current_user: CurrentUser,
    skip: int = Query(default = 0, ge = 0),
    limit: int = Query(default = 20, ge = 1, le = 100),
) -> list[PeriodLogResponse]:
    """
    Get period log history
    """
    logs = await period_log_service.get_period_logs(
        current_user.id,
        skip = skip,
        limit = limit,
    )
    return list(logs)


@router.get(
    "/{log_id}",
    response_model = PeriodLogResponse,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_period_log(
    period_log_service: PeriodLogServiceDep,
    current_user: CurrentUser,
    log_id: UUID,
) -> PeriodLogResponse:
    """
    Get a specific period log entry
    """
    return await period_log_service.get_period_log(current_user.id, log_id)


@router.patch(
    "/{log_id}",
    response_model = PeriodLogResponse,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def update_period_log(
    period_log_service: PeriodLogServiceDep,
    current_user: CurrentUser,
    log_id: UUID,
    data: PeriodLogUpdate,
) -> PeriodLogResponse:
    """
    Update a period log entry
    """
    return await period_log_service.update_period_log(current_user.id, log_id, data)


@router.delete(
    "/{log_id}",
    status_code = status.HTTP_204_NO_CONTENT,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def delete_period_log(
    period_log_service: PeriodLogServiceDep,
    current_user: CurrentUser,
    log_id: UUID,
) -> None:
    """
    Delete a period log entry
    """
    await period_log_service.delete_period_log(current_user.id, log_id)
