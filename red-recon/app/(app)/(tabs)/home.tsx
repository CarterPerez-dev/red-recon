/**
 * @AngelaMos | 2026
 * home.tsx
 */

import { useCycleStatus, usePartner, usePartnerExists, usePhaseInfo } from '@/api/hooks'
import { CyclePhase, PHASE_COLORS, PHASE_LABELS } from '@/api/types'
import { DottedBackground } from '@/shared/components'
import { colors } from '@/theme/tokens'
import { router } from 'expo-router'
import { Bell, CalendarDays, Clock, Droplet, Heart, TrendingUp } from 'lucide-react-native'
import type React from 'react'
import { ActivityIndicator, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Text, XStack, YStack } from 'tamagui'

function PhaseIndicator({
  phase,
  phaseDay,
}: {
  phase: CyclePhase
  phaseDay: number
}): React.ReactElement {
  const phaseColor = PHASE_COLORS[phase] ?? colors.textMuted.val
  const phaseLabel = PHASE_LABELS[phase] ?? 'Unknown'

  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$4"
      padding="$5"
    >
      <XStack alignItems="center" gap="$3" marginBottom="$3">
        <Stack
          width={12}
          height={12}
          borderRadius={6}
          backgroundColor={phaseColor}
        />
        <Text fontSize={18} fontWeight="600" color="$textDefault">
          {phaseLabel} Phase
        </Text>
      </XStack>
      <Text fontSize={14} color="$textLighter">
        Day {phaseDay} of this phase
      </Text>
    </Stack>
  )
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subtext?: string
}): React.ReactElement {
  return (
    <Stack
      flex={1}
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$4"
      padding="$4"
    >
      <XStack alignItems="center" gap="$2" marginBottom="$2">
        {icon}
        <Text fontSize={12} color="$textLighter">
          {label}
        </Text>
      </XStack>
      <Text fontSize={20} fontWeight="600" color="$textDefault">
        {value}
      </Text>
      {subtext && (
        <Text fontSize={12} color="$textMuted" marginTop="$1">
          {subtext}
        </Text>
      )}
    </Stack>
  )
}

function PhaseTip({ tip }: { tip: string }): React.ReactElement {
  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$4"
      padding="$5"
    >
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        <TrendingUp size={16} color={colors.accent.val} />
        <Text fontSize={14} fontWeight="500" color="$textDefault">
          Today's Tip
        </Text>
      </XStack>
      <Text fontSize={14} color="$textLight" lineHeight={20}>
        {tip}
      </Text>
    </Stack>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}): React.ReactElement {
  return (
    <XStack gap="$3" alignItems="flex-start">
      <Stack
        width={36}
        height={36}
        borderRadius={18}
        backgroundColor="$bgSurface200"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Stack>
      <YStack flex={1}>
        <Text fontSize={14} fontWeight="500" color="$textDefault">
          {title}
        </Text>
        <Text fontSize={12} color="$textMuted" marginTop="$1">
          {description}
        </Text>
      </YStack>
    </XStack>
  )
}

function SetupPrompt(): React.ReactElement {
  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <YStack flex={1} padding="$6">
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Stack
              width={64}
              height={64}
              borderRadius={32}
              backgroundColor="$accent"
              alignItems="center"
              justifyContent="center"
              marginBottom="$4"
            >
              <Heart size={32} color={colors.white.val} />
            </Stack>
            <Text
              fontSize={26}
              fontWeight="600"
              color="$textDefault"
              textAlign="center"
              marginBottom="$2"
            >
              Welcome to RedRecon
            </Text>
            <Text
              fontSize={14}
              color="$textLighter"
              textAlign="center"
              marginBottom="$8"
            >
              Understand her cycle, be a better partner.
            </Text>

            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$4"
              padding="$5"
              width="100%"
              maxWidth={340}
              gap="$4"
            >
              <FeatureItem
                icon={<CalendarDays size={18} color={colors.accent.val} />}
                title="Track Her Cycle"
                description="Know what phase she's in and what to expect"
              />
              <FeatureItem
                icon={<Bell size={18} color={colors.accent.val} />}
                title="Get Notified"
                description="Heads up before period, PMS, and ovulation"
              />
              <FeatureItem
                icon={<TrendingUp size={18} color={colors.accent.val} />}
                title="Daily Insights"
                description="Tips for each phase to support her better"
              />
            </Stack>
          </YStack>

          <Stack marginTop="$6">
            <Pressable onPress={() => router.push('/(app)/partner-setup')}>
              <Stack
                backgroundColor="$accent"
                borderRadius="$3"
                paddingVertical="$4"
                alignItems="center"
              >
                <Text fontSize={14} fontWeight="500" color="$white">
                  Get Started
                </Text>
              </Stack>
            </Pressable>
            <Text
              fontSize={12}
              color="$textMuted"
              textAlign="center"
              marginTop="$3"
            >
              Takes less than a minute to set up
            </Text>
          </Stack>
        </YStack>
      </SafeAreaView>
    </DottedBackground>
  )
}

