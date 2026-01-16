/**
 * @AngelaMos | 2026
 * home.tsx
 */

import { useCycleStatus, usePartner, usePartnerExists } from '@/api/hooks'
import {
  CyclePhase,
  DEFCON_LEVELS,
  PHASE_BG_COLORS,
  PHASE_CODENAMES,
  PHASE_COLORS,
  PHASE_DESCRIPTIONS,
  TACTICAL_TIPS,
} from '@/api/types'
import { DottedBackground } from '@/shared/components'
import { colors } from '@/theme/tokens'
import { router } from 'expo-router'
import { AlertTriangle, Bell, CalendarDays, ChevronRight, Clock, Droplet, Heart, Shield, TrendingUp, Trophy } from 'lucide-react-native'
import type React from 'react'
import { useMemo } from 'react'
import { ActivityIndicator, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Text, XStack, YStack } from 'tamagui'

function DefconCard({
  phase,
  phaseDay,
}: {
  phase: CyclePhase
  phaseDay: number
}): React.ReactElement {
  const phaseColor = PHASE_COLORS[phase] ?? colors.textMuted.val
  const phaseBg = PHASE_BG_COLORS[phase] ?? 'transparent'
  const defcon = DEFCON_LEVELS[phase]
  const codename = PHASE_CODENAMES[phase]
  const description = PHASE_DESCRIPTIONS[phase]

  return (
    <Stack
      backgroundColor={phaseBg}
      borderWidth={1}
      borderColor={phaseColor}
      borderRadius="$3"
      padding="$5"
    >
      <XStack alignItems="center" justifyContent="space-between" marginBottom="$3">
        <XStack alignItems="center" gap="$2">
          <AlertTriangle size={16} color={phaseColor} />
          <Text fontSize={13} fontWeight="700" color={phaseColor} fontFamily="$heading" letterSpacing={1}>
            {defcon.label}
          </Text>
        </XStack>
        <Stack
          backgroundColor={phaseColor}
          paddingVertical="$1"
          paddingHorizontal="$2.5"
          borderRadius="$1"
        >
          <Text fontSize={10} fontWeight="700" color="$white" fontFamily="$body" letterSpacing={0.5}>
            DAY {phaseDay}
          </Text>
        </Stack>
      </XStack>

      <Text fontSize={18} fontWeight="700" color="$textDefault" fontFamily="$heading" marginBottom="$2">
        {codename}
      </Text>

      <Text fontSize={13} color="$textLight" fontFamily="$body" lineHeight={19}>
        {description}
      </Text>
    </Stack>
  )
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}): React.ReactElement {
  return (
    <Stack
      flex={1}
      backgroundColor={highlight ? '$accentSubtle' : '$bgSurface100'}
      borderWidth={1}
      borderColor={highlight ? '$accentBorder' : '$borderDefault'}
      borderRadius="$3"
      padding="$4"
    >
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        {icon}
        <Text fontSize={12} color="$textMuted" fontFamily="$body" textTransform="uppercase" letterSpacing={0.5}>
          {label}
        </Text>
      </XStack>
      <Text
        fontSize={26}
        fontWeight="700"
        color={highlight ? '$accent' : '$textDefault'}
        fontFamily="$heading"
        letterSpacing={-0.5}
      >
        {value}
      </Text>
    </Stack>
  )
}

function TacticalIntelCard({ phase }: { phase?: CyclePhase }): React.ReactElement {
  const phaseColor = phase ? PHASE_COLORS[phase] : colors.accent.val
  const tips = phase ? TACTICAL_TIPS[phase] : TACTICAL_TIPS[CyclePhase.UNKNOWN]

  const randomTip = useMemo(() => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const index = seed % tips.length
    return tips[index]
  }, [tips])

  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$3"
      padding="$5"
      borderLeftWidth={3}
      borderLeftColor={phaseColor}
    >
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        <Shield size={16} color={phaseColor} />
        <Text fontSize={12} fontWeight="700" color={phaseColor} fontFamily="$body" letterSpacing={1}>
          TACTICAL INTEL
        </Text>
      </XStack>
      <Text fontSize={14} color="$textLight" lineHeight={21} fontFamily="$body">
        {randomTip}
      </Text>
    </Stack>
  )
}

