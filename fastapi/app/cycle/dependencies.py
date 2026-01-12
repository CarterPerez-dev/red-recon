"""
ⒸAngelaMos | 2026
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import CycleService


def get_cycle_service(db: DBSession) -> CycleService:
    """
    Dependency to inject CycleService instance
    """
    return CycleService(db)


CycleServiceDep = Annotated[CycleService, Depends(get_cycle_service)]
