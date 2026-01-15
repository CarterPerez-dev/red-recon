/**
 * @AngelaMos | 2026
 * useNotifications.ts
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import { useCycleStatus, usePartner } from '@/api/hooks'
import {
  requestNotificationPermissions,
  scheduleAllNotifications,
  cancelAllScheduledNotifications,
} from '@/core/notifications'

export interface UseNotificationsResult {
  permissionGranted: boolean
  isScheduling: boolean
  rescheduleNotifications: () => Promise<void>
}

export function useNotifications(): UseNotificationsResult {
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const hasRequestedPermission = useRef(false)

  const { data: cycleStatus } = useCycleStatus()
  const { data: partner } = usePartner()

  useEffect(() => {
    if (hasRequestedPermission.current) return
    hasRequestedPermission.current = true

    const requestPermissions = async (): Promise<void> => {
      const granted = await requestNotificationPermissions()
      setPermissionGranted(granted)
    }

    requestPermissions()
  }, [])

  const rescheduleNotifications = useCallback(async (): Promise<void> => {
    if (!permissionGranted || !cycleStatus || !partner) {
      return
    }

    setIsScheduling(true)

    try {
      const hasAnyEnabled =
        partner.notification_period_reminder ||
        partner.notification_pms_alert ||
        partner.notification_ovulation_alert

      if (hasAnyEnabled) {
        await scheduleAllNotifications(cycleStatus, partner)
      } else {
        await cancelAllScheduledNotifications()
      }
    } finally {
      setIsScheduling(false)
    }
  }, [cycleStatus, partner, permissionGranted])

  useEffect(() => {
    if (!permissionGranted || !cycleStatus || !partner) {
      return
    }

    rescheduleNotifications()
  }, [cycleStatus, partner, permissionGranted, rescheduleNotifications])

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus): void => {
      if (nextState === 'active' && permissionGranted && cycleStatus && partner) {
        rescheduleNotifications()
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [cycleStatus, partner, permissionGranted, rescheduleNotifications])

  return {
    permissionGranted,
    isScheduling,
    rescheduleNotifications,
  }
}
