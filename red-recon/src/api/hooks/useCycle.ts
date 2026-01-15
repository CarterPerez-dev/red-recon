/**
 * @AngelaMos | 2026
 * useCycle.ts
 */

import {
  CYCLE_ERROR_MESSAGES,
  CycleResponseError,
  type CalendarMonth,
  type CyclePattern,
  type CycleStatus,
  type PhaseInfo,
  isValidCalendarMonth,
  isValidCyclePattern,
  isValidCycleStatus,
  isValidPhaseInfoList,
} from '@/api/types'
import { QUERY_STRATEGIES, apiClient } from '@/core/api'
import { API_ENDPOINTS, QUERY_KEYS } from '@/core/config'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'

export const cycleQueries = {
  all: () => QUERY_KEYS.CYCLE.ALL,
  current: () => QUERY_KEYS.CYCLE.CURRENT(),
  phases: () => QUERY_KEYS.CYCLE.PHASES(),
  calendar: (year: number, month: number) =>
    QUERY_KEYS.CYCLE.CALENDAR(year, month),
  patterns: () => QUERY_KEYS.CYCLE.PATTERNS(),
} as const

const fetchCycleStatus = async (): Promise<CycleStatus> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.CYCLE.CURRENT)
  const data: unknown = response.data

  if (!isValidCycleStatus(data)) {
    throw new CycleResponseError(
      CYCLE_ERROR_MESSAGES.INVALID_STATUS_RESPONSE,
      API_ENDPOINTS.CYCLE.CURRENT
    )
  }

  return data
}

export const useCycleStatus = (): UseQueryResult<CycleStatus, Error> => {
  return useQuery({
    queryKey: cycleQueries.current(),
    queryFn: fetchCycleStatus,
    ...QUERY_STRATEGIES.cycle,
  })
}

const fetchPhaseInfo = async (): Promise<PhaseInfo[]> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.CYCLE.PHASES)
  const data: unknown = response.data

  if (!isValidPhaseInfoList(data)) {
    throw new CycleResponseError(
      CYCLE_ERROR_MESSAGES.INVALID_STATUS_RESPONSE,
      API_ENDPOINTS.CYCLE.PHASES
    )
  }

  return data
}

export const usePhaseInfo = (): UseQueryResult<PhaseInfo[], Error> => {
  return useQuery({
    queryKey: cycleQueries.phases(),
    queryFn: fetchPhaseInfo,
    ...QUERY_STRATEGIES.static,
  })
}

const fetchCalendarMonth = async (
  year: number,
  month: number
): Promise<CalendarMonth> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.CYCLE.CALENDAR(year, month)
  )
  const data: unknown = response.data

  if (!isValidCalendarMonth(data)) {
    throw new CycleResponseError(
      CYCLE_ERROR_MESSAGES.INVALID_CALENDAR_RESPONSE,
      API_ENDPOINTS.CYCLE.CALENDAR(year, month)
    )
  }

  return data
}

export const useCalendarMonth = (
  year: number,
  month: number
): UseQueryResult<CalendarMonth, Error> => {
  return useQuery({
    queryKey: cycleQueries.calendar(year, month),
    queryFn: () => fetchCalendarMonth(year, month),
    enabled: Boolean(year && month),
    ...QUERY_STRATEGIES.calendar,
  })
}

const fetchCyclePatterns = async (): Promise<CyclePattern> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.CYCLE.PATTERNS)
  const data: unknown = response.data

  if (!isValidCyclePattern(data)) {
    throw new CycleResponseError(
      CYCLE_ERROR_MESSAGES.INVALID_PATTERN_RESPONSE,
      API_ENDPOINTS.CYCLE.PATTERNS
    )
  }

  return data
}

export const useCyclePatterns = (): UseQueryResult<CyclePattern, Error> => {
  return useQuery({
    queryKey: cycleQueries.patterns(),
    queryFn: fetchCyclePatterns,
    ...QUERY_STRATEGIES.calendar,
  })
}
