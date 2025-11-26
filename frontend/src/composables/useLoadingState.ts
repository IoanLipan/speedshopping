/**
 * Composable for managing loading states
 */

import { ref } from 'vue'

export function useLoadingState(initialState = false) {
  const isLoading = ref(initialState)
  const loadingMessage = ref<string>('')

  const startLoading = (message?: string) => {
    isLoading.value = true
    loadingMessage.value = message || ''
  }

  const stopLoading = () => {
    isLoading.value = false
    loadingMessage.value = ''
  }

  const withLoading = async <T>(
    fn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    startLoading(message)
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading,
  }
}

/**
 * Composable for managing multiple loading states
 */
export function useMultipleLoadingStates() {
  const loadingStates = ref<Record<string, boolean>>({})
  const loadingMessages = ref<Record<string, string>>({})

  const startLoading = (key: string, message?: string) => {
    loadingStates.value[key] = true
    if (message) {
      loadingMessages.value[key] = message
    }
  }

  const stopLoading = (key: string) => {
    loadingStates.value[key] = false
    delete loadingMessages.value[key]
  }

  const isLoading = (key: string): boolean => {
    return !!loadingStates.value[key]
  }

  const isAnyLoading = (): boolean => {
    return Object.values(loadingStates.value).some(Boolean)
  }

  return {
    loadingStates,
    loadingMessages,
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
  }
}
