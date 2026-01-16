/**
 * @AngelaMos | 2026
 * tokens.ts
 */

import { createTokens } from 'tamagui'

export const tokens = createTokens({
  color: {
    bgDefault: '#0a0a0a',
    bgAlternative: '#080808',
    bgPage: '#0f0f0f',
    bgCard: '#0c0c0c',

    bgShellBase: '#0c0c0c',
    bgShellDot: '#252525',

    bgContentBase: '#080808',
    bgContentDot: '#1f1f1f',

    bgSurface75: '#121212',
    bgSurface100: '#141414',
    bgSurface200: '#1a1a1a',
    bgSurface300: '#222222',

    bgControl: '#141414',
    bgSelection: '#2a2a2a',
    bgOverlay: '#1a1a1a',
    bgOverlayHover: '#222222',

    borderMuted: '#1a1a1a',
    borderDefault: '#252525',
    borderStrong: '#333333',
    borderStronger: '#404040',
    borderControl: '#303030',

    textDefault: '#f5f5f5',
    textLight: '#a3a3a3',
    textLighter: '#737373',
    textMuted: '#525252',

    white: '#ffffff',
    black: '#000000',

    accent: '#9b1c1c',
    accentDark: '#7f1d1d',
    accentLight: '#b91c1c',
    accentMuted: '#450a0a',
    accentSubtle: '#1c0a0a',
    accentBorder: '#3b0f0f',

    secondary: '#d97706',
    secondaryLight: '#f59e0b',
    secondaryMuted: '#451a03',

    phaseRed: '#dc2626',
    phasePink: '#ec4899',
    phaseAmber: '#f59e0b',
    phaseSlate: '#64748b',

    errorDefault: '#dc2626',
    errorLight: '#ef4444',

    transparent: 'transparent',
  },

  space: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    true: 16,
  },

  size: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    true: 16,
  },

  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    true: 12,
  },

  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
})

export const colors = tokens.color

export const gridConfig = {
  dotSize: 1.2,
  dotSpacing: 14,
} as const
