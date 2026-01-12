"""
ⒸAngelaMos | 2026
routes.py
"""

from fastapi import APIRouter, status

from core.dependencies import CurrentUser
from core.responses import AUTH_401, CONFLICT_409, NOT_FOUND_404
from .dependencies import PartnerServiceDep
from .schemas import PartnerCreate, PartnerResponse, PartnerUpdate


router = APIRouter(prefix = "/partners", tags = ["partners"])


@router.post(
    "/me",
    response_model = PartnerResponse,
    status_code = status.HTTP_201_CREATED,
    responses = {
        **AUTH_401,
        **CONFLICT_409
    },
)
async def create_partner(
    partner_service: PartnerServiceDep,
    current_user: CurrentUser,
    data: PartnerCreate,
) -> PartnerResponse:
    """
    Create partner profile for current user
    """
    return await partner_service.create_partner(current_user.id, data)


@router.get(
    "/me",
    response_model = PartnerResponse,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def get_my_partner(
    partner_service: PartnerServiceDep,
    current_user: CurrentUser,
) -> PartnerResponse:
    """
    Get current user's partner profile
    """
    return await partner_service.get_partner(current_user.id)


@router.patch(
    "/me",
    response_model = PartnerResponse,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def update_my_partner(
    partner_service: PartnerServiceDep,
    current_user: CurrentUser,
    data: PartnerUpdate,
) -> PartnerResponse:
    """
    Update current user's partner profile
    """
    return await partner_service.update_partner(current_user.id, data)


@router.delete(
    "/me",
    status_code = status.HTTP_204_NO_CONTENT,
    responses = {
        **AUTH_401,
        **NOT_FOUND_404
    },
)
async def delete_my_partner(
    partner_service: PartnerServiceDep,
    current_user: CurrentUser,
) -> None:
    """
    Delete current user's partner profile
    """
    await partner_service.delete_partner(current_user.id)


@router.get(
    "/me/exists",
    response_model = bool,
    responses = {**AUTH_401},
)
async def check_partner_exists(
    partner_service: PartnerServiceDep,
    current_user: CurrentUser,
) -> bool:
    """
    Check if current user has a partner profile
    """
    return await partner_service.has_partner(current_user.id)
