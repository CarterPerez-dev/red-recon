/**
 * @AngelaMos | 2026
 * partner.types.ts
 */

import { z } from 'zod'

export const CycleRegularity = {
  REGULAR: 'regular',
  SOMEWHAT_IRREGULAR: 'somewhat_irregular',
  IRREGULAR: 'irregular',
} as const

export type CycleRegularity =
  (typeof CycleRegularity)[keyof typeof CycleRegularity]

export const partnerResponseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  name: z.string(),
  average_cycle_length: z.number(),
  average_period_length: z.number(),
  cycle_regularity: z.nativeEnum(CycleRegularity),
  last_period_start: z.string().nullable(),
  notification_period_reminder: z.boolean(),
  notification_pms_alert: z.boolean(),
  notification_ovulation_alert: z.boolean(),
  reminder_days_before: z.number(),
  timezone: z.string(),
})

export const partnerCreateSchema = z.object({
  name: z.string().min(1).max(50),
  average_cycle_length: z.number().min(21).max(35).default(28),
  average_period_length: z.number().min(3).max(7).default(5),
  cycle_regularity: z.nativeEnum(CycleRegularity).default(CycleRegularity.REGULAR),
  last_period_start: z.string().nullable().optional(),
  notification_period_reminder: z.boolean().default(true),
  notification_pms_alert: z.boolean().default(true),
  notification_ovulation_alert: z.boolean().default(false),
  reminder_days_before: z.number().min(1).max(7).default(3),
  timezone: z.string().max(50).default('UTC'),
})

export const partnerUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  average_cycle_length: z.number().min(21).max(35).optional(),
  average_period_length: z.number().min(3).max(7).optional(),
  cycle_regularity: z.nativeEnum(CycleRegularity).optional(),
  last_period_start: z.string().nullable().optional(),
  notification_period_reminder: z.boolean().optional(),
  notification_pms_alert: z.boolean().optional(),
  notification_ovulation_alert: z.boolean().optional(),
  reminder_days_before: z.number().min(1).max(7).optional(),
  timezone: z.string().max(50).optional(),
})

export type PartnerResponse = z.infer<typeof partnerResponseSchema>
export type PartnerCreate = z.infer<typeof partnerCreateSchema>
export type PartnerUpdate = z.infer<typeof partnerUpdateSchema>

export const isValidPartnerResponse = (
  data: unknown
): data is PartnerResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = partnerResponseSchema.safeParse(data)
  return result.success
}

export class PartnerResponseError extends Error {
  readonly endpoint?: string

  constructor(message: string, endpoint?: string) {
    super(message)
    this.name = 'PartnerResponseError'
    this.endpoint = endpoint
    Object.setPrototypeOf(this, PartnerResponseError.prototype)
  }
}

export const PARTNER_ERROR_MESSAGES = {
  INVALID_PARTNER_RESPONSE: 'Invalid partner data from server',
  PARTNER_NOT_FOUND: 'Partner profile not found',
  PARTNER_ALREADY_EXISTS: 'Partner profile already exists',
  FAILED_TO_CREATE: 'Failed to create partner profile',
  FAILED_TO_UPDATE: 'Failed to update partner profile',
} as const

export const PARTNER_SUCCESS_MESSAGES = {
  CREATED: 'Partner profile created!',
  UPDATED: 'Partner profile updated',
  DELETED: 'Partner profile deleted',
} as const
