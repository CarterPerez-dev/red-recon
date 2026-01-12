"""
ⒸAngelaMos | 2026
dependencies.py
"""

from typing import Annotated

from fastapi import Depends

from core.dependencies import DBSession
from .service import DailyLogService


def get_daily_log_service(db: DBSession) -> DailyLogService:
    """
    Dependency to inject DailyLogService instance
    """
    return DailyLogService(db)


DailyLogServiceDep = Annotated[DailyLogService, Depends(get_daily_log_service)]
