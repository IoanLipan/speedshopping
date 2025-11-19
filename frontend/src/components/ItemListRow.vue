<template>
  <div class="item-row">
    <div class="flex items-center gap-3 flex-1">
      <!-- Icon/Avatar -->
      <div class="item-icon" :class="getStatusClass()">
        <Package :size="20" />
      </div>

      <!-- Item Info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium text-gray-100 truncate">{{ itemName }}</h3>
        <p class="text-xs text-gray-400">{{ quantity }} {{ unit }} • {{ dailyConsumption }}/day</p>
      </div>
    </div>

    <!-- Status and Progress -->
    <div class="flex items-center gap-3">
      <!-- Days Remaining -->
      <div class="text-right">
        <p class="text-sm font-semibold" :class="getTextColor()">{{ daysRemaining }}d</p>
        <p class="text-xs text-gray-400">remaining</p>
      </div>

      <!-- Progress Bar -->
      <div class="progress-circle" :class="getStatusClass()">
        <svg class="progress-ring" width="40" height="40">
          <circle
            class="progress-ring-bg"
            stroke="currentColor"
            stroke-width="3"
            fill="transparent"
            r="16"
            cx="20"
            cy="20"
          />
          <circle
            class="progress-ring-fill"
            stroke="currentColor"
            stroke-width="3"
            fill="transparent"
            r="16"
            cx="20"
            cy="20"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
          />
        </svg>
        <div class="progress-percentage">{{ stockPercentage }}%</div>
      </div>
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
}

const props = withDefaults(defineProps<Props>(), {
  unit: 'units'
})

// Calculate stock percentage
const stockPercentage = computed(() => {
  const maxDays = props.lowStockThreshold * 3
  const percentage = Math.min((props.daysRemaining / maxDays) * 100, 100)
  return Math.round(percentage)
})

// Calculate circumference for progress circle
const circumference = 2 * Math.PI * 16

// Calculate stroke-dashoffset for progress
const strokeDashoffset = computed(() => {
  const progress = stockPercentage.value / 100
  return circumference * (1 - progress)
})

// Determine stock level
const stockLevel = computed(() => {
  if (props.daysRemaining <= props.lowStockThreshold) return 'critical'
  if (props.daysRemaining <= props.lowStockThreshold * 2) return 'warning'
  if (props.daysRemaining <= props.lowStockThreshold * 3) return 'good'
  return 'excellent'
})

const getStatusClass = () => {
  const classes = {
    critical: 'status-critical',
    warning: 'status-warning',
    good: 'status-good',
    excellent: 'status-excellent'
  }
  return classes[stockLevel.value]
}

const getTextColor = () => {
  const colors = {
    critical: 'text-red-400',
    warning: 'text-orange-400',
    good: 'text-green-400',
    excellent: 'text-blue-400'
  }
  return colors[stockLevel.value]
}
</script>

<style scoped>
.item-row {
  @apply bg-gray-800 rounded-2xl p-4 border border-gray-700;
  @apply flex items-center gap-4;
  @apply hover:border-gray-600 transition-all duration-150;
  @apply active:scale-98;
}

.item-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center;
  @apply transition-all duration-150;
}

.item-icon.status-critical {
  @apply bg-red-900/30 text-red-400;
}

.item-icon.status-warning {
  @apply bg-orange-900/30 text-orange-400;
}

.item-icon.status-good {
  @apply bg-green-900/30 text-green-400;
}

.item-icon.status-excellent {
  @apply bg-blue-900/30 text-blue-400;
}

.progress-circle {
  @apply relative;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-bg {
  @apply opacity-20;
}

.progress-ring-fill {
  transition: stroke-dashoffset 0.3s ease;
}

.status-critical .progress-ring-bg,
.status-critical .progress-ring-fill {
  @apply text-red-400;
}

.status-warning .progress-ring-bg,
.status-warning .progress-ring-fill {
  @apply text-orange-400;
}

.status-good .progress-ring-bg,
.status-good .progress-ring-fill {
  @apply text-green-400;
}

.status-excellent .progress-ring-bg,
.status-excellent .progress-ring-fill {
  @apply text-blue-400;
}

.progress-percentage {
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  @apply text-[10px] font-semibold text-gray-100;
  pointer-events: none;
}
</style>
