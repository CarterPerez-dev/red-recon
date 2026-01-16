/**
 * @AngelaMos | 2026
 * periodLog.types.ts
 */

import { z } from 'zod'

export const FlowIntensity = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
} as const

export type FlowIntensity = (typeof FlowIntensity)[keyof typeof FlowIntensity]

export const periodLogResponseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  partner_id: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable(),
  cycle_length: z.number().nullable(),
  flow_intensity: z.nativeEnum(FlowIntensity).nullable(),
  is_predicted: z.boolean(),
  notes: z.string().nullable(),
})

export const periodLogCreateSchema = z.object({
  start_date: z.string(),
  end_date: z.string().nullable().optional(),
  flow_intensity: z.nativeEnum(FlowIntensity).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
})

export const periodLogUpdateSchema = z.object({
  end_date: z.string().nullable().optional(),
  flow_intensity: z.nativeEnum(FlowIntensity).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
})

export type PeriodLogResponse = z.infer<typeof periodLogResponseSchema>
export type PeriodLogCreate = z.infer<typeof periodLogCreateSchema>
export type PeriodLogUpdate = z.infer<typeof periodLogUpdateSchema>

export const isValidPeriodLogResponse = (
  data: unknown
): data is PeriodLogResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = periodLogResponseSchema.safeParse(data)
  return result.success
}

export const isValidPeriodLogListResponse = (
  data: unknown
): data is PeriodLogResponse[] => {
  if (!Array.isArray(data)) return false

  return data.every(
    (item) => periodLogResponseSchema.safeParse(item).success
  )
}

export class PeriodLogResponseError extends Error {
  readonly endpoint?: string

  constructor(message: string, endpoint?: string) {
    super(message)
    this.name = 'PeriodLogResponseError'
    this.endpoint = endpoint
    Object.setPrototypeOf(this, PeriodLogResponseError.prototype)
  }
}

export const PERIOD_LOG_ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid period log data from server',
  NOT_FOUND: 'Period log not found',
  ALREADY_EXISTS: 'Period log already exists for this date',
  FAILED_TO_CREATE: 'Failed to log period',
  FAILED_TO_UPDATE: 'Failed to update period log',
  FAILED_TO_DELETE: 'Failed to delete period log',
} as const

export const PERIOD_LOG_SUCCESS_MESSAGES = {
  CREATED: 'Period logged!',
  UPDATED: 'Period log updated',
  DELETED: 'Period log deleted',
} as const
