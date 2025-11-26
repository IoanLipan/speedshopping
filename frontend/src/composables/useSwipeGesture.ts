/**
 * Composable for swipe gesture handling
 */

import { ref } from 'vue'
import { SWIPE_THRESHOLDS } from '@/constants/ui'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void | Promise<void>
  onSwipeRight?: () => void | Promise<void>
  threshold?: number
  enableHaptics?: boolean
}

export function useSwipeGesture(options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = SWIPE_THRESHOLDS.trigger,
    enableHaptics = true,
  } = options

  const offsetX = ref(0)
  const swipeDirection = ref<'left' | 'right' | null>(null)
  const isActive = ref(false)

  let startX = 0
  let startY = 0
  let startTime = 0
  let currentX = 0

  const triggerHaptic = async () => {
    if (enableHaptics) {
      try {
        await Haptics.impact({ style: ImpactStyle.Medium })
      } catch (error) {
        // Haptics not available on web
      }
    }
  }

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    startTime = Date.now()
    isActive.value = true
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!isActive.value) return

    const touch = event.touches[0]
    currentX = touch.clientX
    const currentY = touch.clientY

    const deltaX = currentX - startX
    const deltaY = currentY - startY

    // Prevent vertical scroll if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault()
    }

    offsetX.value = deltaX
    swipeDirection.value = deltaX > 0 ? 'right' : 'left'
  }

  const handleTouchEnd = async () => {
    if (!isActive.value) return

    const deltaX = currentX - startX
    const duration = Date.now() - startTime
    const velocity = Math.abs(deltaX) / duration

    const shouldTrigger =
      Math.abs(deltaX) > threshold ||
      (velocity > SWIPE_THRESHOLDS.velocity && duration < SWIPE_THRESHOLDS.maxDuration)

    if (shouldTrigger) {
      await triggerHaptic()

      if (deltaX > 0 && onSwipeRight) {
        await onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        await onSwipeLeft()
      }
    }

    // Reset
    offsetX.value = 0
    swipeDirection.value = null
    isActive.value = false
    startX = 0
    startY = 0
    currentX = 0
  }

  const handleMouseDown = (event: MouseEvent) => {
    startX = event.clientX
    startY = event.clientY
    startTime = Date.now()
    isActive.value = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive.value) return

      currentX = e.clientX
      const deltaX = currentX - startX

      offsetX.value = deltaX
      swipeDirection.value = deltaX > 0 ? 'right' : 'left'
    }

    const handleMouseUp = async () => {
      if (!isActive.value) return

      const deltaX = currentX - startX
      const duration = Date.now() - startTime
      const velocity = Math.abs(deltaX) / duration

      const shouldTrigger =
        Math.abs(deltaX) > threshold ||
        (velocity > SWIPE_THRESHOLDS.velocity && duration < SWIPE_THRESHOLDS.maxDuration)

      if (shouldTrigger) {
        await triggerHaptic()

        if (deltaX > 0 && onSwipeRight) {
          await onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          await onSwipeLeft()
        }
      }

      // Reset
      offsetX.value = 0
      swipeDirection.value = null
      isActive.value = false

      // Remove listeners
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return {
    offsetX,
    swipeDirection,
    isActive,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
  }
}
