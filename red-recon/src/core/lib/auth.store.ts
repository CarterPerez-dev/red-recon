/**
 * @AngelaMos | 2026
 * auth.store.ts
 */

import { type UserResponse, UserRole } from '@/api/types'
import { zustandStorage } from '@/core/storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const YOUR_STORAGE_KEY = 'redrecon-auth'

interface AuthState {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  hasHydrated: boolean
}

interface AuthActions {
  login: (user: UserResponse) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (updates: Partial<UserResponse>) => void
  setHasHydrated: (hydrated: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      hasHydrated: false,

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user !== null ? { ...state.user, ...updates } : null,
        })),

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: YOUR_STORAGE_KEY,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) =>
        ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }) as AuthStore,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        state?.setLoading(false)
      },
    }
  )
)

export const useUser = (): UserResponse | null => useAuthStore((s) => s.user)
export const useIsAuthenticated = (): boolean =>
  useAuthStore((s) => s.isAuthenticated)
export const useIsAuthLoading = (): boolean => useAuthStore((s) => s.isLoading)
export const useHasHydrated = (): boolean => useAuthStore((s) => s.hasHydrated)

export const useHasRole = (role: UserRole): boolean => {
  const user = useAuthStore((s) => s.user)
  return user !== null && user.role === role
}

export const useIsAdmin = (): boolean => {
  const user = useAuthStore((s) => s.user)
  return user !== null && user.role === UserRole.ADMIN
}

export { UserRole }
