/**
 * @AngelaMos | 2026
 * usePeriodForDate.ts
 */

import { useMemo } from 'react'
import { usePeriodLogs } from '@/api/hooks'
import type { PeriodLogResponse } from '@/api/types'

export interface UsePeriodForDateResult {
  period: PeriodLogResponse | null
  isLoading: boolean
  isInPeriod: boolean
  isStartDate: boolean
  isEndDate: boolean
}

function isDateInRange(
  dateStr: string,
  startDate: string,
  endDate: string | null
): boolean {
  const date = new Date(dateStr)
  const start = new Date(startDate)

  if (date < start) return false

  if (endDate === null) {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return date <= today
  }

  const end = new Date(endDate)
  return date <= end
}

export function usePeriodForDate(dateStr: string): UsePeriodForDateResult {
  const { data: periodLogs, isLoading } = usePeriodLogs()

  const result = useMemo(() => {
    if (!periodLogs || !dateStr) {
      return {
        period: null,
        isInPeriod: false,
        isStartDate: false,
        isEndDate: false,
      }
    }

    const actualPeriods = periodLogs.filter((p) => !p.is_predicted)

    for (const period of actualPeriods) {
      if (isDateInRange(dateStr, period.start_date, period.end_date)) {
        return {
          period,
          isInPeriod: true,
          isStartDate: dateStr === period.start_date,
          isEndDate: period.end_date !== null && dateStr === period.end_date,
        }
      }
    }

    return {
      period: null,
      isInPeriod: false,
      isStartDate: false,
      isEndDate: false,
    }
  }, [periodLogs, dateStr])

  return {
    ...result,
    isLoading,
  }
}
