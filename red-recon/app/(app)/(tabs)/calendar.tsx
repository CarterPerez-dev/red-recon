/**
 * @AngelaMos | 2026
 * calendar.tsx
 */

import { useCalendarMonth } from '@/api/hooks'
import { type CalendarDay, PHASE_COLORS, PHASE_LABELS } from '@/api/types'
import { DottedBackground } from '@/shared/components'
import { colors } from '@/theme/tokens'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Text, XStack, YStack } from 'tamagui'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const

interface CalendarCellData {
  day: CalendarDay | null
  dayNumber: number | null
  isToday: boolean
}

function CalendarDayCell({
  data,
  onPress,
}: {
  data: CalendarCellData
  onPress?: () => void
}): React.ReactElement {
  const { day, dayNumber, isToday } = data

  if (dayNumber === null) {
    return <Stack flex={1} aspectRatio={1} />
  }

  const phaseColor = day ? (PHASE_COLORS[day.phase] ?? colors.textMuted.val) : colors.textMuted.val
  const isPeriod = day?.is_period ?? false
  const isPredicted = (day?.is_predicted_period ?? false) && !isPeriod

  return (
    <Pressable style={{ flex: 1 }} onPress={onPress}>
      <Stack
        flex={1}
        aspectRatio={1}
        alignItems="center"
        justifyContent="center"
        borderRadius="$2"
        backgroundColor={isPeriod ? '#dc2626' : isPredicted ? '$bgSurface200' : 'transparent'}
        borderWidth={isToday ? 2 : 0}
        borderColor={isToday ? '$accent' : 'transparent'}
      >
        <Text
          fontSize={14}
          fontWeight={isToday ? '600' : '400'}
          color={isPeriod ? '$white' : isToday ? '$accent' : '$textDefault'}
        >
          {dayNumber}
        </Text>
        {day?.cycle_day && (
          <Stack
            position="absolute"
            bottom={2}
            width={4}
            height={4}
            borderRadius={2}
            backgroundColor={phaseColor}
          />
        )}
      </Stack>
    </Pressable>
  )
}

function CalendarGrid({
  days,
  year,
  month,
}: {
  days: CalendarDay[]
  year: number
  month: number
}): React.ReactElement {
  const todayStr = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [])

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const daysByDate = useMemo(() => {
    const map = new Map<string, CalendarDay>()
    for (const day of days) {
      map.set(day.date, day)
    }
    return map
  }, [days])

  const weeks: CalendarCellData[][] = useMemo(() => {
    const result: CalendarCellData[][] = []
    let currentWeek: CalendarCellData[] = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek.push({ day: null, dayNumber: null, isToday: false })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const day = daysByDate.get(dateStr) ?? null
      currentWeek.push({
        day,
        dayNumber: d,
        isToday: dateStr === todayStr,
      })

      if (currentWeek.length === 7) {
        result.push(currentWeek)
        currentWeek = []
      }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: null, dayNumber: null, isToday: false })
    }
    if (currentWeek.length === 7) {
      result.push(currentWeek)
    }

    return result
  }, [daysByDate, daysInMonth, firstDayOfMonth, month, todayStr, year])

  return (
    <YStack gap="$1">
      <XStack>
        {WEEKDAYS.map((day) => (
          <Stack key={day} flex={1} alignItems="center" padding="$2">
            <Text fontSize={12} color="$textMuted" fontWeight="500">
              {day}
            </Text>
          </Stack>
        ))}
      </XStack>
      {weeks.map((week, weekIndex) => (
        <XStack key={`week-${weekIndex}`} gap="$1">
          {week.map((cellData, dayIndex) => (
            <CalendarDayCell
              key={cellData.dayNumber ?? `empty-${weekIndex}-${dayIndex}`}
              data={cellData}
            />
          ))}
        </XStack>
      ))}
    </YStack>
  )
}

function PhaseLegend(): React.ReactElement {
  const phases = [
    { key: 'menstrual', label: 'Menstrual', color: PHASE_COLORS.menstrual },
    { key: 'follicular', label: 'Follicular', color: PHASE_COLORS.follicular },
    { key: 'ovulation', label: 'Ovulation', color: PHASE_COLORS.ovulation },
    { key: 'luteal', label: 'Luteal', color: PHASE_COLORS.luteal },
  ] as const

  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$4"
      padding="$4"
    >
      <Text fontSize={12} color="$textMuted" marginBottom="$3">
        PHASE LEGEND
      </Text>
      <XStack flexWrap="wrap" gap="$3">
        {phases.map(({ key, label, color }) => (
          <XStack key={key} alignItems="center" gap="$2">
            <Stack
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor={color}
            />
            <Text fontSize={12} color="$textLight">
              {label}
            </Text>
          </XStack>
        ))}
      </XStack>
    </Stack>
  )
}

export default function CalendarScreen(): React.ReactElement {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const { data: calendarMonth, isLoading } = useCalendarMonth(year, month)

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <YStack flex={1} padding="$6">
          <XStack
            alignItems="center"
            justifyContent="space-between"
            marginBottom="$6"
          >
            <YStack>
              <Text fontSize={26} fontWeight="600" color="$textDefault">
                Calendar
              </Text>
              <Pressable onPress={goToToday}>
                <Text fontSize={12} color="$accent">
                  Go to Today
                </Text>
              </Pressable>
            </YStack>

            <XStack alignItems="center" gap="$4">
              <Pressable onPress={goToPreviousMonth}>
                <ChevronLeft size={24} color={colors.textLight.val} />
              </Pressable>
              <Text fontSize={16} fontWeight="500" color="$textDefault" minWidth={120} textAlign="center">
                {MONTH_NAMES[month - 1]} {year}
              </Text>
              <Pressable onPress={goToNextMonth}>
                <ChevronRight size={24} color={colors.textLight.val} />
              </Pressable>
            </XStack>
          </XStack>

          <Stack
            backgroundColor="$bgSurface100"
            borderWidth={1}
            borderColor="$borderDefault"
            borderRadius="$4"
            padding="$4"
            marginBottom="$4"
          >
            {isLoading ? (
              <Stack height={280} justifyContent="center" alignItems="center">
                <ActivityIndicator size="large" color={colors.accent.val} />
              </Stack>
            ) : (
              <CalendarGrid
                days={calendarMonth?.days ?? []}
                year={year}
                month={month}
              />
            )}
          </Stack>

          <PhaseLegend />

          <Stack marginTop="$4">
            <XStack gap="$3" alignItems="center">
              <Stack
                width={16}
                height={16}
                borderRadius="$2"
                backgroundColor="#dc2626"
              />
              <Text fontSize={12} color="$textLight">
                Period Day
              </Text>
            </XStack>
            <XStack gap="$3" alignItems="center" marginTop="$2">
              <Stack
                width={16}
                height={16}
                borderRadius="$2"
                backgroundColor="$bgSurface200"
                borderWidth={1}
                borderColor="$borderDefault"
                borderStyle="dashed"
              />
              <Text fontSize={12} color="$textLight">
                Predicted Period
              </Text>
            </XStack>
          </Stack>
        </YStack>
      </SafeAreaView>
    </DottedBackground>
  )
}
