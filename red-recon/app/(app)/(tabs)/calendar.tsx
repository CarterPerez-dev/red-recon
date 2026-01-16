/**
 * @AngelaMos | 2026
 * calendar.tsx
 */

import { useCalendarMonth } from '@/api/hooks'
import { type CalendarDay, CyclePhase, PHASE_COLORS } from '@/api/types'
import { PeriodLogSheet } from '@/features/calendar'
import { DottedBackground } from '@/shared/components'
import { haptics } from '@/shared/utils'
import { colors } from '@/theme/tokens'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Dimensions, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Text, XStack, YStack } from 'tamagui'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CALENDAR_PADDING = 16
const CELL_GAP = 6
const CELL_SIZE = (SCREEN_WIDTH - (CALENDAR_PADDING * 2) - (CELL_GAP * 6)) / 7

interface CalendarCellData {
  day: CalendarDay | null
  dayNumber: number | null
  isToday: boolean
  dateStr: string | null
}

function getPhaseBackgroundColor(phase: CyclePhase | undefined): string {
  if (!phase) return 'transparent'
  switch (phase) {
    case CyclePhase.MENSTRUAL:
      return 'rgba(220, 38, 38, 0.12)'
    case CyclePhase.FOLLICULAR:
      return 'rgba(236, 72, 153, 0.10)'
    case CyclePhase.OVULATION:
      return 'rgba(245, 158, 11, 0.12)'
    case CyclePhase.LUTEAL:
      return 'rgba(100, 116, 139, 0.10)'
    default:
      return 'transparent'
  }
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
    return <Stack width={CELL_SIZE} height={CELL_SIZE} />
  }

  const isPeriod = day?.is_period ?? false
  const isPredicted = (day?.is_predicted_period ?? false) && !isPeriod
  const phaseBg = getPhaseBackgroundColor(day?.phase)

  return (
    <Pressable onPress={onPress}>
      <Stack
        width={CELL_SIZE}
        height={CELL_SIZE}
        alignItems="center"
        justifyContent="center"
        borderRadius="$2"
        backgroundColor={isPeriod ? colors.phaseRed.val : phaseBg}
        borderWidth={isToday ? 2 : isPredicted ? 1 : 0}
        borderColor={isToday ? colors.accent.val : isPredicted ? colors.accentBorder.val : 'transparent'}
        borderStyle={isPredicted && !isToday ? 'dashed' : 'solid'}
      >
        <Text
          fontSize={15}
          fontWeight={isToday ? '600' : '400'}
          fontFamily="$body"
          color={isPeriod ? '$white' : isToday ? '$accent' : '$textDefault'}
        >
          {dayNumber}
        </Text>
      </Stack>
    </Pressable>
  )
}

function CalendarGrid({
  days,
  year,
  month,
  onDayPress,
}: {
  days: CalendarDay[]
  year: number
  month: number
  onDayPress: (dateStr: string, day: CalendarDay | null) => void
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
      currentWeek.push({ day: null, dayNumber: null, isToday: false, dateStr: null })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const day = daysByDate.get(dateStr) ?? null
      currentWeek.push({
        day,
        dayNumber: d,
        isToday: dateStr === todayStr,
        dateStr,
      })

      if (currentWeek.length === 7) {
        result.push(currentWeek)
        currentWeek = []
      }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: null, dayNumber: null, isToday: false, dateStr: null })
    }
    if (currentWeek.length === 7) {
      result.push(currentWeek)
    }

    return result
  }, [daysByDate, daysInMonth, firstDayOfMonth, month, todayStr, year])

  return (
    <YStack gap={CELL_GAP}>
      <XStack justifyContent="space-between" paddingHorizontal="$1">
        {WEEKDAYS.map((day, idx) => (
          <Stack key={`${day}-${idx}`} width={CELL_SIZE} alignItems="center">
            <Text fontSize={13} color="$textMuted" fontWeight="500" fontFamily="$body">
              {day}
            </Text>
          </Stack>
        ))}
      </XStack>
      {weeks.map((week, weekIndex) => (
        <XStack key={`week-${weekIndex}`} justifyContent="space-between">
          {week.map((cellData, dayIndex) => (
            <CalendarDayCell
              key={cellData.dateStr ?? `empty-${weekIndex}-${dayIndex}`}
              data={cellData}
              onPress={cellData.dateStr ? () => onDayPress(cellData.dateStr!, cellData.day) : undefined}
            />
          ))}
        </XStack>
      ))}
    </YStack>
  )
}

