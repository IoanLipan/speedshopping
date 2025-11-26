/**
 * Validation Utilities
 */

import { VALIDATION_RULES, ERROR_MESSAGES } from '@/constants/validation'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

/**
 * Validate item name
 */
export function validateItemName(name: string): ValidationResult {
  const sanitized = sanitizeString(name)

  if (sanitized.length < VALIDATION_RULES.item.name.minLength) {
    return { isValid: false, error: ERROR_MESSAGES.required }
  }

  if (sanitized.length > VALIDATION_RULES.item.name.maxLength) {
    return { isValid: false, error: ERROR_MESSAGES.maxLength(VALIDATION_RULES.item.name.maxLength) }
  }

  if (!VALIDATION_RULES.item.name.pattern.test(sanitized)) {
    return { isValid: false, error: ERROR_MESSAGES.invalidName }
  }

  return { isValid: true }
}

/**
 * Validate numeric value within range
 */
export function validateNumber(
  value: number,
  min: number,
  max: number
): ValidationResult {
  if (isNaN(value) || !isFinite(value)) {
    return { isValid: false, error: ERROR_MESSAGES.invalidNumber }
  }

  if (value < min) {
    return { isValid: false, error: ERROR_MESSAGES.minValue(min) }
  }

  if (value > max) {
    return { isValid: false, error: ERROR_MESSAGES.maxValue(max) }
  }

  return { isValid: true }
}

/**
 * Validate URL
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) return { isValid: true } // Optional field

  const sanitized = sanitizeString(url)

  if (!VALIDATION_RULES.url.pattern.test(sanitized)) {
    return { isValid: false, error: ERROR_MESSAGES.invalidUrl }
  }

  if (sanitized.length > VALIDATION_RULES.url.maxLength) {
    return { isValid: false, error: ERROR_MESSAGES.maxLength(VALIDATION_RULES.url.maxLength) }
  }

  return { isValid: true }
}

/**
 * Validate quantity
 */
export function validateQuantity(quantity: number): ValidationResult {
  return validateNumber(
    quantity,
    VALIDATION_RULES.item.quantity.min,
    VALIDATION_RULES.item.quantity.max
  )
}

/**
 * Validate price
 */
export function validatePrice(price: number): ValidationResult {
  return validateNumber(
    price,
    VALIDATION_RULES.item.price.min,
    VALIDATION_RULES.item.price.max
  )
}

/**
 * Validate daily consumption
 */
export function validateDailyConsumption(consumption: number): ValidationResult {
  return validateNumber(
    consumption,
    VALIDATION_RULES.item.dailyConsumption.min,
    VALIDATION_RULES.item.dailyConsumption.max
  )
}
