/**
 * @AngelaMos | 2026
 * emergency-protocols.tsx
 */

import { DottedBackground } from '@/shared/components'
import { colors } from '@/theme/tokens'
import { router } from 'expo-router'
import {
  AlertTriangle,
  ChevronLeft,
  Cookie,
  Flame,
  Heart,
  MessageCircleOff,
  Shield,
  Skull,
  Sofa,
  ThermometerSun,
  Tv,
  Zap,
} from 'lucide-react-native'
import type React from 'react'
import { Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Text, XStack, YStack } from 'tamagui'

interface Protocol {
  icon: React.ReactNode
  title: string
  threat: string
  steps: string[]
}

const EMERGENCY_PROTOCOLS: Protocol[] = [
  {
    icon: <Skull size={20} color={colors.errorDefault.val} />,
    title: 'SILENT TREATMENT',
    threat: 'CRITICAL',
    steps: [
      "do NOT ask what's wrong more than once",
      "exist silently in her general vicinity",
      "offer snacks without making eye contact",
      "wait for her to speak first or perish",
      "if she says 'it's fine' - it is not fine",
    ],
  },
  {
    icon: <Flame size={20} color="#f97316" />,
    title: 'MELTDOWN MODE',
    threat: 'SEVERE',
    steps: [
      "do not try to fix it. just don't.",
      "nod and say 'that's valid' on repeat",
      "tissues within arm's reach at all times",
      "do NOT mention hormones unless you want death",
      "her feelings are facts rn. accept it.",
    ],
  },
  {
    icon: <Cookie size={20} color="#f59e0b" />,
    title: 'SNACK EMERGENCY',
    threat: 'HIGH',
    steps: [
      "chocolate is not a want, it's a NEED",
      "wrong snack = starting over from scratch",
      "if unsure, get one of everything",
      "ice cream is a food group this week",
      "delivery apps are your best friend",
    ],
  },
  {
    icon: <ThermometerSun size={20} color="#dc2626" />,
    title: 'CRAMP CRISIS',
    threat: 'CRITICAL',
    steps: [
      "heating pad must be located IMMEDIATELY",
      "offer pain meds with water (not just meds)",
      "blanket deployment is mandatory",
      "do not question why she's in fetal position",
      "if she says 'I'm dying' - she's not lying to her",
    ],
  },
  {
    icon: <MessageCircleOff size={20} color="#64748b" />,
    title: '"DO I LOOK BLOATED?"',
    threat: 'EXTREME',
    steps: [
      "THE ANSWER IS ALWAYS NO",
      "follow up with 'you look amazing'",
      "do not hesitate. hesitation = guilt",
      "compliment something specific immediately",
      "this is not a drill. your life depends on it.",
    ],
  },
  {
    icon: <Tv size={20} color="#8b5cf6" />,
    title: 'COMFORT SHOW',
    threat: 'MODERATE',
    steps: [
      "surrender the remote. it's hers now.",
      "yes, even if it's the 47th rewatch",
      "prepare to pretend you also love it",
      "do NOT suggest something 'better'",
      "your opinion was not asked for bestie",
    ],
  },
  {
    icon: <Sofa size={20} color="#22c55e" />,
    title: 'COUCH QUARANTINE',
    threat: 'ELEVATED',
    steps: [
      "do not attempt to move her",
      "bring all necessities TO the couch",
      "she lives here now. accept it.",
      "blanket cocoon must not be disturbed",
      "you're basically a waiter with benefits",
    ],
  },
  {
    icon: <Zap size={20} color="#eab308" />,
    title: 'RANDOM CRYING',
    threat: 'HIGH',
    steps: [
      "do NOT ask why she's crying",
      "she also doesn't know why",
      "just... be there. silently.",
      "offer hug but accept rejection gracefully",
      "this is normal. you're both fine. probably.",
    ],
  },
]

