/**
 * @AngelaMos | 2026
 * useDailyLog.ts
 */

import {
  DAILY_LOG_ERROR_MESSAGES,
  DAILY_LOG_SUCCESS_MESSAGES,
  DailyLogResponseError,
  type DailyLogCreate,
  type DailyLogResponse,
  type DailyLogUpdate,
  isValidDailyLogListResponse,
  isValidDailyLogResponse,
} from '@/api/types'
import { QUERY_STRATEGIES, apiClient } from '@/core/api'
import { API_ENDPOINTS, QUERY_KEYS } from '@/core/config'
import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

export const dailyLogQueries = {
  all: () => QUERY_KEYS.DAILY_LOGS.ALL,
  list: () => QUERY_KEYS.DAILY_LOGS.LIST(),
  byDate: (date: string) => QUERY_KEYS.DAILY_LOGS.BY_DATE(date),
} as const

const fetchDailyLogs = async (): Promise<DailyLogResponse[]> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.DAILY_LOGS.BASE)
  const data: unknown = response.data

  if (!isValidDailyLogListResponse(data)) {
    throw new DailyLogResponseError(
      DAILY_LOG_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.DAILY_LOGS.BASE
    )
  }

  return data
}

export const useDailyLogs = (): UseQueryResult<DailyLogResponse[], Error> => {
  return useQuery({
    queryKey: dailyLogQueries.list(),
    queryFn: fetchDailyLogs,
    ...QUERY_STRATEGIES.cycle,
  })
}

const fetchDailyLogByDate = async (date: string): Promise<DailyLogResponse | null> => {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.DAILY_LOGS.BY_DATE(date)
  )
  const data: unknown = response.data

  if (data === null) {
    return null
  }

  if (!isValidDailyLogResponse(data)) {
    throw new DailyLogResponseError(
      DAILY_LOG_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.DAILY_LOGS.BY_DATE(date)
    )
  }

  return data
}

export const useDailyLogByDate = (
  date: string
): UseQueryResult<DailyLogResponse | null, Error> => {
  return useQuery({
    queryKey: dailyLogQueries.byDate(date),
    queryFn: () => fetchDailyLogByDate(date),
    enabled: Boolean(date),
    ...QUERY_STRATEGIES.cycle,
  })
}

const createDailyLog = async (
  data: DailyLogCreate
): Promise<DailyLogResponse> => {
  const response = await apiClient.post<unknown>(
    API_ENDPOINTS.DAILY_LOGS.BASE,
    data
  )
  const responseData: unknown = response.data

  if (!isValidDailyLogResponse(responseData)) {
    throw new DailyLogResponseError(
      DAILY_LOG_ERROR_MESSAGES.FAILED_TO_CREATE,
      API_ENDPOINTS.DAILY_LOGS.BASE
    )
  }

  return responseData
}

export interface CreateDailyLogResult {
  data: DailyLogResponse
  message: string
}

export const useCreateDailyLog = (): UseMutationResult<
  CreateDailyLogResult,
  Error,
  DailyLogCreate
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: DailyLogCreate): Promise<CreateDailyLogResult> => {
      const dailyLog = await createDailyLog(data)
      return { data: dailyLog, message: DAILY_LOG_SUCCESS_MESSAGES.CREATED }
    },
    onSuccess: (result: CreateDailyLogResult): void => {
      queryClient.setQueryData(
        dailyLogQueries.byDate(result.data.log_date),
        result.data
      )
      queryClient.invalidateQueries({ queryKey: dailyLogQueries.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLE.ALL })
    },
  })
}

interface UpdateDailyLogParams {
  date: string
  data: DailyLogUpdate
}

const updateDailyLog = async ({
  date,
  data,
}: UpdateDailyLogParams): Promise<DailyLogResponse> => {
  const response = await apiClient.patch<unknown>(
    API_ENDPOINTS.DAILY_LOGS.BY_DATE(date),
    data
  )
  const responseData: unknown = response.data

  if (!isValidDailyLogResponse(responseData)) {
    throw new DailyLogResponseError(
      DAILY_LOG_ERROR_MESSAGES.FAILED_TO_UPDATE,
      API_ENDPOINTS.DAILY_LOGS.BY_DATE(date)
    )
  }

  return responseData
}

export interface UpdateDailyLogResult {
  data: DailyLogResponse
  message: string
}

export const useUpdateDailyLog = (): UseMutationResult<
  UpdateDailyLogResult,
  Error,
  UpdateDailyLogParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      params: UpdateDailyLogParams
    ): Promise<UpdateDailyLogResult> => {
      const dailyLog = await updateDailyLog(params)
      return { data: dailyLog, message: DAILY_LOG_SUCCESS_MESSAGES.UPDATED }
    },
    onSuccess: (result: UpdateDailyLogResult): void => {
      queryClient.setQueryData(
        dailyLogQueries.byDate(result.data.log_date),
        result.data
      )
      queryClient.invalidateQueries({ queryKey: dailyLogQueries.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLE.ALL })
    },
  })
}

const deleteDailyLog = async (date: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.DAILY_LOGS.BY_DATE(date))
}

export interface DeleteDailyLogResult {
  message: string
}

export const useDeleteDailyLog = (): UseMutationResult<
  DeleteDailyLogResult,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (date: string): Promise<DeleteDailyLogResult> => {
      await deleteDailyLog(date)
      return { message: DAILY_LOG_SUCCESS_MESSAGES.DELETED }
    },
    onSuccess: (_result: DeleteDailyLogResult, date: string): void => {
      queryClient.removeQueries({ queryKey: dailyLogQueries.byDate(date) })
      queryClient.invalidateQueries({ queryKey: dailyLogQueries.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLE.ALL })
    },
  })
}
