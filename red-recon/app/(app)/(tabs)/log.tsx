/**
 * @AngelaMos | 2026
 * log.tsx
 */

import {
  useCreateDailyLog,
  useDailyLogByDate,
  useUpdateDailyLog,
} from '@/api/hooks'
import { Mood, MOOD_LABELS, VALID_SYMPTOMS, type DailyLogCreate } from '@/api/types'
import { DottedBackground } from '@/shared/components'
import { haptics } from '@/shared/utils'
import { colors } from '@/theme/tokens'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Frown,
  Hand,
  Meh,
  Smile,
  Sun,
  Swords,
  Zap,
} from 'lucide-react-native'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Text, TextArea, XStack, YStack } from 'tamagui'

const MOOD_OPTIONS = [
  { value: Mood.GREAT, icon: Sun, color: '#f59e0b' },
  { value: Mood.GOOD, icon: Smile, color: '#22c55e' },
  { value: Mood.MEH, icon: Meh, color: '#64748b' },
  { value: Mood.ROUGH, icon: Frown, color: '#f97316' },
  { value: Mood.JUST_NOD, icon: Hand, color: '#ec4899' },
  { value: Mood.PICK_YOUR_BATTLES, icon: Swords, color: '#dc2626' },
] as const

const ENERGY_LEVELS = [1, 2, 3, 4, 5] as const

function MoodSelector({
  selected,
  onChange,
}: {
  selected: Mood | null
  onChange: (mood: Mood) => void
}): React.ReactElement {
  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$3"
      padding="$5"
    >
      <Text fontSize={14} fontWeight="600" color="$textDefault" marginBottom="$4" fontFamily="$body">
        How's she doing?
      </Text>
      <XStack flexWrap="wrap" gap="$2">
        {MOOD_OPTIONS.map(({ value, icon: Icon, color }) => {
          const isSelected = selected === value
          return (
            <Pressable
              key={value}
              onPress={() => {
                haptics.selection()
                onChange(value)
              }}
            >
              <Stack
                paddingVertical="$2.5"
                paddingHorizontal="$3"
                borderRadius="$2"
                borderWidth={1}
                borderColor={isSelected ? color : '$borderDefault'}
                backgroundColor={isSelected ? `${color}20` : '$bgSurface200'}
                flexDirection="row"
                alignItems="center"
                gap="$2"
              >
                <Icon
                  size={16}
                  color={color}
                />
                <Text
                  fontSize={13}
                  color={isSelected ? '$textDefault' : '$textLight'}
                  fontWeight="500"
                  fontFamily="$body"
                >
                  {MOOD_LABELS[value]}
                </Text>
              </Stack>
            </Pressable>
          )
        })}
      </XStack>
    </Stack>
  )
}

function EnergySelector({
  selected,
  onChange,
}: {
  selected: number | null
  onChange: (level: number) => void
}): React.ReactElement {
  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$3"
      padding="$5"
    >
      <XStack alignItems="center" gap="$2" marginBottom="$4">
        <Zap size={16} color={colors.secondaryLight.val} />
        <Text fontSize={14} fontWeight="600" color="$textDefault" fontFamily="$body">
          Energy Level
        </Text>
      </XStack>
      <XStack gap="$2">
        {ENERGY_LEVELS.map((level) => {
          const isSelected = selected === level
          return (
            <Pressable
              key={level}
              onPress={() => {
                haptics.selection()
                onChange(level)
              }}
              style={{ flex: 1 }}
            >
              <Stack
                paddingVertical="$3"
                borderRadius="$2"
                borderWidth={1}
                borderColor={isSelected ? colors.secondaryLight.val : '$borderDefault'}
                backgroundColor={isSelected ? colors.secondaryMuted.val : '$bgSurface200'}
                alignItems="center"
              >
                <Text
                  fontSize={16}
                  fontWeight="600"
                  color={isSelected ? colors.secondaryLight.val : '$textLight'}
                  fontFamily="$heading"
                >
                  {level}
                </Text>
              </Stack>
            </Pressable>
          )
        })}
      </XStack>
      <XStack justifyContent="space-between" marginTop="$2" paddingHorizontal="$1">
        <Text fontSize={11} color="$textMuted" fontFamily="$body">Low</Text>
        <Text fontSize={11} color="$textMuted" fontFamily="$body">High</Text>
      </XStack>
    </Stack>
  )
}

