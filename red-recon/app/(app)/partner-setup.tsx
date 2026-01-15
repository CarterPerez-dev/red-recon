/**
 * @AngelaMos | 2026
 * partner-setup.tsx
 */

import { useCreatePartner } from '@/api/hooks'
import { CycleRegularity, type PartnerCreate } from '@/api/types'
import { DottedBackground, Input } from '@/shared/components'
import { haptics } from '@/shared/utils'
import { colors } from '@/theme/tokens'
import { router } from 'expo-router'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react-native'
import type React from 'react'
import { useCallback, useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Text, XStack, YStack } from 'tamagui'

const CYCLE_LENGTH_OPTIONS = [21, 24, 26, 28, 30, 32, 35] as const
const PERIOD_LENGTH_OPTIONS = [3, 4, 5, 6, 7] as const

const REGULARITY_OPTIONS = [
  { value: CycleRegularity.REGULAR, label: 'Regular', desc: 'Predictable timing' },
  { value: CycleRegularity.SOMEWHAT_IRREGULAR, label: 'Somewhat Irregular', desc: 'Varies a few days' },
  { value: CycleRegularity.IRREGULAR, label: 'Irregular', desc: 'Hard to predict' },
] as const

function NumberPicker({
  label,
  icon,
  options,
  selected,
  onChange,
  unit,
}: {
  label: string
  icon: React.ReactNode
  options: readonly number[]
  selected: number
  onChange: (value: number) => void
  unit: string
}): React.ReactElement {
  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$4"
      padding="$4"
    >
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        {icon}
        <Text fontSize={14} fontWeight="500" color="$textDefault">
          {label}
        </Text>
      </XStack>
      <XStack flexWrap="wrap" gap="$2">
        {options.map((value) => (
          <Pressable
            key={value}
            onPress={() => {
              haptics.selection()
              onChange(value)
            }}
          >
            <Stack
              paddingVertical="$2"
              paddingHorizontal="$4"
              borderRadius="$3"
              borderWidth={1}
              borderColor={selected === value ? '$accent' : '$borderDefault'}
              backgroundColor={selected === value ? '$accent' : '$bgSurface200'}
              minWidth={48}
              alignItems="center"
            >
              <Text
                fontSize={14}
                color={selected === value ? '$white' : '$textLight'}
                fontWeight="500"
              >
                {value}
              </Text>
            </Stack>
          </Pressable>
        ))}
      </XStack>
      <Text fontSize={12} color="$textMuted" marginTop="$2">
        {unit}
      </Text>
    </Stack>
  )
}

function RegularityPicker({
  selected,
  onChange,
}: {
  selected: CycleRegularity
  onChange: (value: CycleRegularity) => void
}): React.ReactElement {
  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$4"
      padding="$4"
    >
      <Text fontSize={14} fontWeight="500" color="$textDefault" marginBottom="$3">
        Cycle Regularity
      </Text>
      <YStack gap="$2">
        {REGULARITY_OPTIONS.map(({ value, label, desc }) => (
          <Pressable
            key={value}
            onPress={() => {
              haptics.selection()
              onChange(value)
            }}
          >
            <Stack
              padding="$3"
              borderRadius="$3"
              borderWidth={1}
              borderColor={selected === value ? '$accent' : '$borderDefault'}
              backgroundColor={selected === value ? '$accent' : '$bgSurface200'}
            >
              <Text
                fontSize={14}
                color={selected === value ? '$white' : '$textDefault'}
                fontWeight="500"
              >
                {label}
              </Text>
              <Text
                fontSize={12}
                color={selected === value ? '$white' : '$textMuted'}
                marginTop="$1"
              >
                {desc}
              </Text>
            </Stack>
          </Pressable>
        ))}
      </YStack>
    </Stack>
  )
}

export default function PartnerSetupScreen(): React.ReactElement {
  const createPartner = useCreatePartner()

  const [name, setName] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const [regularity, setRegularity] = useState<CycleRegularity>(CycleRegularity.REGULAR)

  const canSubmit = name.trim().length >= 1

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return

    haptics.medium()

    const data: PartnerCreate = {
      name: name.trim(),
      average_cycle_length: cycleLength,
      average_period_length: periodLength,
      cycle_regularity: regularity,
    }

    createPartner.mutate(data, {
      onSuccess: () => {
        router.replace('/(app)/(tabs)/home')
      },
    })
  }, [canSubmit, createPartner, cycleLength, name, periodLength, regularity])

  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <YStack flex={1}>
          <XStack padding="$6" paddingBottom="$4" alignItems="center" gap="$4">
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.textLight.val} />
            </Pressable>
            <YStack flex={1}>
              <Text fontSize={22} fontWeight="600" color="$textDefault">
                Partner Setup
              </Text>
              <Text fontSize={14} color="$textLighter">
                Enter cycle information
              </Text>
            </YStack>
          </XStack>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 24, paddingTop: 0, gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$4"
              padding="$4"
            >
              <XStack alignItems="center" gap="$2" marginBottom="$3">
                <User size={14} color={colors.textLight.val} />
                <Text fontSize={14} fontWeight="500" color="$textDefault">
                  Partner Name
                </Text>
              </XStack>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="Name"
                autoCapitalize="words"
                maxLength={50}
              />
            </Stack>

            <NumberPicker
              label="Average Cycle Length"
              icon={<Calendar size={14} color={colors.textLight.val} />}
              options={CYCLE_LENGTH_OPTIONS}
              selected={cycleLength}
              onChange={setCycleLength}
              unit="days between periods"
            />

            <NumberPicker
              label="Average Period Length"
              icon={<Clock size={14} color={colors.textLight.val} />}
              options={PERIOD_LENGTH_OPTIONS}
              selected={periodLength}
              onChange={setPeriodLength}
              unit="days of bleeding"
            />

            <RegularityPicker selected={regularity} onChange={setRegularity} />

            <Stack
              backgroundColor="$bgSurface75"
              borderRadius="$3"
              padding="$4"
            >
              <Text fontSize={12} color="$textLighter" lineHeight={18}>
                Don't know the exact numbers? No problem. These are starting estimates
                and will improve with tracking over time.
              </Text>
            </Stack>
          </ScrollView>

          <Stack padding="$6" paddingTop="$4">
            <Pressable onPress={handleSubmit} disabled={!canSubmit || createPartner.isPending}>
              <Stack
                backgroundColor={canSubmit ? '$accent' : '$bgSurface200'}
                borderRadius="$3"
                paddingVertical="$4"
                alignItems="center"
                opacity={createPartner.isPending ? 0.7 : 1}
              >
                <Text
                  fontSize={14}
                  fontWeight="500"
                  color={canSubmit ? '$white' : '$textMuted'}
                >
                  {createPartner.isPending ? 'Creating...' : 'Start Tracking'}
                </Text>
              </Stack>
            </Pressable>
          </Stack>
        </YStack>
      </SafeAreaView>
    </DottedBackground>
  )
}
