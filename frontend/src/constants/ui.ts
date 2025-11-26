/**
 * UI Constants - Centralized design system values
 */

export const COLORS = {
  // Primary palette
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Priority colors
  priority: {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  },
} as const

export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const

export const TOUCH_TARGETS = {
  minimum: 44,     // Minimum touch target size (iOS HIG)
  comfortable: 48, // Comfortable touch target (Material Design)
  large: 56,       // Large touch target for primary actions
} as const

export const SWIPE_THRESHOLDS = {
  trigger: 100,    // Distance to trigger action
  velocity: 0.5,   // Minimum velocity to trigger
  maxDuration: 300, // Maximum duration for swipe gesture
} as const

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

export const Z_INDEX = {
  dropdown: 1000,
  modal: 1100,
  toast: 1200,
  tooltip: 1300,
} as const
