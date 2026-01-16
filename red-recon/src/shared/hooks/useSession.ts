/**
 * @AngelaMos | 2026
 * useSession.ts
 */

import { getAccessToken, setAccessToken } from '@/core/api/api.config'
import { API_ENDPOINTS } from '@/core/config'
import { useAuthStore } from '@/core/lib'
import { SECURE_KEYS, secureStorage } from '@/core/storage'
import axios from 'axios'
import { useEffect, useState } from 'react'

const YOUR_DEV_IP = '192.168.1.167'
const YOUR_DEV_PORT = '8501'
const YOUR_PROD_API_URL = 'https://api.carterperez-dev.com'

const getBaseURL = (): string => {
  if (__DEV__) {
    return `http://${YOUR_DEV_IP}:${YOUR_DEV_PORT}`
  }
  return YOUR_PROD_API_URL
}

interface UseSessionReturn {
  isAuthenticated: boolean
  isLoading: boolean
  hasHydrated: boolean
  isReady: boolean
}

export const useSession = (): UseSessionReturn => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const logout = useAuthStore((s) => s.logout)
  const [isRestoringSession, setIsRestoringSession] = useState(true)

  useEffect(() => {
    const restoreSession = async (): Promise<void> => {
      if (!hasHydrated) return

      if (isAuthenticated && getAccessToken() === null) {
        try {
          const refreshToken = await secureStorage.getItem(SECURE_KEYS.REFRESH_TOKEN)

          if (!refreshToken) {
            logout()
            setIsRestoringSession(false)
            return
          }

          const response = await axios.post<{ access_token: string; refresh_token: string }>(
            `${getBaseURL()}${API_ENDPOINTS.AUTH.REFRESH_MOBILE}`,
            { refresh_token: refreshToken }
          )

          if (response.data?.access_token) {
            setAccessToken(response.data.access_token)
            if (response.data.refresh_token) {
              await secureStorage.setItem(SECURE_KEYS.REFRESH_TOKEN, response.data.refresh_token)
            }
          } else {
            logout()
          }
        } catch {
          logout()
        }
      }

      setIsRestoringSession(false)
    }

    restoreSession()
  }, [hasHydrated, isAuthenticated, logout])

  const isReady = hasHydrated && !isLoading && !isRestoringSession

  return {
    isAuthenticated,
    isLoading,
    hasHydrated,
    isReady,
  }
}

export const useRequireAuth = (): boolean => {
  const { isAuthenticated, isReady } = useSession()
  return isReady && isAuthenticated
}

export const useIsGuest = (): boolean => {
  const { isAuthenticated, isReady } = useSession()
  return isReady && !isAuthenticated
}
