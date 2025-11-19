<template>
  <div class="stock-item">
    <!-- Item name and emoji -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <span class="text-4xl">{{ emoji }}</span>
        <h3 class="text-xl font-bold text-gray-800">{{ itemName }}</h3>
      </div>
      <div :class="daysBadgeClass">
        {{ daysRemaining }} {{ daysRemaining === 1 ? 'day' : 'days' }}
      </div>
    </div>

    <!-- Stock meter progress bar -->
    <div class="stock-meter">
      <div
        :class="['stock-meter-fill', stockMeterClass]"
        :style="{ width: stockPercentage + '%' }"
      >
        <div class="flex items-center justify-center h-full">
          <span class="text-white font-bold text-sm drop-shadow-lg" v-if="stockPercentage > 15">
            {{ stockPercentage }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Stock status text -->
    <div class="mt-2 text-center">
      <p :class="['text-sm font-bold', statusTextClass]">
        {{ statusMessage }}
      </p>
    </div>

    <!-- Additional info -->
    <div class="mt-3 flex justify-between text-sm text-gray-600">
      <span>📦 {{ quantity }} {{ unit }}</span>
      <span>📉 {{ dailyConsumption }}/day</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  itemName: string
  daysRemaining: number
  lowStockThreshold: number
  quantity: number
  dailyConsumption: number
  unit?: string
  emoji?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: 'units',
  emoji: '📦'
})

// Calculate stock percentage based on threshold
const stockPercentage = computed(() => {
  const maxDays = props.lowStockThreshold * 3 // 3x threshold = 100%
  const percentage = Math.min((props.daysRemaining / maxDays) * 100, 100)
  return Math.round(percentage)
})

// Determine stock level category
const stockLevel = computed(() => {
  if (props.daysRemaining <= props.lowStockThreshold) return 'critical'
  if (props.daysRemaining <= props.lowStockThreshold * 2) return 'warning'
  if (props.daysRemaining <= props.lowStockThreshold * 3) return 'good'
  return 'excellent'
})

// Stock meter color class
const stockMeterClass = computed(() => {
  return `stock-meter-${stockLevel.value}`
})

// Days badge styling
const daysBadgeClass = computed(() => {
  return `days-badge days-badge-${stockLevel.value}`
})

// Status text color
const statusTextClass = computed(() => {
  switch (stockLevel.value) {
    case 'critical': return 'text-red-600'
    case 'warning': return 'text-orange-600'
    case 'good': return 'text-green-600'
    default: return 'text-blue-600'
  }
})

// Status message
const statusMessage = computed(() => {
  switch (stockLevel.value) {
    case 'critical': return '🚨 ORDER NOW! Running out soon!'
    case 'warning': return '⚠️ Getting low - consider ordering'
    case 'good': return '✅ Stock is good'
    default: return '🎉 Excellent stock!'
  }
})
</script>

<style scoped>
.stock-item {
  @apply bg-white rounded-2xl p-6 shadow-lg border-4 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:scale-105;
}
</style>