function DashboardContent(): React.ReactElement {
  const { data: partner } = usePartner()
  const { data: cycleStatus, isLoading: cycleLoading } = useCycleStatus()
  const { data: phaseInfo } = usePhaseInfo()

  if (cycleLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={colors.accent.val} />
      </YStack>
    )
  }

  const currentPhaseInfo = phaseInfo?.find(
    (p) => p.phase === cycleStatus?.phase
  )
  const tip = currentPhaseInfo?.tip ?? 'Check back for tips during active tracking.'

  const daysUntilText = cycleStatus?.days_until_period
    ? cycleStatus.days_until_period === 1
      ? '1 day'
      : `${cycleStatus.days_until_period} days`
    : 'N/A'

  return (
    <YStack flex={1} padding="$6">
      <Stack marginBottom="$6">
        <Text
          fontSize={26}
          fontWeight="600"
          color="$textDefault"
          marginBottom="$2"
        >
          {partner?.name ?? 'Partner'}
        </Text>
        <Text fontSize={14} color="$textLighter">
          Cycle Day {cycleStatus?.current_day ?? '--'} of {cycleStatus?.cycle_length ?? '--'}
        </Text>
      </Stack>

      {cycleStatus && (
        <PhaseIndicator
          phase={cycleStatus.phase}
          phaseDay={cycleStatus.phase_day}
        />
      )}

      <XStack gap="$3" marginTop="$4">
        <StatCard
          icon={<Clock size={14} color={colors.textLighter.val} />}
          label="Until Period"
          value={daysUntilText}
          subtext={cycleStatus?.is_period_active ? 'Active now' : undefined}
        />
        <StatCard
          icon={<Droplet size={14} color={colors.textLighter.val} />}
          label="Period Length"
          value={`${partner?.average_period_length ?? '--'} days`}
        />
      </XStack>

      <Stack marginTop="$4">
        <PhaseTip tip={tip} />
      </Stack>

      <Stack marginTop="$4">
        <Pressable onPress={() => router.push('/(app)/(tabs)/calendar')}>
          <Stack
            backgroundColor="$bgSurface100"
            borderWidth={1}
            borderColor="$borderDefault"
            borderRadius="$4"
            padding="$4"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <XStack alignItems="center" gap="$3">
              <CalendarDays size={18} color={colors.textLight.val} />
              <Text fontSize={14} color="$textDefault">
                View Calendar
              </Text>
            </XStack>
            <Text fontSize={12} color="$textMuted">
              Track & Predict
            </Text>
          </Stack>
        </Pressable>
      </Stack>
    </YStack>
  )
}

export default function HomeScreen(): React.ReactElement {
  const { data: partnerExists, isLoading } = usePartnerExists()

  if (isLoading) {
    return (
      <DottedBackground>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={colors.accent.val} />
          </YStack>
        </SafeAreaView>
      </DottedBackground>
    )
  }

  if (!partnerExists) {
    return <SetupPrompt />
  }

  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <DashboardContent />
      </SafeAreaView>
    </DottedBackground>
  )
}
