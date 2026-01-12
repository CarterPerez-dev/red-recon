"""
ⒸAngelaMos | 2026
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import PeriodLogService


def get_period_log_service(db: DBSession) -> PeriodLogService:
    """
    Dependency to inject PeriodLogService instance
    """
    return PeriodLogService(db)


PeriodLogServiceDep = Annotated[PeriodLogService, Depends(get_period_log_service)]
