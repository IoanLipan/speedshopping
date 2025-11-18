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
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="router.back()" class="btn btn-secondary">
              ← Back
            </button>
            <h1 class="text-2xl font-bold text-primary-600">Spending Analytics</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <p class="text-sm text-gray-600 mb-1">Daily Spending</p>
          <p class="text-3xl font-bold text-primary-600">${{ analytics.daily.toFixed(2) }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 mb-1">Weekly Spending</p>
          <p class="text-3xl font-bold text-primary-600">${{ analytics.weekly.toFixed(2) }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 mb-1">Monthly Spending</p>
          <p class="text-3xl font-bold text-primary-600">${{ analytics.monthly.toFixed(2) }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 mb-1">Yearly Spending</p>
          <p class="text-3xl font-bold text-primary-600">${{ analytics.yearly.toFixed(2) }}</p>
        </div>
      </div>

      <!-- By Category -->
      <div class="card mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Spending by Category</h2>
        <div v-if="Object.keys(analytics.byCategory).length === 0" class="text-center py-8 text-gray-500">
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
                <span class="font-medium text-gray-900">{{ category }}</span>
                <span class="font-semibold text-primary-600">${{ amount.toFixed(2) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-primary-500 h-2 rounded-full"
                  :style="{ width: `${analytics.monthly > 0 ? (amount / analytics.monthly) * 100 : 0}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- By Item -->
      <div class="card">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Top Items by Spending</h2>
        <div v-if="Object.keys(analytics.byItem).length === 0" class="text-center py-8 text-gray-500">
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
                <span class="font-medium text-gray-900">{{ item }}</span>
                <span class="font-semibold text-primary-600">${{ amount.toFixed(2) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
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
