/**
 * @AngelaMos | 2026
 * achievement.types.ts
 */

export const AchievementId = {
  FIRST_LOG: 'first_log',
  WEEK_STREAK: 'week_streak',
  MONTH_SURVIVOR: 'month_survivor',
  SNACK_PROVIDER: 'snack_provider',
  SILENT_WARRIOR: 'silent_warrior',
  EMOTIONAL_SUPPORT: 'emotional_support',
  CRAMP_RESPONDER: 'cramp_responder',
  COMPLIMENT_KING: 'compliment_king',
  SURVIVED_PMS: 'survived_pms',
  CYCLE_SCHOLAR: 'cycle_scholar',
  NO_FUMBLES: 'no_fumbles',
  VETERAN: 'veteran',
} as const

export type AchievementId = (typeof AchievementId)[keyof typeof AchievementId]

export interface Achievement {
  id: AchievementId
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
}

export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'id' | 'unlockedAt'>> = {
  [AchievementId.FIRST_LOG]: {
    title: 'Baby Steps',
    description: "logged your first entry. you're officially in this now.",
    icon: 'baby',
    rarity: 'common',
  },
  [AchievementId.WEEK_STREAK]: {
    title: 'Consistency King',
    description: '7 days of logging. more reliable than her ex fr.',
    icon: 'flame',
    rarity: 'common',
  },
  [AchievementId.MONTH_SURVIVOR]: {
    title: 'Full Cycle Survivor',
    description: 'made it through an entire cycle. you lived to tell the tale.',
    icon: 'trophy',
    rarity: 'rare',
  },
  [AchievementId.SNACK_PROVIDER]: {
    title: 'Snack Sommelier',
    description: 'logged snack provision during code red. essential service.',
    icon: 'cookie',
    rarity: 'common',
  },
  [AchievementId.SILENT_WARRIOR]: {
    title: 'Silent but Supportive',
    description: 'successfully existed near her without being annoying. rare skill.',
    icon: 'volume-x',
    rarity: 'rare',
  },
  [AchievementId.EMOTIONAL_SUPPORT]: {
    title: 'Emotional Support BF',
    description: "was there during a breakdown. didn't try to fix it. just vibed.",
    icon: 'heart-handshake',
    rarity: 'epic',
  },
  [AchievementId.CRAMP_RESPONDER]: {
    title: 'First Responder',
    description: 'deployed heating pad within 60 seconds. hero behavior.',
    icon: 'siren',
    rarity: 'rare',
  },
  [AchievementId.COMPLIMENT_KING]: {
    title: 'Compliment Royalty',
    description: "said 'you look amazing' without hesitation. no cap detected.",
    icon: 'crown',
    rarity: 'common',
  },
  [AchievementId.SURVIVED_PMS]: {
    title: 'Storm Chaser',
    description: 'survived DEFCON 2 with relationship intact. built different.',
    icon: 'cloud-lightning',
    rarity: 'epic',
  },
  [AchievementId.CYCLE_SCHOLAR]: {
    title: 'Cycle Scholar',
    description: 'you actually understand what luteal means now. growth.',
    icon: 'graduation-cap',
    rarity: 'rare',
  },
  [AchievementId.NO_FUMBLES]: {
    title: 'Zero Fumbles',
    description: "went an entire period without saying something dumb. legendary.",
    icon: 'shield-check',
    rarity: 'legendary',
  },
  [AchievementId.VETERAN]: {
    title: 'Battle Hardened',
    description: '6 months of active duty. you are the support she deserves.',
    icon: 'medal',
    rarity: 'legendary',
  },
}

export const RARITY_COLORS = {
  common: '#64748b',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
} as const

export const RARITY_BG_COLORS = {
  common: 'rgba(100, 116, 139, 0.12)',
  rare: 'rgba(59, 130, 246, 0.12)',
  epic: 'rgba(139, 92, 246, 0.12)',
  legendary: 'rgba(245, 158, 11, 0.15)',
} as const

export const RARITY_LABELS = {
  common: 'COMMON',
  rare: 'RARE',
  epic: 'EPIC',
  legendary: 'LEGENDARY',
} as const
