<template>
  <div class="loading-container" :class="{ 'loading-fullscreen': fullscreen }">
    <div class="spinner" :class="sizeClass"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullscreen: false,
})

const sizeClass = computed(() => `spinner-${props.size}`)
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
}

.loading-fullscreen {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.95);
  z-index: 9999;
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  border-color: rgba(14, 165, 233, 0.2);
  border-top-color: #0ea5e9;
  animation: spin 0.8s linear infinite;
}

.spinner-sm {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner-md {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner-lg {
  width: 64px;
  height: 64px;
  border-width: 4px;
}

.loading-message {
  color: #d1d5db;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
