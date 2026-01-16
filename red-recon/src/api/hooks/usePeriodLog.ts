/**
 * @AngelaMos | 2026
 * usePeriodLog.ts
 */

import {
  PERIOD_LOG_ERROR_MESSAGES,
  PERIOD_LOG_SUCCESS_MESSAGES,
  PeriodLogResponseError,
  type PeriodLogCreate,
  type PeriodLogResponse,
  type PeriodLogUpdate,
  isValidPeriodLogListResponse,
  isValidPeriodLogResponse,
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

export const periodLogQueries = {
  all: () => QUERY_KEYS.PERIODS.ALL,
  list: () => QUERY_KEYS.PERIODS.LIST(),
  byId: (id: string) => QUERY_KEYS.PERIODS.BY_ID(id),
  current: () => QUERY_KEYS.PERIODS.CURRENT(),
} as const

const fetchPeriodLogs = async (): Promise<PeriodLogResponse[]> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.PERIODS.BASE)
  const data: unknown = response.data

  if (!isValidPeriodLogListResponse(data)) {
    throw new PeriodLogResponseError(
      PERIOD_LOG_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.PERIODS.BASE
    )
  }

  return data
}

export const usePeriodLogs = (): UseQueryResult<PeriodLogResponse[], Error> => {
  return useQuery({
    queryKey: periodLogQueries.list(),
    queryFn: fetchPeriodLogs,
    ...QUERY_STRATEGIES.cycle,
  })
}

const fetchCurrentPeriod = async (): Promise<PeriodLogResponse | null> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.PERIODS.CURRENT)
  const data: unknown = response.data

  if (data === null) {
    return null
  }

  if (!isValidPeriodLogResponse(data)) {
    throw new PeriodLogResponseError(
      PERIOD_LOG_ERROR_MESSAGES.INVALID_RESPONSE,
      API_ENDPOINTS.PERIODS.CURRENT
    )
  }

  return data
}

export const useCurrentPeriod = (): UseQueryResult<
  PeriodLogResponse | null,
  Error
> => {
  return useQuery({
    queryKey: periodLogQueries.current(),
    queryFn: fetchCurrentPeriod,
    ...QUERY_STRATEGIES.cycle,
  })
}

const createPeriodLog = async (
  data: PeriodLogCreate
): Promise<PeriodLogResponse> => {
  const response = await apiClient.post<unknown>(
    API_ENDPOINTS.PERIODS.BASE,
    data
  )
  const responseData: unknown = response.data

  if (!isValidPeriodLogResponse(responseData)) {
    throw new PeriodLogResponseError(
      PERIOD_LOG_ERROR_MESSAGES.FAILED_TO_CREATE,
      API_ENDPOINTS.PERIODS.BASE
    )
  }

  return responseData
}

export interface CreatePeriodLogResult {
  data: PeriodLogResponse
  message: string
}

export const useCreatePeriodLog = (): UseMutationResult<
  CreatePeriodLogResult,
  Error,
  PeriodLogCreate
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PeriodLogCreate): Promise<CreatePeriodLogResult> => {
      const periodLog = await createPeriodLog(data)
      return { data: periodLog, message: PERIOD_LOG_SUCCESS_MESSAGES.CREATED }
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: periodLogQueries.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLE.ALL })
    },
  })
}

interface UpdatePeriodLogParams {
  id: string
  data: PeriodLogUpdate
}

const updatePeriodLog = async ({
  id,
  data,
}: UpdatePeriodLogParams): Promise<PeriodLogResponse> => {
  const response = await apiClient.patch<unknown>(
    API_ENDPOINTS.PERIODS.BY_ID(id),
    data
  )
  const responseData: unknown = response.data

  if (!isValidPeriodLogResponse(responseData)) {
    throw new PeriodLogResponseError(
      PERIOD_LOG_ERROR_MESSAGES.FAILED_TO_UPDATE,
      API_ENDPOINTS.PERIODS.BY_ID(id)
    )
  }

  return responseData
}

export interface UpdatePeriodLogResult {
  data: PeriodLogResponse
  message: string
}

export const useUpdatePeriodLog = (): UseMutationResult<
  UpdatePeriodLogResult,
  Error,
  UpdatePeriodLogParams
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      params: UpdatePeriodLogParams
    ): Promise<UpdatePeriodLogResult> => {
      const periodLog = await updatePeriodLog(params)
      return { data: periodLog, message: PERIOD_LOG_SUCCESS_MESSAGES.UPDATED }
    },
    onSuccess: (result: UpdatePeriodLogResult): void => {
      queryClient.setQueryData(
        periodLogQueries.byId(result.data.id),
        result.data
      )
      queryClient.invalidateQueries({ queryKey: periodLogQueries.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLE.ALL })
    },
  })
}

const deletePeriodLog = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.PERIODS.BY_ID(id))
}

export interface DeletePeriodLogResult {
  message: string
}

export const useDeletePeriodLog = (): UseMutationResult<
  DeletePeriodLogResult,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<DeletePeriodLogResult> => {
      await deletePeriodLog(id)
      return { message: PERIOD_LOG_SUCCESS_MESSAGES.DELETED }
    },
    onSuccess: (_result: DeletePeriodLogResult, id: string): void => {
      queryClient.removeQueries({ queryKey: periodLogQueries.byId(id) })
      queryClient.invalidateQueries({ queryKey: periodLogQueries.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CYCLE.ALL })
    },
  })
}
