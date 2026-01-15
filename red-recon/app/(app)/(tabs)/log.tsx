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
  Pencil,
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
  { value: Mood.GREAT, icon: Sun },
  { value: Mood.GOOD, icon: Smile },
  { value: Mood.MEH, icon: Meh },
  { value: Mood.ROUGH, icon: Frown },
  { value: Mood.JUST_NOD, icon: Hand },
  { value: Mood.PICK_YOUR_BATTLES, icon: Swords },
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
      borderRadius="$4"
      padding="$4"
    >
      <Text fontSize={14} fontWeight="500" color="$textDefault" marginBottom="$3">
        How's she doing?
      </Text>
      <XStack flexWrap="wrap" gap="$2">
        {MOOD_OPTIONS.map(({ value, icon: Icon }) => (
          <Pressable
            key={value}
            onPress={() => {
              haptics.selection()
              onChange(value)
            }}
          >
            <Stack
              paddingVertical="$2"
              paddingHorizontal="$3"
              borderRadius="$3"
              borderWidth={1}
              borderColor={selected === value ? '$accent' : '$borderDefault'}
              backgroundColor={selected === value ? '$accent' : '$bgSurface200'}
              flexDirection="row"
              alignItems="center"
              gap="$2"
            >
              <Icon
                size={14}
                color={selected === value ? colors.white.val : colors.textLight.val}
              />
              <Text
                fontSize={12}
                color={selected === value ? '$white' : '$textLight'}
                fontWeight="500"
              >
                {MOOD_LABELS[value]}
              </Text>
            </Stack>
          </Pressable>
        ))}
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
      borderRadius="$4"
      padding="$4"
    >
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        <Zap size={14} color={colors.textLight.val} />
        <Text fontSize={14} fontWeight="500" color="$textDefault">
          Energy Level
        </Text>
      </XStack>
      <XStack gap="$2">
        {ENERGY_LEVELS.map((level) => (
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
              borderRadius="$3"
              borderWidth={1}
              borderColor={selected === level ? '$accent' : '$borderDefault'}
              backgroundColor={selected === level ? '$accent' : '$bgSurface200'}
              alignItems="center"
            >
              <Text
                fontSize={14}
                fontWeight="500"
                color={selected === level ? '$white' : '$textLight'}
              >
                {level}
              </Text>
            </Stack>
          </Pressable>
        ))}
      </XStack>
      <XStack justifyContent="space-between" marginTop="$2">
        <Text fontSize={10} color="$textMuted">Low</Text>
        <Text fontSize={10} color="$textMuted">High</Text>
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
      borderRadius="$4"
      padding="$4"
    >
      <Text fontSize={14} fontWeight="500" color="$textDefault" marginBottom="$3">
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
                borderRadius="$3"
                borderWidth={1}
                borderColor={isSelected ? '$accent' : '$borderDefault'}
                backgroundColor={isSelected ? '$accent' : '$bgSurface200'}
                flexDirection="row"
                alignItems="center"
                gap="$1"
              >
                {isSelected && <Check size={12} color={colors.white.val} />}
                <Text
                  fontSize={12}
                  color={isSelected ? '$white' : '$textLight'}
                  fontWeight="500"
                  textTransform="capitalize"
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

  const { data: existingLog, isLoading } = useDailyLogByDate(dateStr)
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
    setSelectedDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }, [])

  const goToNextDay = useCallback(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

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
  const isEditing = existingLog !== null && existingLog !== undefined

  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <YStack flex={1}>
          <YStack padding="$6" paddingBottom="$4">
            <XStack
              alignItems="center"
              justifyContent="space-between"
              marginBottom="$2"
            >
              <XStack alignItems="center" gap="$3">
                <Text fontSize={26} fontWeight="600" color="$textDefault">
                  Daily Log
                </Text>
                {isEditing && (
                  <XStack alignItems="center" gap="$1">
                    <Pencil size={12} color={colors.textMuted.val} />
                    <Text fontSize={10} color="$textMuted">
                      Editing
                    </Text>
                  </XStack>
                )}
              </XStack>
              <XStack gap="$2">
                {showSuccess && (
                  <Stack
                    backgroundColor="#22c55e"
                    paddingVertical="$1"
                    paddingHorizontal="$2"
                    borderRadius="$2"
                    flexDirection="row"
                    alignItems="center"
                    gap="$1"
                  >
                    <Check size={10} color={colors.white.val} />
                    <Text fontSize={10} color="$white" fontWeight="500">
                      Saved
                    </Text>
                  </Stack>
                )}
                {isToday && !showSuccess && (
                  <Stack
                    backgroundColor="$accent"
                    paddingVertical="$1"
                    paddingHorizontal="$2"
                    borderRadius="$2"
                  >
                    <Text fontSize={10} color="$white" fontWeight="500">
                      TODAY
                    </Text>
                  </Stack>
                )}
              </XStack>
            </XStack>

            <XStack alignItems="center" justifyContent="space-between">
              <Pressable onPress={goToPreviousDay}>
                <ChevronLeft size={24} color={colors.textLight.val} />
              </Pressable>
              <Text fontSize={16} color="$textLighter">
                {formatDisplayDate(selectedDate)}
              </Text>
              <Pressable onPress={goToNextDay} disabled={!canGoNext}>
                <ChevronRight
                  size={24}
                  color={canGoNext ? colors.textLight.val : colors.textMuted.val}
                />
              </Pressable>
            </XStack>
          </YStack>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 24, paddingTop: 0, gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <MoodSelector selected={mood} onChange={setMood} />
            <EnergySelector selected={energy} onChange={setEnergy} />
            <SymptomSelector selected={symptoms} onChange={setSymptoms} />

            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$4"
              padding="$4"
            >
              <Text fontSize={14} fontWeight="500" color="$textDefault" marginBottom="$3">
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
                borderRadius="$3"
                padding="$3"
                fontSize={14}
                color="$textDefault"
                minHeight={80}
                maxLength={500}
              />
              <Text fontSize={10} color="$textMuted" marginTop="$2" textAlign="right">
                {notes.length}/500
              </Text>
            </Stack>
          </ScrollView>

          <Stack padding="$6" paddingTop="$4">
            <Pressable onPress={handleSave} disabled={!hasChanges || isSaving}>
              <Stack
                backgroundColor={hasChanges ? '$accent' : '$bgSurface200'}
                borderRadius="$3"
                paddingVertical="$4"
                alignItems="center"
                opacity={isSaving ? 0.7 : 1}
              >
                <Text
                  fontSize={14}
                  fontWeight="500"
                  color={hasChanges ? '$white' : '$textMuted'}
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
