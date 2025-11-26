/**
 * Composable for centralized error handling
 */

import { ref } from 'vue'

export interface AppError {
  message: string
  code?: string
  details?: unknown
}

export function useErrorHandler() {
  const error = ref<AppError | null>(null)
  const isError = ref(false)

  const handleError = (err: unknown, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, err)

    if (err instanceof Error) {
      error.value = {
        message: err.message,
        details: err,
      }
    } else if (typeof err === 'string') {
      error.value = {
        message: err,
      }
    } else if (err && typeof err === 'object' && 'message' in err) {
      error.value = {
        message: String(err.message),
        code: 'code' in err ? String(err.code) : undefined,
        details: err,
      }
    } else {
      error.value = {
        message: 'An unexpected error occurred',
        details: err,
      }
    }

    isError.value = true
  }

  const clearError = () => {
    error.value = null
    isError.value = false
  }

  const getUserFriendlyMessage = (err: unknown): string => {
    if (!err) return 'An unexpected error occurred'

    if (err instanceof Error) {
      // Network errors
      if (err.message.includes('fetch') || err.message.includes('network')) {
        return 'Network error. Please check your connection.'
      }

      // Auth errors
      if (err.message.includes('auth') || err.message.includes('unauthorized')) {
        return 'Authentication failed. Please log in again.'
      }

      return err.message
    }

    if (typeof err === 'string') {
      return err
    }

    if (err && typeof err === 'object' && 'message' in err) {
      return String(err.message)
    }

    return 'An unexpected error occurred'
  }

  return {
    error,
    isError,
    handleError,
    clearError,
    getUserFriendlyMessage,
  }
}

/**
 * Async wrapper with error handling
 */
export async function tryAsync<T>(
  fn: () => Promise<T>,
  onError?: (error: unknown) => void
): Promise<{ data: T | null; error: unknown | null }> {
  try {
    const data = await fn()
    return { data, error: null }
  } catch (error) {
    if (onError) {
      onError(error)
    }
    return { data: null, error }
  }
}
