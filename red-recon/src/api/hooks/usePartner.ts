/**
 * @AngelaMos | 2026
 * usePartner.ts
 */

import {
  PARTNER_ERROR_MESSAGES,
  PARTNER_SUCCESS_MESSAGES,
  PartnerResponseError,
  type PartnerCreate,
  type PartnerResponse,
  type PartnerUpdate,
  isValidPartnerResponse,
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

export const partnerQueries = {
  all: () => QUERY_KEYS.PARTNERS.ALL,
  me: () => QUERY_KEYS.PARTNERS.ME(),
  exists: () => QUERY_KEYS.PARTNERS.EXISTS(),
} as const

const fetchPartner = async (): Promise<PartnerResponse> => {
  const response = await apiClient.get<unknown>(API_ENDPOINTS.PARTNERS.ME)
  const data: unknown = response.data

  if (!isValidPartnerResponse(data)) {
    throw new PartnerResponseError(
      PARTNER_ERROR_MESSAGES.INVALID_PARTNER_RESPONSE,
      API_ENDPOINTS.PARTNERS.ME
    )
  }

  return data
}

export const usePartner = (): UseQueryResult<PartnerResponse, Error> => {
  return useQuery({
    queryKey: partnerQueries.me(),
    queryFn: fetchPartner,
    ...QUERY_STRATEGIES.partner,
  })
}

const checkPartnerExists = async (): Promise<boolean> => {
  const response = await apiClient.get<boolean>(API_ENDPOINTS.PARTNERS.EXISTS)
  return response.data === true
}

export const usePartnerExists = (): UseQueryResult<boolean, Error> => {
  return useQuery({
    queryKey: partnerQueries.exists(),
    queryFn: checkPartnerExists,
    ...QUERY_STRATEGIES.partner,
  })
}

const createPartner = async (data: PartnerCreate): Promise<PartnerResponse> => {
  const response = await apiClient.post<unknown>(API_ENDPOINTS.PARTNERS.ME, data)
  const responseData: unknown = response.data

  if (!isValidPartnerResponse(responseData)) {
    throw new PartnerResponseError(
      PARTNER_ERROR_MESSAGES.FAILED_TO_CREATE,
      API_ENDPOINTS.PARTNERS.ME
    )
  }

  return responseData
}

export interface CreatePartnerResult {
  data: PartnerResponse
  message: string
}

export const useCreatePartner = (): UseMutationResult<
  CreatePartnerResult,
  Error,
  PartnerCreate
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PartnerCreate): Promise<CreatePartnerResult> => {
      const partner = await createPartner(data)
      return { data: partner, message: PARTNER_SUCCESS_MESSAGES.CREATED }
    },
    onSuccess: (result: CreatePartnerResult): void => {
      queryClient.setQueryData(partnerQueries.me(), result.data)
      queryClient.setQueryData(partnerQueries.exists(), true)
    },
  })
}

const updatePartner = async (data: PartnerUpdate): Promise<PartnerResponse> => {
  const response = await apiClient.patch<unknown>(API_ENDPOINTS.PARTNERS.ME, data)
  const responseData: unknown = response.data

  if (!isValidPartnerResponse(responseData)) {
    throw new PartnerResponseError(
      PARTNER_ERROR_MESSAGES.FAILED_TO_UPDATE,
      API_ENDPOINTS.PARTNERS.ME
    )
  }

  return responseData
}

export interface UpdatePartnerResult {
  data: PartnerResponse
  message: string
}

export const useUpdatePartner = (): UseMutationResult<
  UpdatePartnerResult,
  Error,
  PartnerUpdate
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PartnerUpdate): Promise<UpdatePartnerResult> => {
      const partner = await updatePartner(data)
      return { data: partner, message: PARTNER_SUCCESS_MESSAGES.UPDATED }
    },
    onSuccess: (result: UpdatePartnerResult): void => {
      queryClient.setQueryData(partnerQueries.me(), result.data)
    },
  })
}

const deletePartner = async (): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.PARTNERS.ME)
}

export interface DeletePartnerResult {
  message: string
}

export const useDeletePartner = (): UseMutationResult<
  DeletePartnerResult,
  Error,
  void
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<DeletePartnerResult> => {
      await deletePartner()
      return { message: PARTNER_SUCCESS_MESSAGES.DELETED }
    },
    onSuccess: (): void => {
      queryClient.setQueryData(partnerQueries.me(), null)
      queryClient.setQueryData(partnerQueries.exists(), false)
      queryClient.removeQueries({ queryKey: QUERY_KEYS.CYCLE.ALL })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.PERIODS.ALL })
      queryClient.removeQueries({ queryKey: QUERY_KEYS.DAILY_LOGS.ALL })
    },
  })
}
