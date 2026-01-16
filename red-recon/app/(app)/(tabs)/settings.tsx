/**
 * @AngelaMos | 2026
 * settings.tsx
 */

import { useCurrentUser, useLogout, usePartner } from '@/api/hooks'
import { useBiometricsEnabled, useUIStore } from '@/core/lib'
import { DottedBackground } from '@/shared/components'
import { getBiometricLabel, useBiometrics } from '@/shared/hooks'
import { haptics } from '@/shared/utils'
import { colors } from '@/theme/tokens'
import { router } from 'expo-router'
import { ChevronRight, Heart, LogOut, Shield, User } from 'lucide-react-native'
import type React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Switch, Text, XStack, YStack } from 'tamagui'

function SettingsRow({
  icon,
  label,
  subtitle,
  onPress,
  rightElement,
  isDestructive,
}: {
  icon: React.ReactNode
  label: string
  subtitle?: string
  onPress?: () => void
  rightElement?: React.ReactNode
  isDestructive?: boolean
}): React.ReactElement {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingVertical="$4"
      paddingHorizontal="$4"
      pressStyle={onPress ? { backgroundColor: '$bgSurface75' } : undefined}
      onPress={onPress}
    >
      <XStack alignItems="center" gap="$3" flex={1}>
        <Stack
          width={36}
          height={36}
          borderRadius="$2"
          backgroundColor={isDestructive ? 'rgba(220, 38, 38, 0.12)' : '$bgSurface200'}
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Stack>
        <YStack flex={1}>
          <Text
            fontSize={15}
            fontWeight="500"
            color={isDestructive ? '$errorDefault' : '$textDefault'}
            fontFamily="$body"
          >
            {label}
          </Text>
          {subtitle && (
            <Text fontSize={12} color="$textMuted" fontFamily="$body" marginTop="$1">
              {subtitle}
            </Text>
          )}
        </YStack>
      </XStack>
      {rightElement ??
        (onPress && <ChevronRight size={18} color={colors.textMuted.val} />)}
    </Stack>
  )
}

export default function SettingsScreen(): React.ReactElement {
  const logout = useLogout()
  const { data: user } = useCurrentUser()
  const { data: partner } = usePartner()
  const { biometryType, isAvailable, isEnrolled } = useBiometrics()
  const biometricsEnabled = useBiometricsEnabled()
  const setBiometricsEnabled = useUIStore((s) => s.setBiometricsEnabled)

  const handleLogout = (): void => {
    haptics.medium()
    logout.mutate()
  }

  const handleBiometricsToggle = (enabled: boolean): void => {
    haptics.selection()
    setBiometricsEnabled(enabled)
  }

  const canUseBiometrics = isAvailable && isEnrolled

  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <YStack flex={1} padding="$5">
          <YStack marginBottom="$6">
            <YStack>
              <Text
                fontSize={28}
                fontWeight="700"
                color="$textDefault"
                fontFamily="$heading"
                letterSpacing={-0.5}
              >
                Settings
              </Text>
              <Stack
                width={32}
                height={3}
                backgroundColor="$accent"
                borderRadius="$1"
                marginTop="$1.5"
              />
            </YStack>
            <Text fontSize={14} color="$textLight" fontFamily="$body" marginTop="$2">
              {user?.email}
            </Text>
          </YStack>

          <YStack gap="$4">
            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$3"
              overflow="hidden"
            >
              <SettingsRow
                icon={<User size={18} color={colors.textLight.val} />}
                label="Profile"
                subtitle="View and edit your account"
                onPress={() => router.push('/(app)/profile')}
              />
            </Stack>

            {partner && (
              <Stack
                backgroundColor="$bgSurface100"
                borderWidth={1}
                borderColor="$borderDefault"
                borderRadius="$3"
                overflow="hidden"
              >
                <Stack
                  paddingVertical="$2"
                  paddingHorizontal="$4"
                  backgroundColor="$bgSurface200"
                >
                  <Text
                    fontSize={11}
                    color="$textMuted"
                    fontWeight="600"
                    fontFamily="$body"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                  >
                    Partner
                  </Text>
                </Stack>
                <SettingsRow
                  icon={<Heart size={18} color={colors.accent.val} />}
                  label={partner.name}
                  subtitle="Edit cycle settings"
                  onPress={() => router.push('/(app)/partner-edit')}
                />
              </Stack>
            )}

            {canUseBiometrics && (
              <Stack
                backgroundColor="$bgSurface100"
                borderWidth={1}
                borderColor="$borderDefault"
                borderRadius="$3"
                overflow="hidden"
              >
                <Stack
                  paddingVertical="$2"
                  paddingHorizontal="$4"
                  backgroundColor="$bgSurface200"
                >
                  <Text
                    fontSize={11}
                    color="$textMuted"
                    fontWeight="600"
                    fontFamily="$body"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                  >
                    Security
                  </Text>
                </Stack>
                <SettingsRow
                  icon={<Shield size={18} color={colors.textLight.val} />}
                  label={`${getBiometricLabel(biometryType)} Lock`}
                  subtitle="Require authentication to open"
                  rightElement={
                    <Switch
                      size="$4"
                      checked={biometricsEnabled}
                      onCheckedChange={handleBiometricsToggle}
                      backgroundColor={biometricsEnabled ? colors.accent.val : colors.bgSurface200.val}
                      borderWidth={1}
                      borderColor={biometricsEnabled ? colors.accent.val : colors.borderDefault.val}
                      width={52}
                      height={28}
                    >
                      <Switch.Thumb
                        backgroundColor={colors.white.val}
                        animation="quick"
                        width={24}
                        height={24}
                      />
                    </Switch>
                  }
                />
              </Stack>
            )}

            <Stack marginTop="$4">
              <Stack
                backgroundColor="$bgSurface100"
                borderWidth={1}
                borderColor="$borderDefault"
                borderRadius="$3"
                overflow="hidden"
              >
                <SettingsRow
                  icon={<LogOut size={18} color={colors.errorDefault.val} />}
                  label="Logout"
                  subtitle="Sign out of your account"
                  onPress={handleLogout}
                  isDestructive
                />
              </Stack>
            </Stack>
          </YStack>
        </YStack>
      </SafeAreaView>
    </DottedBackground>
  )
}
