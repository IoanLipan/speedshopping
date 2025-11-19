<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { analyticsService } from '@/services/api'
import type { SpendingAnalytics } from '@/types'

const router = useRouter()
const period = ref<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
const loading = ref(false)

const analytics = ref<SpendingAnalytics>({
  daily: 0,
  weekly: 0,
  monthly: 0,
  yearly: 0,
  byCategory: {},
  byItem: {},
})

async function fetchAnalytics() {
  loading.value = true
  try {
    const data = await analyticsService.getSpending(period.value)
    analytics.value = data
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnalytics()
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-100">Analytics</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto px-4 py-6">
      <!-- Period Selector -->
      <div class="mb-6 flex gap-2">
        <button
          @click="period = 'daily'"
          :class="['btn', period === 'daily' ? 'btn-primary' : 'btn-secondary']"
        >
          Daily
        </button>
        <button
          @click="period = 'weekly'"
          :class="['btn', period === 'weekly' ? 'btn-primary' : 'btn-secondary']"
        >
          Weekly
        </button>
        <button
          @click="period = 'monthly'"
          :class="['btn', period === 'monthly' ? 'btn-primary' : 'btn-secondary']"
        >
          Monthly
        </button>
        <button
          @click="period = 'yearly'"
          :class="['btn', period === 'yearly' ? 'btn-primary' : 'btn-secondary']"
        >
          Yearly
        </button>
      </div>

      <!-- Overview -->
      <div class="grid grid-cols-2 gap-3 mb-8">
        <div class="card">
          <p class="text-xs text-gray-400 mb-1">Daily</p>
          <p class="text-2xl font-bold text-gray-100">${{ analytics.daily.toFixed(2) }}</p>
        </div>
        <div class="card">
          <p class="text-xs text-gray-400 mb-1">Weekly</p>
          <p class="text-2xl font-bold text-gray-100">${{ analytics.weekly.toFixed(2) }}</p>
        </div>
        <div class="card">
          <p class="text-xs text-gray-400 mb-1">Monthly</p>
          <p class="text-2xl font-bold text-gray-100">${{ analytics.monthly.toFixed(2) }}</p>
        </div>
        <div class="card">
          <p class="text-xs text-gray-400 mb-1">Yearly</p>
          <p class="text-2xl font-bold text-gray-100">${{ analytics.yearly.toFixed(2) }}</p>
        </div>
      </div>

      <!-- By Category -->
      <div class="card mb-8">
        <h2 class="text-lg font-semibold text-gray-100 mb-4">Spending by Category</h2>
        <div v-if="Object.keys(analytics.byCategory).length === 0" class="text-center py-8 text-gray-400">
          No category data available yet. Start tracking items to see analytics!
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="(amount, category) in analytics.byCategory"
            :key="category"
            class="flex items-center justify-between"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-gray-100">{{ category }}</span>
                <span class="font-semibold text-blue-400">${{ amount.toFixed(2) }}</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div
                  class="bg-blue-500 h-2 rounded-full"
                  :style="{ width: `${analytics.monthly > 0 ? (amount / analytics.monthly) * 100 : 0}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- By Item -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-100 mb-4">Top Items by Spending</h2>
        <div v-if="Object.keys(analytics.byItem).length === 0" class="text-center py-8 text-gray-400">
          No item data available yet. Start tracking items to see analytics!
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="(amount, item) in analytics.byItem"
            :key="item"
            class="flex items-center justify-between"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-gray-100">{{ item }}</span>
                <span class="font-semibold text-green-400">${{ amount.toFixed(2) }}</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full"
                  :style="{ width: `${analytics.monthly > 0 ? (amount / analytics.monthly) * 100 : 0}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