function SymptomSelector({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (symptoms: string[]) => void
}): React.ReactElement {
  const toggleSymptom = (symptom: string): void => {
    haptics.selection()
    if (selected.includes(symptom)) {
      onChange(selected.filter((s) => s !== symptom))
    } else {
      onChange([...selected, symptom])
    }
  }

  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$3"
      padding="$5"
    >
      <Text fontSize={14} fontWeight="600" color="$textDefault" marginBottom="$4" fontFamily="$body">
        Any symptoms?
      </Text>
      <XStack flexWrap="wrap" gap="$2">
        {VALID_SYMPTOMS.map((symptom) => {
          const isSelected = selected.includes(symptom)
          return (
            <Pressable key={symptom} onPress={() => toggleSymptom(symptom)}>
              <Stack
                paddingVertical="$2"
                paddingHorizontal="$3"
                borderRadius="$2"
                borderWidth={1}
                borderColor={isSelected ? '$accent' : '$borderDefault'}
                backgroundColor={isSelected ? '$accentSubtle' : '$bgSurface200'}
                flexDirection="row"
                alignItems="center"
                gap="$1.5"
              >
                {isSelected && <Check size={12} color={colors.accent.val} />}
                <Text
                  fontSize={13}
                  color={isSelected ? '$accent' : '$textLight'}
                  fontWeight="500"
                  textTransform="capitalize"
                  fontFamily="$body"
                >
                  {symptom}
                </Text>
              </Stack>
            </Pressable>
          )
        })}
      </XStack>
    </Stack>
  )
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatDisplayDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export default function LogScreen(): React.ReactElement {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const dateStr = useMemo(() => formatDate(selectedDate), [selectedDate])

  const { data: existingLog } = useDailyLogByDate(dateStr)
  const createLog = useCreateDailyLog()
  const updateLog = useUpdateDailyLog()

  const [mood, setMood] = useState<Mood | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const isToday = useMemo(() => {
    const today = new Date()
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    )
  }, [selectedDate])

  const goToPreviousDay = useCallback(() => {
    haptics.light()
    setSelectedDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }, [])

  const goToNextDay = useCallback(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    haptics.light()
    setSelectedDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + 1)
      if (newDate > tomorrow) return prev
      return newDate
    })
  }, [])

  const canGoNext = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay <= tomorrow
  }, [selectedDate])

  useMemo(() => {
    if (existingLog) {
      setMood(existingLog.mood)
      setEnergy(existingLog.energy_level)
      setSymptoms(existingLog.symptoms)
      setNotes(existingLog.notes ?? '')
    } else {
      setMood(null)
      setEnergy(null)
      setSymptoms([])
      setNotes('')
    }
  }, [existingLog])

  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleSave = useCallback(() => {
    haptics.medium()

    const data: DailyLogCreate = {
      log_date: dateStr,
      mood,
      energy_level: energy,
      symptoms,
      notes: notes.trim() || null,
    }

    const onSuccess = (): void => {
      haptics.success()
      setShowSuccess(true)
    }

    if (existingLog) {
      updateLog.mutate(
        {
          date: dateStr,
          data: {
            mood,
            energy_level: energy,
            symptoms,
            notes: notes.trim() || null,
          },
        },
        { onSuccess }
      )
    } else {
      createLog.mutate(data, { onSuccess })
    }
  }, [createLog, dateStr, energy, existingLog, mood, notes, symptoms, updateLog])

  const isSaving = createLog.isPending || updateLog.isPending
  const hasChanges = mood !== null || energy !== null || symptoms.length > 0 || notes.trim().length > 0

  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <YStack flex={1}>
          <YStack padding="$5" paddingBottom="$4">
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
              <YStack>
                <Text fontSize={28} fontWeight="700" color="$textDefault" fontFamily="$heading" letterSpacing={-0.5}>
                  Daily Log
                </Text>
                <Stack
                  width={32}
                  height={3}
                  backgroundColor="$accent"
                  borderRadius="$1"
                  marginTop="$1.5"
                />
              </YStack>
              <XStack gap="$2">
                {showSuccess && (
                  <Stack
                    backgroundColor="#22c55e"
                    paddingVertical="$1.5"
                    paddingHorizontal="$3"
                    borderRadius="$2"
                    flexDirection="row"
                    alignItems="center"
                    gap="$1"
                  >
                    <Check size={12} color={colors.white.val} />
                    <Text fontSize={12} color="$white" fontWeight="600" fontFamily="$body">
                      Saved
                    </Text>
                  </Stack>
                )}
                {isToday && !showSuccess && (
                  <Stack
                    backgroundColor="$accentSubtle"
                    borderWidth={1}
                    borderColor="$accentBorder"
                    paddingVertical="$1.5"
                    paddingHorizontal="$3"
                    borderRadius="$2"
                  >
                    <Text fontSize={12} color="$accent" fontWeight="600" fontFamily="$body">
                      TODAY
                    </Text>
                  </Stack>
                )}
              </XStack>
            </XStack>

            <XStack alignItems="center" justifyContent="space-between">
              <Pressable onPress={goToPreviousDay} hitSlop={12}>
                <Stack
                  width={36}
                  height={36}
                  borderRadius="$2"
                  backgroundColor="$bgSurface100"
                  alignItems="center"
                  justifyContent="center"
                >
                  <ChevronLeft size={18} color={colors.textLight.val} />
                </Stack>
              </Pressable>
              <Text fontSize={15} color="$textLight" fontFamily="$body">
                {formatDisplayDate(selectedDate)}
              </Text>
              <Pressable onPress={goToNextDay} disabled={!canGoNext} hitSlop={12}>
                <Stack
                  width={36}
                  height={36}
                  borderRadius="$2"
                  backgroundColor="$bgSurface100"
                  alignItems="center"
                  justifyContent="center"
                  opacity={canGoNext ? 1 : 0.4}
                >
                  <ChevronRight size={18} color={colors.textLight.val} />
                </Stack>
              </Pressable>
            </XStack>
          </YStack>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
            showsVerticalScrollIndicator={false}
          >
            <MoodSelector selected={mood} onChange={setMood} />
            <EnergySelector selected={energy} onChange={setEnergy} />
            <SymptomSelector selected={symptoms} onChange={setSymptoms} />

            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$3"
              padding="$5"
            >
              <Text fontSize={14} fontWeight="600" color="$textDefault" marginBottom="$3" fontFamily="$body">
                Notes
              </Text>
              <TextArea
                value={notes}
                onChangeText={setNotes}
                placeholder="Any observations..."
                placeholderTextColor={colors.textMuted.val}
                backgroundColor="$bgControl"
                borderWidth={1}
                borderColor="$borderDefault"
                borderRadius="$2"
                padding="$3"
                fontSize={14}
                color="$textDefault"
                minHeight={80}
                maxLength={500}
                fontFamily="Inter"
              />
              <Text fontSize={11} color="$textMuted" marginTop="$2" textAlign="right" fontFamily="$body">
                {notes.length}/500
              </Text>
            </Stack>
          </ScrollView>

          <Stack padding="$5" paddingTop="$3">
            <Pressable onPress={handleSave} disabled={!hasChanges || isSaving}>
              <Stack
                backgroundColor={hasChanges ? '$accent' : '$bgSurface200'}
                borderRadius="$2"
                paddingVertical="$4"
                alignItems="center"
                opacity={isSaving ? 0.7 : 1}
              >
                <Text
                  fontSize={15}
                  fontWeight="600"
                  color={hasChanges ? '$white' : '$textMuted'}
                  fontFamily="$body"
                >
                  {isSaving ? 'Saving...' : existingLog ? 'Update Log' : 'Save Log'}
                </Text>
              </Stack>
            </Pressable>
          </Stack>
        </YStack>
      </SafeAreaView>
    </DottedBackground>
  )
}
