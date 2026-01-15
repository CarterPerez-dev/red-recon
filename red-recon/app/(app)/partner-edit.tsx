/**
 * @AngelaMos | 2026
 * partner-edit.tsx
 */

import { useDeletePartner, usePartner, useUpdatePartner } from '@/api/hooks'
import { CycleRegularity, type PartnerUpdate } from '@/api/types'
import { DottedBackground, Input } from '@/shared/components'
import { haptics } from '@/shared/utils'
import { colors } from '@/theme/tokens'
import { router } from 'expo-router'
import { ArrowLeft, Bell, Calendar, Check, Clock, Trash2, User } from 'lucide-react-native'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Switch, Text, XStack, YStack } from 'tamagui'

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

export default function PartnerEditScreen(): React.ReactElement {
  const { data: partner, isLoading } = usePartner()
  const updatePartner = useUpdatePartner()
  const deletePartner = useDeletePartner()

  const [name, setName] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const [regularity, setRegularity] = useState<CycleRegularity>(CycleRegularity.REGULAR)
  const [periodReminder, setPeriodReminder] = useState(true)
  const [pmsAlert, setPmsAlert] = useState(true)
  const [ovulationAlert, setOvulationAlert] = useState(false)
  const [reminderDays, setReminderDays] = useState(3)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (partner) {
      setName(partner.name)
      setCycleLength(partner.average_cycle_length)
      setPeriodLength(partner.average_period_length)
      setRegularity(partner.cycle_regularity)
      setPeriodReminder(partner.notification_period_reminder)
      setPmsAlert(partner.notification_pms_alert)
      setOvulationAlert(partner.notification_ovulation_alert)
      setReminderDays(partner.reminder_days_before)
    }
  }, [partner])

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const hasChanges =
    partner &&
    (name !== partner.name ||
      cycleLength !== partner.average_cycle_length ||
      periodLength !== partner.average_period_length ||
      regularity !== partner.cycle_regularity ||
      periodReminder !== partner.notification_period_reminder ||
      pmsAlert !== partner.notification_pms_alert ||
      ovulationAlert !== partner.notification_ovulation_alert ||
      reminderDays !== partner.reminder_days_before)

  const canSubmit = name.trim().length >= 1 && hasChanges

  const handleSave = useCallback(() => {
    if (!canSubmit) return

    haptics.medium()

    const data: PartnerUpdate = {
      name: name.trim(),
      average_cycle_length: cycleLength,
      average_period_length: periodLength,
      cycle_regularity: regularity,
      notification_period_reminder: periodReminder,
      notification_pms_alert: pmsAlert,
      notification_ovulation_alert: ovulationAlert,
      reminder_days_before: reminderDays,
    }

    updatePartner.mutate(data, {
      onSuccess: () => {
        haptics.success()
        setShowSuccess(true)
      },
    })
  }, [canSubmit, cycleLength, name, ovulationAlert, periodLength, periodReminder, pmsAlert, regularity, reminderDays, updatePartner])

  const handleDelete = useCallback(() => {
    haptics.warning()
    deletePartner.mutate(undefined, {
      onSuccess: () => {
        router.replace('/(app)/partner-setup')
      },
    })
  }, [deletePartner])

  if (isLoading) {
    return (
      <DottedBackground>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <Stack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={colors.accent.val} />
          </Stack>
        </SafeAreaView>
      </DottedBackground>
    )
  }

  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <YStack flex={1}>
          <XStack padding="$6" paddingBottom="$4" alignItems="center" gap="$4">
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.textLight.val} />
            </Pressable>
            <YStack flex={1}>
              <XStack alignItems="center" gap="$3">
                <Text fontSize={22} fontWeight="600" color="$textDefault">
                  Edit Partner
                </Text>
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
              </XStack>
              <Text fontSize={14} color="$textLighter">
                Update cycle information
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
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$4"
              padding="$4"
            >
              <XStack alignItems="center" gap="$2" marginBottom="$4">
                <Bell size={14} color={colors.textLight.val} />
                <Text fontSize={14} fontWeight="500" color="$textDefault">
                  Notifications
                </Text>
              </XStack>

              <YStack gap="$4">
                <XStack alignItems="center" justifyContent="space-between">
                  <YStack flex={1}>
                    <Text fontSize={14} color="$textDefault">
                      Period Reminder
                    </Text>
                    <Text fontSize={12} color="$textMuted">
                      Get notified before her period starts
                    </Text>
                  </YStack>
                  <Switch
                    size="$4"
                    checked={periodReminder}
                    onCheckedChange={(checked) => {
                      haptics.selection()
                      setPeriodReminder(checked)
                    }}
                    backgroundColor={periodReminder ? colors.accent.val : colors.bgSurface200.val}
                    borderWidth={1}
                    borderColor={periodReminder ? colors.accent.val : colors.borderDefault.val}
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
                </XStack>

                {periodReminder && (
                  <YStack>
                    <Text fontSize={12} color="$textMuted" marginBottom="$2">
                      Remind me this many days before
                    </Text>
                    <XStack gap="$2">
                      {[1, 2, 3, 5, 7].map((days) => (
                        <Pressable
                          key={days}
                          onPress={() => {
                            haptics.selection()
                            setReminderDays(days)
                          }}
                        >
                          <Stack
                            paddingVertical="$2"
                            paddingHorizontal="$3"
                            borderRadius="$3"
                            borderWidth={1}
                            borderColor={reminderDays === days ? '$accent' : '$borderDefault'}
                            backgroundColor={reminderDays === days ? '$accent' : '$bgSurface200'}
                          >
                            <Text
                              fontSize={12}
                              color={reminderDays === days ? '$white' : '$textLight'}
                              fontWeight="500"
                            >
                              {days}
                            </Text>
                          </Stack>
                        </Pressable>
                      ))}
                    </XStack>
                  </YStack>
                )}

                <XStack alignItems="center" justifyContent="space-between">
                  <YStack flex={1}>
                    <Text fontSize={14} color="$textDefault">
                      PMS Alert
                    </Text>
                    <Text fontSize={12} color="$textMuted">
                      Heads up for the luteal phase
                    </Text>
                  </YStack>
                  <Switch
                    size="$4"
                    checked={pmsAlert}
                    onCheckedChange={(checked) => {
                      haptics.selection()
                      setPmsAlert(checked)
                    }}
                    backgroundColor={pmsAlert ? colors.accent.val : colors.bgSurface200.val}
                    borderWidth={1}
                    borderColor={pmsAlert ? colors.accent.val : colors.borderDefault.val}
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
                </XStack>

                <XStack alignItems="center" justifyContent="space-between">
                  <YStack flex={1}>
                    <Text fontSize={14} color="$textDefault">
                      Ovulation Alert
                    </Text>
                    <Text fontSize={12} color="$textMuted">
                      Know when she's most fertile
                    </Text>
                  </YStack>
                  <Switch
                    size="$4"
                    checked={ovulationAlert}
                    onCheckedChange={(checked) => {
                      haptics.selection()
                      setOvulationAlert(checked)
                    }}
                    backgroundColor={ovulationAlert ? colors.accent.val : colors.bgSurface200.val}
                    borderWidth={1}
                    borderColor={ovulationAlert ? colors.accent.val : colors.borderDefault.val}
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
                </XStack>
              </YStack>
            </Stack>

            <Stack
              backgroundColor="$bgSurface75"
              borderRadius="$3"
              padding="$4"
            >
              <Text fontSize={12} color="$textLighter" lineHeight={18}>
                Changes to cycle length will update future predictions. Past data remains unchanged.
              </Text>
            </Stack>

            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$4"
              padding="$4"
              marginTop="$4"
            >
              <Text fontSize={14} fontWeight="500" color="$textDefault" marginBottom="$2">
                Danger Zone
              </Text>
              <Text fontSize={12} color="$textMuted" marginBottom="$4">
                Deleting will remove all tracking data including periods and daily logs.
              </Text>
              {showDeleteConfirm ? (
                <YStack gap="$2">
                  <Text fontSize={12} color="$errorDefault" fontWeight="500">
                    Are you sure? This cannot be undone.
                  </Text>
                  <XStack gap="$2">
                    <Pressable
                      style={{ flex: 1 }}
                      onPress={() => setShowDeleteConfirm(false)}
                    >
                      <Stack
                        backgroundColor="$bgSurface200"
                        borderRadius="$3"
                        paddingVertical="$3"
                        alignItems="center"
                      >
                        <Text fontSize={12} fontWeight="500" color="$textLight">
                          Cancel
                        </Text>
                      </Stack>
                    </Pressable>
                    <Pressable
                      style={{ flex: 1 }}
                      onPress={handleDelete}
                      disabled={deletePartner.isPending}
                    >
                      <Stack
                        backgroundColor="$errorDefault"
                        borderRadius="$3"
                        paddingVertical="$3"
                        alignItems="center"
                        opacity={deletePartner.isPending ? 0.7 : 1}
                      >
                        <Text fontSize={12} fontWeight="500" color="$white">
                          {deletePartner.isPending ? 'Deleting...' : 'Delete'}
                        </Text>
                      </Stack>
                    </Pressable>
                  </XStack>
                </YStack>
              ) : (
                <Pressable onPress={() => setShowDeleteConfirm(true)}>
                  <Stack
                    borderWidth={1}
                    borderColor="$errorDefault"
                    borderRadius="$3"
                    paddingVertical="$3"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap="$2"
                  >
                    <Trash2 size={14} color={colors.errorDefault.val} />
                    <Text fontSize={12} fontWeight="500" color="$errorDefault">
                      Delete Partner
                    </Text>
                  </Stack>
                </Pressable>
              )}
            </Stack>
          </ScrollView>

          <Stack padding="$6" paddingTop="$4">
            <Pressable onPress={handleSave} disabled={!canSubmit || updatePartner.isPending}>
              <Stack
                backgroundColor={canSubmit ? '$accent' : '$bgSurface200'}
                borderRadius="$3"
                paddingVertical="$4"
                alignItems="center"
                opacity={updatePartner.isPending ? 0.7 : 1}
              >
                <Text
                  fontSize={14}
                  fontWeight="500"
                  color={canSubmit ? '$white' : '$textMuted'}
                >
                  {updatePartner.isPending ? 'Saving...' : 'Save Changes'}
                </Text>
              </Stack>
            </Pressable>
          </Stack>
        </YStack>
      </SafeAreaView>
    </DottedBackground>
  )
}
