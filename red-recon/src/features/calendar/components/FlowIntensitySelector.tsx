/**
 * @AngelaMos | 2026
 * FlowIntensitySelector.tsx
 */

import { FlowIntensity } from '@/api/types'
import { haptics } from '@/shared/utils'
import { colors } from '@/theme/tokens'
import { Droplet } from 'lucide-react-native'
import type React from 'react'
import { Pressable } from 'react-native'
import { Stack, Text, XStack } from 'tamagui'

const FLOW_OPTIONS = [
  { value: FlowIntensity.LIGHT, label: 'Light' },
  { value: FlowIntensity.MEDIUM, label: 'Medium' },
  { value: FlowIntensity.HEAVY, label: 'Heavy' },
] as const

export interface FlowIntensitySelectorProps {
  selected: FlowIntensity | null
  onChange: (value: FlowIntensity) => void
}

export function FlowIntensitySelector({
  selected,
  onChange,
}: FlowIntensitySelectorProps): React.ReactElement {
  return (
    <Stack>
      <XStack alignItems="center" gap="$2" marginBottom="$3">
        <Droplet size={14} color={colors.textLight.val} />
        <Text fontSize={14} fontWeight="500" color="$textDefault">
          Flow Intensity
        </Text>
      </XStack>
      <XStack gap="$2">
        {FLOW_OPTIONS.map(({ value, label }) => (
          <Pressable
            key={value}
            onPress={() => {
              haptics.selection()
              onChange(value)
            }}
            style={{ flex: 1 }}
          >
            <Stack
              paddingVertical="$3"
              borderRadius="$3"
              borderWidth={1}
              borderColor={selected === value ? '$accent' : '$borderDefault'}
              backgroundColor={selected === value ? '$accent' : '$bgSurface200'}
              alignItems="center"
            >
              <Text
                fontSize={14}
                fontWeight="500"
                color={selected === value ? '$white' : '$textLight'}
              >
                {label}
              </Text>
            </Stack>
          </Pressable>
        ))}
      </XStack>
    </Stack>
  )
}
