/**
 * @AngelaMos | 2026
 * achievements.tsx
 */

import {
  ACHIEVEMENTS,
  AchievementId,
  RARITY_BG_COLORS,
  RARITY_COLORS,
  RARITY_LABELS,
} from '@/api/types'
import { DottedBackground } from '@/shared/components'
import { colors } from '@/theme/tokens'
import { router } from 'expo-router'
import {
  Award,
  Baby,
  ChevronLeft,
  CloudLightning,
  Cookie,
  Crown,
  Flame,
  GraduationCap,
  HeartHandshake,
  Lock,
  Medal,
  ShieldCheck,
  Siren,
  Trophy,
  VolumeX,
} from 'lucide-react-native'
import type React from 'react'
import { Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Text, XStack, YStack } from 'tamagui'

const ICON_MAP: Record<string, React.ReactNode> = {
  baby: <Baby size={24} color={colors.textDefault.val} />,
  flame: <Flame size={24} color={colors.textDefault.val} />,
  trophy: <Trophy size={24} color={colors.textDefault.val} />,
  cookie: <Cookie size={24} color={colors.textDefault.val} />,
  'volume-x': <VolumeX size={24} color={colors.textDefault.val} />,
  'heart-handshake': <HeartHandshake size={24} color={colors.textDefault.val} />,
  siren: <Siren size={24} color={colors.textDefault.val} />,
  crown: <Crown size={24} color={colors.textDefault.val} />,
  'cloud-lightning': <CloudLightning size={24} color={colors.textDefault.val} />,
  'graduation-cap': <GraduationCap size={24} color={colors.textDefault.val} />,
  'shield-check': <ShieldCheck size={24} color={colors.textDefault.val} />,
  medal: <Medal size={24} color={colors.textDefault.val} />,
}

const UNLOCKED_DEMO: AchievementId[] = [
  AchievementId.FIRST_LOG,
  AchievementId.WEEK_STREAK,
  AchievementId.SNACK_PROVIDER,
  AchievementId.COMPLIMENT_KING,
]

function AchievementCard({
  id,
  isUnlocked,
}: {
  id: AchievementId
  isUnlocked: boolean
}): React.ReactElement {
  const achievement = ACHIEVEMENTS[id]
  const rarityColor = RARITY_COLORS[achievement.rarity]
  const rarityBg = RARITY_BG_COLORS[achievement.rarity]
  const rarityLabel = RARITY_LABELS[achievement.rarity]

  return (
    <Stack
      backgroundColor={isUnlocked ? '$bgSurface100' : '$bgSurface100'}
      borderWidth={1}
      borderColor={isUnlocked ? rarityColor : '$borderDefault'}
      borderRadius="$3"
      padding="$4"
      opacity={isUnlocked ? 1 : 0.5}
    >
      <XStack gap="$4" alignItems="flex-start">
        <Stack
          width={52}
          height={52}
          borderRadius="$2"
          backgroundColor={isUnlocked ? rarityBg : '$bgSurface200'}
          alignItems="center"
          justifyContent="center"
        >
          {isUnlocked ? (
            ICON_MAP[achievement.icon] ?? <Award size={24} color={colors.textDefault.val} />
          ) : (
            <Lock size={24} color={colors.textMuted.val} />
          )}
        </Stack>

        <YStack flex={1}>
          <XStack alignItems="center" gap="$2" marginBottom="$1">
            <Text
              fontSize={15}
              fontWeight="600"
              color={isUnlocked ? '$textDefault' : '$textMuted'}
              fontFamily="$heading"
            >
              {achievement.title}
            </Text>
          </XStack>

          <Text
            fontSize={12}
            color={isUnlocked ? '$textLight' : '$textMuted'}
            fontFamily="$body"
            lineHeight={17}
            marginBottom="$2"
          >
            {isUnlocked ? achievement.description : '???'}
          </Text>

          <Stack
            backgroundColor={isUnlocked ? `${rarityColor}20` : '$bgSurface200'}
            paddingVertical="$1"
            paddingHorizontal="$2"
            borderRadius="$1"
            alignSelf="flex-start"
          >
            <Text
              fontSize={10}
              fontWeight="700"
              color={isUnlocked ? rarityColor : '$textMuted'}
              fontFamily="$body"
              letterSpacing={0.5}
            >
              {rarityLabel}
            </Text>
          </Stack>
        </YStack>
      </XStack>
    </Stack>
  )
}

export default function AchievementsScreen(): React.ReactElement {
  const allIds = Object.values(AchievementId)
  const unlockedCount = UNLOCKED_DEMO.length
  const totalCount = allIds.length

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
              <Text
                fontSize={22}
                fontWeight="700"
                color="$textDefault"
                fontFamily="$heading"
                letterSpacing={-0.5}
              >
                Achievements
              </Text>
              <Text fontSize={13} color="$textLight" fontFamily="$body">
                {unlockedCount} / {totalCount} unlocked
              </Text>
            </YStack>
          </XStack>

          <Stack
            backgroundColor="$secondaryMuted"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="$secondary"
            paddingVertical="$3"
            paddingHorizontal="$5"
          >
            <XStack alignItems="center" gap="$2">
              <Trophy size={14} color={colors.secondaryLight.val} />
              <Text fontSize={12} color="$textLight" fontFamily="$body">
                survive cycles, collect badges, become the support she deserves
              </Text>
            </XStack>
          </Stack>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 12 }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              fontSize={11}
              fontWeight="700"
              color="$textMuted"
              fontFamily="$body"
              letterSpacing={1}
              marginBottom="$1"
            >
              UNLOCKED
            </Text>
            {UNLOCKED_DEMO.map((id) => (
              <AchievementCard key={id} id={id} isUnlocked />
            ))}

            <Text
              fontSize={11}
              fontWeight="700"
              color="$textMuted"
              fontFamily="$body"
              letterSpacing={1}
              marginTop="$4"
              marginBottom="$1"
            >
              LOCKED
            </Text>
            {allIds
              .filter((id) => !UNLOCKED_DEMO.includes(id))
              .map((id) => (
                <AchievementCard key={id} id={id} isUnlocked={false} />
              ))}
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </DottedBackground>
  )
}
