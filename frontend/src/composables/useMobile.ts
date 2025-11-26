/**
 * Composable for mobile detection and capabilities
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'
import { BREAKPOINTS } from '@/constants/ui'

export function useMobile() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
  const isNativePlatform = Capacitor.isNativePlatform()
  const platform = Capacitor.getPlatform()

  const isMobile = computed(() => windowWidth.value < BREAKPOINTS.tablet)
  const isTablet = computed(() =>
    windowWidth.value >= BREAKPOINTS.tablet &&
    windowWidth.value < BREAKPOINTS.desktop
  )
  const isDesktop = computed(() => windowWidth.value >= BREAKPOINTS.desktop)

  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    isNativePlatform,
    platform,
    windowWidth,
  }
}

/**
 * Composable for status bar management
 */
export function useStatusBar() {
  const setDarkMode = async () => {
    if (!Capacitor.isNativePlatform()) return

    try {
      await StatusBar.setStyle({ style: Style.Dark })
      await StatusBar.setBackgroundColor({ color: '#1f2937' }) // gray-800
    } catch (error) {
      console.warn('StatusBar not available:', error)
    }
  }

  const setLightMode = async () => {
    if (!Capacitor.isNativePlatform()) return

    try {
      await StatusBar.setStyle({ style: Style.Light })
      await StatusBar.setBackgroundColor({ color: '#ffffff' })
    } catch (error) {
      console.warn('StatusBar not available:', error)
    }
  }

  const hide = async () => {
    if (!Capacitor.isNativePlatform()) return

    try {
      await StatusBar.hide()
    } catch (error) {
      console.warn('StatusBar not available:', error)
    }
  }

  const show = async () => {
    if (!Capacitor.isNativePlatform()) return

    try {
      await StatusBar.show()
    } catch (error) {
      console.warn('StatusBar not available:', error)
    }
  }

  return {
    setDarkMode,
    setLightMode,
    hide,
    show,
  }
}

/**
 * Composable for keyboard management
 */
export function useKeyboard() {
  const isKeyboardVisible = ref(false)
  const keyboardHeight = ref(0)

  const setupKeyboardListeners = () => {
    if (!Capacitor.isNativePlatform()) return

    try {
      Keyboard.addListener('keyboardWillShow', (info) => {
        isKeyboardVisible.value = true
        keyboardHeight.value = info.keyboardHeight
      })

      Keyboard.addListener('keyboardWillHide', () => {
        isKeyboardVisible.value = false
        keyboardHeight.value = 0
      })
    } catch (error) {
      console.warn('Keyboard listeners not available:', error)
    }
  }

  const hideKeyboard = async () => {
    if (!Capacitor.isNativePlatform()) return

    try {
      await Keyboard.hide()
    } catch (error) {
      console.warn('Keyboard not available:', error)
    }
  }

  onMounted(() => {
    setupKeyboardListeners()
  })

  onUnmounted(() => {
    if (Capacitor.isNativePlatform()) {
      try {
        Keyboard.removeAllListeners()
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  })

  return {
    isKeyboardVisible,
    keyboardHeight,
    hideKeyboard,
  }
}