function PhaseLegend(): React.ReactElement {
  const phases = [
    { label: 'Period', color: colors.phaseRed.val, bg: 'rgba(220, 38, 38, 0.12)' },
    { label: 'Follicular', color: colors.phasePink.val, bg: 'rgba(236, 72, 153, 0.10)' },
    { label: 'Ovulation', color: colors.phaseAmber.val, bg: 'rgba(245, 158, 11, 0.12)' },
    { label: 'Luteal', color: colors.phaseSlate.val, bg: 'rgba(100, 116, 139, 0.10)' },
  ] as const

  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$3"
      padding="$4"
    >
      <XStack flexWrap="wrap" gap="$4">
        {phases.map(({ label, color, bg }) => (
          <XStack key={label} alignItems="center" gap="$2">
            <Stack
              width={20}
              height={20}
              borderRadius="$1"
              backgroundColor={bg}
              alignItems="center"
              justifyContent="center"
            >
              <Stack
                width={8}
                height={8}
                borderRadius={4}
                backgroundColor={color}
              />
            </Stack>
            <Text fontSize={13} color="$textLight" fontFamily="$body">
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

  const [sheetVisible, setSheetVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<CalendarDay | null>(null)

  const goToPreviousMonth = useCallback(() => {
    haptics.light()
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const goToNextMonth = useCallback(() => {
    haptics.light()
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const goToToday = useCallback(() => {
    haptics.light()
    setCurrentDate(new Date())
  }, [])

  const handleDayPress = useCallback((dateStr: string, day: CalendarDay | null) => {
    haptics.light()
    setSelectedDate(dateStr)
    setSelectedCalendarDay(day)
    setSheetVisible(true)
  }, [])

  const isCurrentMonth = useMemo(() => {
    const now = new Date()
    return year === now.getFullYear() && month === now.getMonth() + 1
  }, [year, month])

  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: CALENDAR_PADDING, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack paddingTop="$6" gap="$5">
            <XStack alignItems="center" justifyContent="space-between">
              <Pressable onPress={goToPreviousMonth} hitSlop={12}>
                <Stack
                  width={40}
                  height={40}
                  borderRadius="$2"
                  backgroundColor="$bgSurface100"
                  alignItems="center"
                  justifyContent="center"
                >
                  <ChevronLeft size={20} color={colors.textLight.val} />
                </Stack>
              </Pressable>

              <Pressable onPress={goToToday}>
                <YStack alignItems="center">
                  <Text fontSize={20} fontWeight="600" color="$textDefault" fontFamily="$heading">
                    {MONTH_NAMES[month - 1]}
                  </Text>
                  <Text fontSize={13} color="$textMuted" fontFamily="$body">
                    {year}
                  </Text>
                </YStack>
              </Pressable>

              <Pressable onPress={goToNextMonth} hitSlop={12}>
                <Stack
                  width={40}
                  height={40}
                  borderRadius="$2"
                  backgroundColor="$bgSurface100"
                  alignItems="center"
                  justifyContent="center"
                >
                  <ChevronRight size={20} color={colors.textLight.val} />
                </Stack>
              </Pressable>
            </XStack>

            {!isCurrentMonth && (
              <Pressable onPress={goToToday}>
                <Stack
                  backgroundColor="$accentSubtle"
                  borderRadius="$2"
                  paddingVertical="$2"
                  paddingHorizontal="$4"
                  alignSelf="center"
                  borderWidth={1}
                  borderColor="$accentBorder"
                >
                  <Text fontSize={13} color="$accent" fontWeight="500" fontFamily="$body">
                    Back to Today
                  </Text>
                </Stack>
              </Pressable>
            )}

            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$3"
              padding="$4"
            >
              {isLoading ? (
                <Stack height={340} justifyContent="center" alignItems="center">
                  <ActivityIndicator size="large" color={colors.accent.val} />
                </Stack>
              ) : (
                <CalendarGrid
                  days={calendarMonth?.days ?? []}
                  year={year}
                  month={month}
                  onDayPress={handleDayPress}
                />
              )}
            </Stack>

            <PhaseLegend />

            <Stack
              backgroundColor="$accentSubtle"
              borderWidth={1}
              borderColor="$accentBorder"
              borderRadius="$3"
              padding="$4"
            >
              <Text fontSize={13} color="$textLight" fontFamily="$body" lineHeight={20}>
                Tap any day to log period start/end. Dashed borders indicate predicted period days.
              </Text>
            </Stack>
          </YStack>
        </ScrollView>

        <PeriodLogSheet
          visible={sheetVisible}
          selectedDate={selectedDate ?? ''}
          calendarDay={selectedCalendarDay}
          onClose={() => setSheetVisible(false)}
        />
      </SafeAreaView>
    </DottedBackground>
  )
}
