"""
ⒸAngelaMos | 2026
__init__.py
"""

from .Partner import Partner
from .repository import PartnerRepository
from .service import PartnerService
from .schemas import PartnerCreate, PartnerResponse, PartnerUpdate
from .dependencies import PartnerServiceDep, get_partner_service
from .routes import router

__all__ = [
    "Partner",
    "PartnerRepository",
    "PartnerService",
    "PartnerCreate",
    "PartnerResponse",
    "PartnerUpdate",
    "PartnerServiceDep",
    "get_partner_service",
    "router",
]
