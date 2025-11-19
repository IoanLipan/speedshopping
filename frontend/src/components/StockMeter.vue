<template>
  <div class="stock-item">
    <!-- Item name and icon -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <Package :size="18" class="text-gray-700" />
        <h3 class="text-sm font-medium text-gray-900">{{ itemName }}</h3>
      </div>
      <div :class="daysBadgeClass">
        {{ daysRemaining }}d
      </div>
    </div>

    <!-- Stock meter progress bar -->
    <div class="stock-meter mb-3">
      <div
        :class="['stock-meter-fill', stockMeterClass]"
        :style="{ width: stockPercentage + '%' }"
      />
    </div>

    <!-- Additional info -->
    <div class="flex justify-between text-xs text-gray-600">
      <span>{{ quantity }} {{ unit }}</span>
      <span>{{ dailyConsumption }}/day</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Package } from 'lucide-vue-next'

interface Props {
  itemName: string
  daysRemaining: number
  lowStockThreshold: number
  quantity: number
  dailyConsumption: number
  unit?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: 'units',
  icon: 'package'
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
</script>

<style scoped>
.stock-item {
  @apply bg-white rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-150;
}
</style>
