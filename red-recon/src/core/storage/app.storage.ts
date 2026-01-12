// ===================
// © AngelaMos | 2026
// app.storage.ts
// ===================

import AsyncStorage from '@react-native-async-storage/async-storage'
import type { StateStorage } from 'zustand/middleware'

export const zustandStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(name)
    return value ?? null
  },

  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value)
  },

  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name)
  },
}

export const queryClientStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(key)
    return value ?? null
  },

  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value)
  },

  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key)
  },
}
