/**
 * Validation Constants and Rules
 */

export const VALIDATION_RULES = {
  item: {
    name: {
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_.,()&]+$/,
    },
    quantity: {
      min: 0,
      max: 999999,
    },
    dailyConsumption: {
      min: 0,
      max: 1000,
    },
    price: {
      min: 0,
      max: 999999,
    },
    lowStockThreshold: {
      min: 1,
      max: 365,
    },
  },
  url: {
    pattern: /^https?:\/\/.+/,
    maxLength: 2000,
  },
} as const

export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidName: 'Name contains invalid characters',
  invalidNumber: 'Please enter a valid number',
  invalidUrl: 'Please enter a valid URL',
  minValue: (min: number) => `Value must be at least ${min}`,
  maxValue: (max: number) => `Value must be at most ${max}`,
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
} as const

export const DEFAULT_VALUES = {
  item: {
    lowStockThreshold: 3,
    quantity: 0,
    dailyConsumption: 1,
    price: 0,
    currency: 'USD',
  },
} as const