function QuickAction({
  icon,
  label,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode
  label: string
  subtitle: string
  onPress: () => void
}): React.ReactElement {
  return (
    <Pressable onPress={onPress}>
      <Stack
        backgroundColor="$bgSurface100"
        borderWidth={1}
        borderColor="$borderDefault"
        borderRadius="$3"
        padding="$4"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" gap="$3" flex={1}>
          <Stack
            width={40}
            height={40}
            borderRadius="$2"
            backgroundColor="$bgSurface200"
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </Stack>
          <YStack flex={1}>
            <Text fontSize={15} fontWeight="500" color="$textDefault" fontFamily="$body">
              {label}
            </Text>
            <Text fontSize={12} color="$textMuted" fontFamily="$body">
              {subtitle}
            </Text>
          </YStack>
        </XStack>
        <ChevronRight size={18} color={colors.textMuted.val} />
      </Stack>
    </Pressable>
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
    <XStack gap="$4" alignItems="flex-start">
      <Stack
        width={44}
        height={44}
        borderRadius="$2"
        backgroundColor="$accentSubtle"
        borderWidth={1}
        borderColor="$accentBorder"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Stack>
      <YStack flex={1}>
        <Text fontSize={15} fontWeight="600" color="$textDefault" fontFamily="$body">
          {title}
        </Text>
        <Text fontSize={13} color="$textLight" marginTop="$1" fontFamily="$body" lineHeight={18}>
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
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Stack
              width={72}
              height={72}
              borderRadius={36}
              backgroundColor="$accent"
              alignItems="center"
              justifyContent="center"
              marginBottom="$5"
            >
              <Heart size={36} color={colors.white.val} />
            </Stack>

            <Text
              fontSize={28}
              fontWeight="700"
              color="$textDefault"
              textAlign="center"
              marginBottom="$2"
              fontFamily="$heading"
              letterSpacing={-0.5}
            >
              Welcome to RedRecon
            </Text>
            <Text
              fontSize={15}
              color="$textLight"
              textAlign="center"
              marginBottom="$8"
              fontFamily="$body"
            >
              Understand her cycle, be a better partner.
            </Text>

            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$3"
              padding="$6"
              width="100%"
              maxWidth={360}
              gap="$5"
            >
              <FeatureItem
                icon={<CalendarDays size={20} color={colors.accent.val} />}
                title="Track Her Cycle"
                description="Know what phase she's in and what to expect"
              />
              <FeatureItem
                icon={<Bell size={20} color={colors.accent.val} />}
                title="Get Notified"
                description="Heads up before period, PMS, and ovulation"
              />
              <FeatureItem
                icon={<TrendingUp size={20} color={colors.accent.val} />}
                title="Daily Insights"
                description="Tips for each phase to support her better"
              />
            </Stack>
          </YStack>

          <Stack marginTop="$8">
            <Pressable onPress={() => router.push('/(app)/partner-setup')}>
              <Stack
                backgroundColor="$accent"
                borderRadius="$2"
                paddingVertical="$4"
                alignItems="center"
              >
                <Text fontSize={15} fontWeight="600" color="$white" fontFamily="$body">
                  Get Started
                </Text>
              </Stack>
            </Pressable>
            <Text
              fontSize={12}
              color="$textMuted"
              textAlign="center"
              marginTop="$3"
              fontFamily="$body"
            >
              Takes less than a minute to set up
            </Text>
          </Stack>
        </ScrollView>
      </SafeAreaView>
    </DottedBackground>
  )
}

function DashboardContent(): React.ReactElement {
  const { data: partner } = usePartner()
  const { data: cycleStatus, isLoading: cycleLoading } = useCycleStatus()

  if (cycleLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={colors.accent.val} />
      </YStack>
    )
  }

  const daysUntilText = cycleStatus?.days_until_period
    ? `${cycleStatus.days_until_period}`
    : '--'

  const periodActive = cycleStatus?.is_period_active

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack gap="$5">
        <YStack gap="$1">
          <YStack>
            <Text
              fontSize={32}
              fontWeight="700"
              color="$textDefault"
              fontFamily="$heading"
              letterSpacing={-0.5}
            >
              {partner?.name ?? 'Partner'}
            </Text>
            <Stack
              width={40}
              height={3}
              backgroundColor="$accent"
              borderRadius="$1"
              marginTop="$1.5"
            />
          </YStack>
          <Text fontSize={14} color="$textLight" fontFamily="$body" marginTop="$2">
            Cycle Day {cycleStatus?.current_day ?? '--'} of {cycleStatus?.cycle_length ?? '--'}
          </Text>
        </YStack>

        {cycleStatus && (
          <DefconCard
            phase={cycleStatus.phase}
            phaseDay={cycleStatus.phase_day}
          />
        )}

        <XStack gap="$3">
          <StatCard
            icon={<Clock size={14} color={colors.textMuted.val} />}
            label="Until Period"
            value={periodActive ? 'Now' : `${daysUntilText} days`}
            highlight={periodActive}
          />
          <StatCard
            icon={<Droplet size={14} color={colors.textMuted.val} />}
            label="Period Len"
            value={`${partner?.average_period_length ?? '--'} days`}
          />
        </XStack>

        <TacticalIntelCard phase={cycleStatus?.phase} />

        <YStack gap="$3">
          <QuickAction
            icon={<CalendarDays size={18} color={colors.textLight.val} />}
            label="View Calendar"
            subtitle="Track & predict cycles"
            onPress={() => router.push('/(app)/(tabs)/calendar')}
          />
          <QuickAction
            icon={<AlertTriangle size={18} color={colors.errorDefault.val} />}
            label="Emergency Protocols"
            subtitle="Survival guide for the trenches"
            onPress={() => router.push('/(app)/emergency-protocols')}
          />
          <QuickAction
            icon={<Trophy size={18} color={colors.secondaryLight.val} />}
            label="Achievements"
            subtitle="Collect badges, prove your worth"
            onPress={() => router.push('/(app)/achievements')}
          />
        </YStack>
      </YStack>
    </ScrollView>
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