function ProtocolCard({ protocol }: { protocol: Protocol }): React.ReactElement {
  const threatColors: Record<string, string> = {
    CRITICAL: '#dc2626',
    EXTREME: '#dc2626',
    SEVERE: '#f97316',
    HIGH: '#f59e0b',
    ELEVATED: '#eab308',
    MODERATE: '#22c55e',
  }

  const threatColor = threatColors[protocol.threat] ?? colors.textMuted.val

  return (
    <Stack
      backgroundColor="$bgSurface100"
      borderWidth={1}
      borderColor="$borderDefault"
      borderRadius="$3"
      padding="$5"
      marginBottom="$4"
    >
      <XStack alignItems="center" justifyContent="space-between" marginBottom="$4" gap="$3">
        <XStack alignItems="center" gap="$2" flex={1} flexShrink={1}>
          {protocol.icon}
          <Text
            fontSize={13}
            fontWeight="700"
            color="$textDefault"
            fontFamily="$heading"
            letterSpacing={0.3}
            numberOfLines={1}
          >
            {protocol.title}
          </Text>
        </XStack>
        <Stack
          backgroundColor={`${threatColor}20`}
          borderWidth={1}
          borderColor={threatColor}
          paddingVertical={4}
          paddingHorizontal={6}
          borderRadius={4}
          flexShrink={0}
        >
          <Text
            fontSize={9}
            fontWeight="700"
            color={threatColor}
            fontFamily="$body"
            letterSpacing={0.5}
          >
            {protocol.threat}
          </Text>
        </Stack>
      </XStack>

      <YStack gap="$2.5">
        {protocol.steps.map((step, index) => (
          <XStack key={index} gap="$2.5" alignItems="flex-start">
            <Text
              fontSize={12}
              fontWeight="700"
              color="$textMuted"
              fontFamily="$body"
              width={20}
            >
              {String(index + 1).padStart(2, '0')}
            </Text>
            <Text
              fontSize={13}
              color="$textLight"
              fontFamily="$body"
              flex={1}
              lineHeight={19}
            >
              {step}
            </Text>
          </XStack>
        ))}
      </YStack>
    </Stack>
  )
}

export default function EmergencyProtocolsScreen(): React.ReactElement {
  return (
    <DottedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <YStack flex={1}>
          <XStack
            padding="$5"
            paddingBottom="$4"
            alignItems="center"
            gap="$3"
          >
            <Pressable onPress={() => router.back()} hitSlop={12}>
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
            <YStack flex={1}>
              <XStack alignItems="center" gap="$2">
                <AlertTriangle size={18} color={colors.errorDefault.val} />
                <Text
                  fontSize={12}
                  fontWeight="700"
                  color="$errorDefault"
                  fontFamily="$body"
                  letterSpacing={1}
                >
                  CLASSIFIED
                </Text>
              </XStack>
              <Text
                fontSize={22}
                fontWeight="700"
                color="$textDefault"
                fontFamily="$heading"
                letterSpacing={-0.5}
              >
                Emergency Protocols
              </Text>
            </YStack>
          </XStack>

          <Stack
            backgroundColor="$accentSubtle"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="$accentBorder"
            paddingVertical="$3"
            paddingHorizontal="$5"
          >
            <XStack alignItems="center" gap="$2">
              <Shield size={14} color={colors.accent.val} />
              <Text fontSize={12} color="$textLight" fontFamily="$body">
                for when things get real. study these. memorize them. survive.
              </Text>
            </XStack>
          </Stack>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {EMERGENCY_PROTOCOLS.map((protocol, index) => (
              <ProtocolCard key={index} protocol={protocol} />
            ))}

            <Stack
              backgroundColor="$bgSurface100"
              borderWidth={1}
              borderColor="$borderDefault"
              borderRadius="$3"
              padding="$5"
            >
              <XStack alignItems="center" gap="$2" marginBottom="$3">
                <Heart size={16} color={colors.accent.val} />
                <Text
                  fontSize={12}
                  fontWeight="700"
                  color="$accent"
                  fontFamily="$body"
                  letterSpacing={1}
                >
                  FINAL WISDOM
                </Text>
              </XStack>
              <Text fontSize={14} color="$textLight" fontFamily="$body" lineHeight={21}>
                look, at the end of the day, she just wants to feel understood. you don't have to fix everything. sometimes just being there and not saying dumb stuff is enough. you got this king. probably.
              </Text>
            </Stack>
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </DottedBackground>
  )
}
