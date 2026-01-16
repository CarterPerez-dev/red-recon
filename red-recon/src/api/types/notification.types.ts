/**
 * @AngelaMos | 2026
 * notification.types.ts
 */

export const NotificationType = {
  PERIOD_REMINDER: 'period_reminder',
  PMS_ALERT: 'pms_alert',
  OVULATION_ALERT: 'ovulation_alert',
} as const

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType]

export const NOTIFICATION_IDENTIFIERS = {
  PERIOD_REMINDER: 'red-recon-period-reminder',
  PMS_ALERT: 'red-recon-pms-alert',
  OVULATION_ALERT: 'red-recon-ovulation-alert',
} as const

export interface NotificationConfig {
  type: NotificationType
  identifier: string
  title: string
  body: string
  triggerDate: Date
}

export const NOTIFICATION_CONTENT = {
  [NotificationType.PERIOD_REMINDER]: {
    title: 'CODE RED IMMINENT',
    bodyTemplate: (days: number) =>
      days === 1
        ? "this is not a drill. period starts TOMORROW. acquire snacks or perish."
        : `T-minus ${days} days. stock up on chocolate and emotional resilience. godspeed.`,
  },
  [NotificationType.PMS_ALERT]: {
    title: 'DEFCON 2 - STORM WARNING',
    body: "PMS has entered the chat. everything you say will be held against you. tread lightly king.",
  },
  [NotificationType.OVULATION_ALERT]: {
    title: 'THE GLOW UP ERA',
    body: "she's in her hot girl phase. compliments are mandatory. don't be weird about it.",
  },
} as const
