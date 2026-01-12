"""
ⒸAngelaMos | 2026
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import PartnerService


def get_partner_service(db: DBSession) -> PartnerService:
    """
    Dependency to inject PartnerService instance
    """
    return PartnerService(db)


PartnerServiceDep = Annotated[PartnerService, Depends(get_partner_service)]
