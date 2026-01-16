/**
 * @AngelaMos | 2026
 * _layout.tsx
 */

import {
  queryClient,
  queryClientPersister,
  setAuthFailureHandler,
} from '@/core/api'
import { useAuthStore } from '@/core/lib'
import { useAppStateFocusManager, useOnlineManager } from '@/shared/hooks'
import { colors } from '@/theme/tokens'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import * as SplashScreen from 'expo-splash-screen'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import type React from 'react'
import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TamaguiProvider } from 'tamagui'
import config from '../tamagui.config'

SplashScreen.preventAutoHideAsync()

function AppProviders({
  children,
}: { children: React.ReactNode }): React.ReactElement {
  useAppStateFocusManager()
  useOnlineManager()

  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    setAuthFailureHandler(() => {
      logout()
    })
  }, [logout])

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: queryClientPersister }}
      >
        {children}
      </PersistQueryClientProvider>
    </TamaguiProvider>
  )
}

export default function RootLayout(): React.ReactElement | null {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgDefault.val }}>
        <ActivityIndicator size="large" color={colors.accent.val} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProviders>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bgDefault.val },
              animation: 'fade',
            }}
          />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
