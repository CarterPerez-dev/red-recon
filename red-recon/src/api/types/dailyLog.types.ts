/**
 * @AngelaMos | 2026
 * dailyLog.types.ts
 */

import { z } from 'zod'

export const Mood = {
  GREAT: 'great',
  GOOD: 'good',
  MEH: 'meh',
  ROUGH: 'rough',
  JUST_NOD: 'just_nod',
  PICK_YOUR_BATTLES: 'pick_your_battles',
} as const

export type Mood = (typeof Mood)[keyof typeof Mood]

export const MOOD_LABELS: Record<Mood, string> = {
  [Mood.GREAT]: 'Great',
  [Mood.GOOD]: 'Good',
  [Mood.MEH]: 'Meh',
  [Mood.ROUGH]: 'Rough',
  [Mood.JUST_NOD]: 'Just Nod',
  [Mood.PICK_YOUR_BATTLES]: 'Pick Your Battles',
}

export const VALID_SYMPTOMS = [
  'cramps',
  'headache',
  'tired',
  'moody',
  'cravings',
  'bloated',
  'backache',
  'anxious',
  'nausea',
  'insomnia',
] as const

export type Symptom = (typeof VALID_SYMPTOMS)[number]

export const dailyLogResponseSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
  partner_id: z.string(),
  log_date: z.string(),
  mood: z.nativeEnum(Mood).nullable(),
  energy_level: z.number().min(1).max(5).nullable(),
  symptoms: z.array(z.string()),
  notes: z.string().nullable(),
})

export const dailyLogCreateSchema = z.object({
  log_date: z.string(),
  mood: z.nativeEnum(Mood).nullable().optional(),
  energy_level: z.number().min(1).max(5).nullable().optional(),
  symptoms: z.array(z.string()).default([]),
  notes: z.string().max(500).nullable().optional(),
})

export const dailyLogUpdateSchema = z.object({
  mood: z.nativeEnum(Mood).nullable().optional(),
  energy_level: z.number().min(1).max(5).nullable().optional(),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().max(500).nullable().optional(),
})

export type DailyLogResponse = z.infer<typeof dailyLogResponseSchema>
export type DailyLogCreate = z.infer<typeof dailyLogCreateSchema>
export type DailyLogUpdate = z.infer<typeof dailyLogUpdateSchema>

export const isValidDailyLogResponse = (
  data: unknown
): data is DailyLogResponse => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = dailyLogResponseSchema.safeParse(data)
  return result.success
}

export const isValidDailyLogListResponse = (
  data: unknown
): data is DailyLogResponse[] => {
  if (!Array.isArray(data)) return false

  return data.every(
    (item) => dailyLogResponseSchema.safeParse(item).success
  )
}

export class DailyLogResponseError extends Error {
  readonly endpoint?: string

  constructor(message: string, endpoint?: string) {
    super(message)
    this.name = 'DailyLogResponseError'
    this.endpoint = endpoint
    Object.setPrototypeOf(this, DailyLogResponseError.prototype)
  }
}

export const DAILY_LOG_ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid daily log data from server',
  NOT_FOUND: 'Daily log not found',
  ALREADY_EXISTS: 'Daily log already exists for this date',
  FAILED_TO_CREATE: 'Failed to create daily log',
  FAILED_TO_UPDATE: 'Failed to update daily log',
  FAILED_TO_DELETE: 'Failed to delete daily log',
} as const

export const DAILY_LOG_SUCCESS_MESSAGES = {
  CREATED: 'Daily check-in logged!',
  UPDATED: 'Daily log updated',
  DELETED: 'Daily log deleted',
} as const
