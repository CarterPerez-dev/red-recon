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
  [CyclePhase.FOLLICULAR]: '#ec4899',
  [CyclePhase.OVULATION]: '#f59e0b',
  [CyclePhase.LUTEAL]: '#64748b',
  [CyclePhase.UNKNOWN]: '#525252',
}

export const PHASE_BG_COLORS: Record<CyclePhase, string> = {
  [CyclePhase.MENSTRUAL]: 'rgba(220, 38, 38, 0.12)',
  [CyclePhase.FOLLICULAR]: 'rgba(236, 72, 153, 0.10)',
  [CyclePhase.OVULATION]: 'rgba(245, 158, 11, 0.12)',
  [CyclePhase.LUTEAL]: 'rgba(100, 116, 139, 0.10)',
  [CyclePhase.UNKNOWN]: 'rgba(82, 82, 82, 0.10)',
}

export const PHASE_LABELS: Record<CyclePhase, string> = {
  [CyclePhase.MENSTRUAL]: 'Menstrual',
  [CyclePhase.FOLLICULAR]: 'Follicular',
  [CyclePhase.OVULATION]: 'Ovulation',
  [CyclePhase.LUTEAL]: 'Luteal',
  [CyclePhase.UNKNOWN]: 'Unknown',
}

export const DEFCON_LEVELS: Record<CyclePhase, { level: number; label: string }> = {
  [CyclePhase.MENSTRUAL]: { level: 1, label: 'DEFCON 1' },
  [CyclePhase.LUTEAL]: { level: 2, label: 'DEFCON 2' },
  [CyclePhase.OVULATION]: { level: 3, label: 'DEFCON 3' },
  [CyclePhase.FOLLICULAR]: { level: 5, label: 'DEFCON 5' },
  [CyclePhase.UNKNOWN]: { level: 4, label: 'DEFCON ?' },
}

export const PHASE_CODENAMES: Record<CyclePhase, string> = {
  [CyclePhase.MENSTRUAL]: 'CODE RED',
  [CyclePhase.FOLLICULAR]: 'MAIN CHARACTER ERA',
  [CyclePhase.OVULATION]: 'THE GLOW UP',
  [CyclePhase.LUTEAL]: 'STORM WARNING',
  [CyclePhase.UNKNOWN]: 'UNCHARTED TERRITORY',
}

export const PHASE_DESCRIPTIONS: Record<CyclePhase, string> = {
  [CyclePhase.MENSTRUAL]: "she's literally going through it and you're asking what's for dinner? read the room bestie",
  [CyclePhase.FOLLICULAR]: "she's in her bag rn. this is your window. plan dates. be cute. she might actually laugh at your mid jokes",
  [CyclePhase.OVULATION]: "she's glowing but also... biology is biologying. compliments hit different rn, gas her up king",
  [CyclePhase.LUTEAL]: "PMS has entered the chat. the vibes are giving immaculate-to-unhinged pipeline speedrun",
  [CyclePhase.UNKNOWN]: "no intel available. you're flying blind soldier. godspeed",
}

export const TACTICAL_TIPS: Record<CyclePhase, string[]> = {
  [CyclePhase.MENSTRUAL]: [
    "heating pad is NOT optional, it's a war crime to hide it",
    "if she says she's fine, she is in fact not fine",
    "chocolate is a human right rn, not a suggestion",
    "do NOT ask why she's emotional. just don't. trust.",
    "the couch has your name on it if you fumble this",
    "cramps are literally her organs fighting for their life",
    "whatever she wants to watch, that's what we're watching",
    "exist near her quietly. like furniture. be a lamp.",
  ],
  [CyclePhase.FOLLICULAR]: [
    "she's actually thriving, this is literally the best she'll feel all month",
    "plan something cute rn or forever hold your L",
    "her patience is maxed out, spend it wisely",
    "her ick radar is temporarily offline. move smart.",
    "she might even think you're funny rn, don't waste it",
    "gym era? career era? she's locked in, match the energy",
    "compliments are welcome but she already knows she's that girl",
    "this is your redemption arc window, don't blow it",
  ],
  [CyclePhase.OVULATION]: [
    "she's feeling herself and honestly? same",
    "fertility window is open btw just putting that out there",
    "she's in her hot girl era, act accordingly",
    "attention will be well received, give her the spotlight",
    "her confidence is through the roof, don't make it weird",
    "yes she looks good. yes you should say it. out loud. with words.",
    "she's radiating, you're just existing near greatness",
    "romantic gestures? now's the time. she's receptive.",
  ],
  [CyclePhase.LUTEAL]: [
    "snacks. just... snacks. don't ask just provide",
    "everything you say can and will be held against you",
    "her wanting to scream at the toaster for existing? valid",
    "she's not being dramatic, YOU'RE being dramatic",
    "bloating is real and if you mention it you're dead to her",
    "the emotional rollercoaster has left the station, buckle up",
    "comfort food is medicine. ice cream is therapy.",
    "agree with everything. even the unhinged takes. especially those.",
    "she knows she's being irrational. don't point it out.",
    "this too shall pass but rn? we're in the trenches.",
  ],
  [CyclePhase.UNKNOWN]: [
    "we have no intel. sending thoughts and prayers.",
    "observe and adapt. trust your instincts.",
    "when in doubt, snacks are always the answer",
    "proceed with caution, this is uncharted territory",
  ],
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
