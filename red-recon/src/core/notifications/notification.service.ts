/**
 * @AngelaMos | 2026
 * notification.service.ts
 */

import { Platform } from 'react-native'
import type { CycleStatus, PartnerResponse } from '@/api/types'
import {
  NOTIFICATION_CONTENT,
  NOTIFICATION_IDENTIFIERS,
  NotificationType,
  type NotificationConfig,
} from '@/api/types'

let Notifications: typeof import('expo-notifications') | null = null
let isNativeModuleAvailable = false

try {
  const NotificationsModule = require('expo-notifications')
  Notifications = NotificationsModule
  isNativeModuleAvailable = true

  NotificationsModule.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })
} catch {
  console.warn('expo-notifications native module not available (Expo Go). Build a dev client for notifications.')
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!isNativeModuleAvailable || !Notifications) {
    return false
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()

  if (existingStatus === 'granted') {
    return true
  }

  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  if (!isNativeModuleAvailable || !Notifications) {
    return
  }

  await Notifications.cancelAllScheduledNotificationsAsync()
}

export async function cancelNotificationByIdentifier(
  identifier: string
): Promise<void> {
  if (!isNativeModuleAvailable || !Notifications) {
    return
  }

  await Notifications.cancelScheduledNotificationAsync(identifier)
}

export async function scheduleNotification(
  config: NotificationConfig
): Promise<string | null> {
  if (!isNativeModuleAvailable || !Notifications) {
    return null
  }

  const now = new Date()

  if (config.triggerDate <= now) {
    return null
  }

  const identifier = await Notifications.scheduleNotificationAsync({
    identifier: config.identifier,
    content: {
      title: config.title,
      body: config.body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: config.triggerDate,
    },
  })

  return identifier
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function setTimeToMorning(date: Date): Date {
  const result = new Date(date)
  result.setHours(9, 0, 0, 0)
  return result
}

export function calculateNotificationsFromCycleData(
  cycleStatus: CycleStatus,
  partner: PartnerResponse
): NotificationConfig[] {
  const notifications: NotificationConfig[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (
    partner.notification_period_reminder &&
    cycleStatus.predicted_period_start &&
    cycleStatus.days_until_period !== null
  ) {
    const predictedStart = new Date(cycleStatus.predicted_period_start)
    const reminderDate = addDays(predictedStart, -partner.reminder_days_before)

    if (reminderDate > today) {
      const content = NOTIFICATION_CONTENT[NotificationType.PERIOD_REMINDER]
      notifications.push({
        type: NotificationType.PERIOD_REMINDER,
        identifier: NOTIFICATION_IDENTIFIERS.PERIOD_REMINDER,
        title: content.title,
        body: content.bodyTemplate(partner.reminder_days_before),
        triggerDate: setTimeToMorning(reminderDate),
      })
    }
  }

  if (
    partner.notification_pms_alert &&
    cycleStatus.last_period_start &&
    cycleStatus.cycle_length
  ) {
    const lastPeriod = new Date(cycleStatus.last_period_start)
    const ovulationDay = cycleStatus.cycle_length - 14
    const lutealStartDay = ovulationDay + 2
    const lutealDate = addDays(lastPeriod, lutealStartDay - 1)

    if (lutealDate > today) {
      const content = NOTIFICATION_CONTENT[NotificationType.PMS_ALERT]
      notifications.push({
        type: NotificationType.PMS_ALERT,
        identifier: NOTIFICATION_IDENTIFIERS.PMS_ALERT,
        title: content.title,
        body: content.body,
        triggerDate: setTimeToMorning(lutealDate),
      })
    }
  }

  if (
    partner.notification_ovulation_alert &&
    cycleStatus.last_period_start &&
    cycleStatus.cycle_length
  ) {
    const lastPeriod = new Date(cycleStatus.last_period_start)
    const ovulationDay = cycleStatus.cycle_length - 14
    const ovulationDate = addDays(lastPeriod, ovulationDay - 1)

    if (ovulationDate > today) {
      const content = NOTIFICATION_CONTENT[NotificationType.OVULATION_ALERT]
      notifications.push({
        type: NotificationType.OVULATION_ALERT,
        identifier: NOTIFICATION_IDENTIFIERS.OVULATION_ALERT,
        title: content.title,
        body: content.body,
        triggerDate: setTimeToMorning(ovulationDate),
      })
    }
  }

  return notifications
}

export async function scheduleAllNotifications(
  cycleStatus: CycleStatus,
  partner: PartnerResponse
): Promise<void> {
  await cancelAllScheduledNotifications()

  const notifications = calculateNotificationsFromCycleData(cycleStatus, partner)

  for (const notification of notifications) {
    await scheduleNotification(notification)
  }
}
