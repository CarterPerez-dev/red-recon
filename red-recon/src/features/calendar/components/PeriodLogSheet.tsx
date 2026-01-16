/**
 * @AngelaMos | 2026
 * PeriodLogSheet.tsx
 */

import {
  useCreatePeriodLog,
  useDeletePeriodLog,
  useUpdatePeriodLog,
} from '@/api/hooks'
import {
  FlowIntensity,
  type CalendarDay,
  type PeriodLogCreate,
  type PeriodLogUpdate,
} from '@/api/types'
import { haptics } from '@/shared/utils'
import { colors } from '@/theme/tokens'
import { Check, Trash2, X } from 'lucide-react-native'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Modal, Pressable } from 'react-native'
import { Stack, Text, TextArea, XStack, YStack } from 'tamagui'
import { FlowIntensitySelector } from './FlowIntensitySelector'
import { usePeriodForDate } from '../hooks/usePeriodForDate'

export interface PeriodLogSheetProps {
  visible: boolean
  selectedDate: string
  calendarDay: CalendarDay | null
  onClose: () => void
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export function PeriodLogSheet({
  visible,
  selectedDate,
  calendarDay,
  onClose,
}: PeriodLogSheetProps): React.ReactElement {
  const { period, isInPeriod, isStartDate } = usePeriodForDate(selectedDate)
  const createPeriod = useCreatePeriodLog()
  const updatePeriod = useUpdatePeriodLog()
  const deletePeriod = useDeletePeriodLog()

  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity | null>(null)
  const [notes, setNotes] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const isEditing = isInPeriod && period !== null
  const isPredicted = calendarDay?.is_predicted_period ?? false

  useEffect(() => {
    if (visible && period) {
      setFlowIntensity(period.flow_intensity)
      setNotes(period.notes ?? '')
    } else if (visible) {
      setFlowIntensity(null)
      setNotes('')
    }
    setShowDeleteConfirm(false)
    setShowSuccess(false)
  }, [visible, period])

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess, onClose])

  const handleStartPeriod = useCallback(() => {
    haptics.medium()

    const data: PeriodLogCreate = {
      start_date: selectedDate,
      flow_intensity: flowIntensity,
      notes: notes.trim() || null,
    }

    createPeriod.mutate(data, {
      onSuccess: () => {
        haptics.success()
        setShowSuccess(true)
      },
    })
  }, [createPeriod, flowIntensity, notes, selectedDate])

  const handleUpdatePeriod = useCallback(() => {
    if (!period) return
    haptics.medium()

    const data: PeriodLogUpdate = {
      flow_intensity: flowIntensity,
      notes: notes.trim() || null,
    }

    updatePeriod.mutate(
      { id: period.id, data },
      {
        onSuccess: () => {
          haptics.success()
          setShowSuccess(true)
        },
      }
    )
  }, [flowIntensity, notes, period, updatePeriod])

  const handleEndPeriod = useCallback(() => {
    if (!period) return
    haptics.medium()

    const data: PeriodLogUpdate = {
      end_date: selectedDate,
      flow_intensity: flowIntensity,
      notes: notes.trim() || null,
    }

    updatePeriod.mutate(
      { id: period.id, data },
      {
        onSuccess: () => {
          haptics.success()
          setShowSuccess(true)
        },
      }
    )
  }, [flowIntensity, notes, period, selectedDate, updatePeriod])

  const handleDelete = useCallback(() => {
    if (!period) return
    haptics.warning()

    deletePeriod.mutate(period.id, {
      onSuccess: () => {
        haptics.success()
        setShowSuccess(true)
      },
    })
  }, [deletePeriod, period])

  const isSaving =
    createPeriod.isPending || updatePeriod.isPending || deletePeriod.isPending

  const canEndPeriod =
    isEditing &&
    period &&
    period.end_date === null &&
    selectedDate !== period.start_date

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Stack
            backgroundColor="$bgSurface100"
            borderTopLeftRadius="$4"
            borderTopRightRadius="$4"
            padding="$6"
            paddingBottom="$8"
          >
            <XStack
              alignItems="center"
              justifyContent="space-between"
              marginBottom="$4"
            >
              <YStack>
                <Text fontSize={18} fontWeight="600" color="$textDefault">
                  {formatDisplayDate(selectedDate)}
                </Text>
                {isEditing && (
                  <Text fontSize={12} color="$textMuted" marginTop="$1">
                    Day {calendarDay?.cycle_day ?? '?'} of period
                  </Text>
                )}
                {isPredicted && !isEditing && (
                  <Text fontSize={12} color="$accent" marginTop="$1">
                    Predicted period day
                  </Text>
                )}
              </YStack>
              <XStack gap="$2" alignItems="center">
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
                <Pressable onPress={onClose}>
                  <X size={24} color={colors.textMuted.val} />
                </Pressable>
              </XStack>
            </XStack>

            <YStack gap="$4">
              <FlowIntensitySelector
                selected={flowIntensity}
                onChange={setFlowIntensity}
              />

              <Stack>
                <Text
                  fontSize={14}
                  fontWeight="500"
                  color="$textDefault"
                  marginBottom="$3"
                >
                  Notes
                </Text>
                <TextArea
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any notes..."
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
              </Stack>

              {isEditing ? (
                <YStack gap="$3">
                  <Pressable onPress={handleUpdatePeriod} disabled={isSaving}>
                    <Stack
                      backgroundColor="$accent"
                      borderRadius="$3"
                      paddingVertical="$4"
                      alignItems="center"
                      opacity={isSaving ? 0.7 : 1}
                    >
                      <Text fontSize={14} fontWeight="500" color="$white">
                        {updatePeriod.isPending ? 'Updating...' : 'Update'}
                      </Text>
                    </Stack>
                  </Pressable>

                  {canEndPeriod && (
                    <Pressable onPress={handleEndPeriod} disabled={isSaving}>
                      <Stack
                        borderWidth={1}
                        borderColor="$accent"
                        borderRadius="$3"
                        paddingVertical="$4"
                        alignItems="center"
                        opacity={isSaving ? 0.7 : 1}
                      >
                        <Text fontSize={14} fontWeight="500" color="$accent">
                          End Period Here
                        </Text>
                      </Stack>
                    </Pressable>
                  )}

                  {isStartDate && !showDeleteConfirm && (
                    <Pressable onPress={() => setShowDeleteConfirm(true)}>
                      <XStack
                        justifyContent="center"
                        alignItems="center"
                        gap="$2"
                        paddingVertical="$3"
                      >
                        <Trash2 size={14} color={colors.errorDefault.val} />
                        <Text fontSize={12} color="$errorDefault">
                          Delete Period
                        </Text>
                      </XStack>
                    </Pressable>
                  )}

                  {showDeleteConfirm && (
                    <Stack
                      backgroundColor="$bgSurface200"
                      borderRadius="$3"
                      padding="$4"
                    >
                      <Text
                        fontSize={12}
                        color="$errorDefault"
                        fontWeight="500"
                        marginBottom="$3"
                      >
                        Delete this period log?
                      </Text>
                      <XStack gap="$2">
                        <Pressable
                          style={{ flex: 1 }}
                          onPress={() => setShowDeleteConfirm(false)}
                        >
                          <Stack
                            backgroundColor="$bgSurface300"
                            borderRadius="$3"
                            paddingVertical="$3"
                            alignItems="center"
                          >
                            <Text
                              fontSize={12}
                              fontWeight="500"
                              color="$textLight"
                            >
                              Cancel
                            </Text>
                          </Stack>
                        </Pressable>
                        <Pressable
                          style={{ flex: 1 }}
                          onPress={handleDelete}
                          disabled={isSaving}
                        >
                          <Stack
                            backgroundColor="$errorDefault"
                            borderRadius="$3"
                            paddingVertical="$3"
                            alignItems="center"
                            opacity={deletePeriod.isPending ? 0.7 : 1}
                          >
                            <Text
                              fontSize={12}
                              fontWeight="500"
                              color="$white"
                            >
                              {deletePeriod.isPending ? 'Deleting...' : 'Delete'}
                            </Text>
                          </Stack>
                        </Pressable>
                      </XStack>
                    </Stack>
                  )}
                </YStack>
              ) : (
                <Pressable onPress={handleStartPeriod} disabled={isSaving}>
                  <Stack
                    backgroundColor="$accent"
                    borderRadius="$3"
                    paddingVertical="$4"
                    alignItems="center"
                    opacity={isSaving ? 0.7 : 1}
                  >
                    <Text fontSize={14} fontWeight="500" color="$white">
                      {createPeriod.isPending
                        ? 'Logging...'
                        : isPredicted
                          ? 'Confirm Period Started'
                          : 'Start Period'}
                    </Text>
                  </Stack>
                </Pressable>
              )}
            </YStack>
          </Stack>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
