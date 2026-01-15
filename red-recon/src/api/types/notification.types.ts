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
    title: 'Period Incoming',
    bodyTemplate: (days: number) =>
      days === 1
        ? "Her period starts tomorrow. Stock check: supplies, snacks, patience."
        : `T-minus ${days} days until her period. Time to prepare.`,
  },
  [NotificationType.PMS_ALERT]: {
    title: 'PMS Zone Ahead',
    body: "Luteal phase starting. Extra patience and chocolate recommended.",
  },
  [NotificationType.OVULATION_ALERT]: {
    title: 'Ovulation Window',
    body: "Peak fertility time. Good vibes and energy levels.",
  },
} as const
