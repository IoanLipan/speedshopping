<template>
  <div class="error-container" :class="{ 'error-fullscreen': fullscreen }">
    <div class="error-icon">
      <AlertTriangle :size="iconSize" />
    </div>
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>
    <button v-if="onRetry" @click="onRetry" class="retry-button">
      <RefreshCw :size="18" />
      <span>Try Again</span>
    </button>
    <button v-if="onDismiss" @click="onDismiss" class="dismiss-button">
      Dismiss
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, RefreshCw } from 'lucide-vue-next'

interface Props {
  title?: string
  message: string
  fullscreen?: boolean
  onRetry?: () => void
  onDismiss?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  fullscreen: false,
})

const iconSize = computed(() => props.fullscreen ? 64 : 48)
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
}

.error-fullscreen {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.98);
  z-index: 9999;
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
}

.error-title {
  font-size: 20px;
  font-weight: 700;
  color: #f9fafb;
  margin: 0;
}

.error-message {
  font-size: 14px;
  color: #9ca3af;
  max-width: 400px;
  margin: 0;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.3);
}

.retry-button:hover {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.4);
  transform: translateY(-2px);
}

.retry-button:active {
  transform: translateY(0);
}

.dismiss-button {
  padding: 8px 16px;
  background: transparent;
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dismiss-button:hover {
  background: rgba(156, 163, 175, 0.1);
  border-color: rgba(156, 163, 175, 0.5);
}
</style>
