/**
 * @AngelaMos | 2026
 * cycle.types.ts
 */

import { z } from 'zod'
import { Mood } from './dailyLog.types'

export const CyclePhase = {
  MENSTRUAL: 'menstrual',
  FOLLICULAR: 'follicular',
  OVULATION: 'ovulation',
  LUTEAL: 'luteal',
  UNKNOWN: 'unknown',
} as const

export type CyclePhase = (typeof CyclePhase)[keyof typeof CyclePhase]

export const PHASE_COLORS: Record<CyclePhase, string> = {
  [CyclePhase.MENSTRUAL]: '#dc2626',
  [CyclePhase.FOLLICULAR]: '#f472b6',
  [CyclePhase.OVULATION]: '#fbbf24',
  [CyclePhase.LUTEAL]: '#78716c',
  [CyclePhase.UNKNOWN]: '#525252',
}

export const PHASE_LABELS: Record<CyclePhase, string> = {
  [CyclePhase.MENSTRUAL]: 'Menstrual',
  [CyclePhase.FOLLICULAR]: 'Follicular',
  [CyclePhase.OVULATION]: 'Ovulation',
  [CyclePhase.LUTEAL]: 'Luteal',
  [CyclePhase.UNKNOWN]: 'Unknown',
}

export const cycleStatusSchema = z.object({
  current_day: z.number(),
  cycle_length: z.number(),
  phase: z.nativeEnum(CyclePhase),
  phase_day: z.number(),
  days_until_period: z.number().nullable(),
  predicted_period_start: z.string().nullable(),
  last_period_start: z.string().nullable(),
  is_period_active: z.boolean(),
})

export const phaseInfoSchema = z.object({
  phase: z.nativeEnum(CyclePhase),
  start_day: z.number(),
  end_day: z.number(),
  tip: z.string(),
})

export const calendarDaySchema = z.object({
  date: z.string(),
  cycle_day: z.number().nullable(),
  phase: z.nativeEnum(CyclePhase),
  is_period: z.boolean(),
  is_predicted_period: z.boolean(),
  has_daily_log: z.boolean(),
  mood: z.nativeEnum(Mood).nullable(),
})

export const calendarMonthSchema = z.object({
  year: z.number(),
  month: z.number(),
  days: z.array(calendarDaySchema),
})

export const cyclePatternSchema = z.object({
  average_cycle_length: z.number(),
  cycle_length_range: z.tuple([z.number(), z.number()]),
  average_period_length: z.number(),
  common_symptoms_by_phase: z.record(z.string(), z.array(z.string())),
  mood_trends_by_phase: z.record(z.string(), z.string().nullable()),
})

export type CycleStatus = z.infer<typeof cycleStatusSchema>
export type PhaseInfo = z.infer<typeof phaseInfoSchema>
export type CalendarDay = z.infer<typeof calendarDaySchema>
export type CalendarMonth = z.infer<typeof calendarMonthSchema>
export type CyclePattern = z.infer<typeof cyclePatternSchema>

export const isValidCycleStatus = (data: unknown): data is CycleStatus => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = cycleStatusSchema.safeParse(data)
  return result.success
}

export const isValidCalendarMonth = (data: unknown): data is CalendarMonth => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = calendarMonthSchema.safeParse(data)
  return result.success
}

export const isValidPhaseInfoList = (data: unknown): data is PhaseInfo[] => {
  if (!Array.isArray(data)) return false

  return data.every((item) => phaseInfoSchema.safeParse(item).success)
}

export const isValidCyclePattern = (data: unknown): data is CyclePattern => {
  if (data === null || data === undefined) return false
  if (typeof data !== 'object') return false

  const result = cyclePatternSchema.safeParse(data)
  return result.success
}

export class CycleResponseError extends Error {
  readonly endpoint?: string

  constructor(message: string, endpoint?: string) {
    super(message)
    this.name = 'CycleResponseError'
    this.endpoint = endpoint
    Object.setPrototypeOf(this, CycleResponseError.prototype)
  }
}

export const CYCLE_ERROR_MESSAGES = {
  INVALID_STATUS_RESPONSE: 'Invalid cycle status from server',
  INVALID_CALENDAR_RESPONSE: 'Invalid calendar data from server',
  INVALID_PATTERN_RESPONSE: 'Invalid pattern data from server',
  PARTNER_NOT_FOUND: 'Partner profile required for cycle data',
} as const
