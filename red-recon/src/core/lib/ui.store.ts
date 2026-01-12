/**
 * @AngelaMos | 2026
 * ui.store.ts
 */

import { zustandStorage } from '@/core/storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UIState {
  biometricsEnabled: boolean
}

interface UIActions {
  setBiometricsEnabled: (enabled: boolean) => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      biometricsEnabled: false,

      setBiometricsEnabled: (enabled) => set({ biometricsEnabled: enabled }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

export const useBiometricsEnabled = (): boolean =>
  useUIStore((s) => s.biometricsEnabled)
