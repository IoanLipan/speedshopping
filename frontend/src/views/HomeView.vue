<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSupplyStore } from '@/stores/supply'
import { useNecessityStore } from '@/stores/necessity'
import StockMeter from '@/components/StockMeter.vue'

const router = useRouter()
const authStore = useAuthStore()
const supplyStore = useSupplyStore()
const necessityStore = useNecessityStore()

const stats = computed(() => ({
  lowStockCount: supplyStore.lowStockItems.length,
  necessityCount: necessityStore.activeItems.length,
  totalInventoryValue: supplyStore.totalValue,
  shoppingListCost: necessityStore.totalCost,
}))

// Get items sorted by days remaining for display
const criticalItems = computed(() =>
  supplyStore.items
    .filter(item => item.daysRemaining <= item.lowStockThreshold)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 6) // Show top 6 critical items
)

const allItemsSorted = computed(() =>
  supplyStore.items
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 8) // Show top 8 items
)

// Get emoji from product templates if available
function getItemEmoji(itemName: string): string {
  const emojiMap: Record<string, string> = {
    'eggs': '🥚', 'milk': '🥛', 'cheese': '🧀', 'bread': '🍞', 'butter': '🧈',
    'coffee': '☕', 'pasta': '🍝', 'rice': '🍚', 'oil': '🫒',
    'toilet paper': '🧻', 'sponge': '🧽', 'soap': '🧴', 'detergent': '🧼',
    'shampoo': '🧴', 'toothpaste': '🪥', 'apple': '🍎', 'banana': '🍌',
    'tomato': '🍅', 'potato': '🥔', 'onion': '🧅', 'carrot': '🥕'
  }

  const lowerName = itemName.toLowerCase()
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lowerName.includes(key)) return emoji
  }
  return '📦'
}

onMounted(() => {
  supplyStore.fetchItems()
  necessityStore.fetchItems()
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Game-style Header -->
    <header class="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 shadow-2xl">
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-5xl animate-bounce-slow">🛒</span>
            <h1 class="text-4xl font-black text-white drop-shadow-lg">SpeedShopping</h1>
          </div>
          <button @click="logout" class="btn btn-secondary">
            👋 Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Welcome Banner -->
      <div class="mb-8 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-3xl shadow-2xl p-8 text-center border-4 border-white">
        <h2 class="text-5xl font-black text-white mb-3 drop-shadow-lg animate-pulse-slow">
          🎮 Welcome Back{{ authStore.user?.displayName ? ', ' + authStore.user.displayName : '' }}! 🎮
        </h2>
        <p class="text-2xl font-bold text-white drop-shadow-md">Let's manage your inventory like a game!</p>
      </div>

      <!-- Stats Grid - Big and Bold! -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="stat-card bg-gradient-to-br from-red-100 to-red-200">
          <div class="text-center">
            <div class="text-6xl mb-3">🚨</div>
            <p class="text-lg font-bold text-red-800 mb-2">Low Stock Items</p>
            <p class="text-6xl font-black text-red-600">{{ stats.lowStockCount }}</p>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-purple-100 to-purple-200">
          <div class="text-center">
            <div class="text-6xl mb-3">📋</div>
            <p class="text-lg font-bold text-purple-800 mb-2">To Buy</p>
            <p class="text-6xl font-black text-purple-600">{{ stats.necessityCount }}</p>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-green-100 to-green-200">
          <div class="text-center">
            <div class="text-6xl mb-3">💰</div>
            <p class="text-lg font-bold text-green-800 mb-2">Inventory Value</p>
            <p class="text-4xl font-black text-green-600">${{ stats.totalInventoryValue.toFixed(2) }}</p>
          </div>
        </div>

        <div class="stat-card bg-gradient-to-br from-blue-100 to-cyan-200">
          <div class="text-center">
            <div class="text-6xl mb-3">🛍️</div>
            <p class="text-lg font-bold text-blue-800 mb-2">Shopping Cost</p>
            <p class="text-4xl font-black text-blue-600">${{ stats.shoppingListCost.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Stock Level Dashboard - The Star of the Show! -->
      <div v-if="criticalItems.length > 0" class="mb-12">
        <div class="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl shadow-2xl p-8 border-4 border-white mb-6">
          <h2 class="text-4xl font-black text-white mb-2 text-center flex items-center justify-center gap-3">
            <span class="text-5xl animate-bounce">⚡</span>
            CRITICAL ITEMS - ORDER NOW!
            <span class="text-5xl animate-bounce">⚡</span>
          </h2>
          <p class="text-xl font-bold text-white text-center">These items need your attention immediately!</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StockMeter
            v-for="item in criticalItems"
            :key="item.id"
            :item-name="item.name"
            :days-remaining="item.daysRemaining"
            :low-stock-threshold="item.lowStockThreshold"
            :quantity="item.quantity"
            :daily-consumption="item.dailyConsumption"
            :unit="item.unit || 'units'"
            :emoji="getItemEmoji(item.name)"
          />
        </div>
      </div>

      <!-- All Items Stock Overview -->
      <div v-if="allItemsSorted.length > 0" class="mb-12">
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl shadow-2xl p-6 border-4 border-white mb-6">
          <h2 class="text-3xl font-black text-white text-center flex items-center justify-center gap-3">
            <span class="text-4xl">📊</span>
            Your Inventory at a Glance
            <span class="text-4xl">📊</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StockMeter
            v-for="item in allItemsSorted"
            :key="item.id"
            :item-name="item.name"
            :days-remaining="item.daysRemaining"
            :low-stock-threshold="item.lowStockThreshold"
            :quantity="item.quantity"
            :daily-consumption="item.dailyConsumption"
            :unit="item.unit || 'units'"
            :emoji="getItemEmoji(item.name)"
          />
        </div>
      </div>

      <!-- Quick Actions - BIG GAME BUTTONS! -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl shadow-2xl p-6 border-4 border-white mb-6">
          <h2 class="text-3xl font-black text-white text-center">🎯 Quick Actions 🎯</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <router-link to="/supply" class="action-card from-purple-500 to-pink-500">
            <div class="text-center">
              <div class="text-7xl mb-4">📦</div>
              <h3 class="text-2xl font-black mb-2">Supply List</h3>
              <p class="text-lg font-bold">Manage your inventory</p>
            </div>
          </router-link>

          <router-link to="/necessity" class="action-card from-blue-500 to-cyan-500">
            <div class="text-center">
              <div class="text-7xl mb-4">✅</div>
              <h3 class="text-2xl font-black mb-2">Shopping List</h3>
              <p class="text-lg font-bold">Track what to buy</p>
            </div>
          </router-link>

          <router-link to="/analytics" class="action-card from-green-500 to-emerald-500">
            <div class="text-center">
              <div class="text-7xl mb-4">📈</div>
              <h3 class="text-2xl font-black mb-2">Analytics</h3>
              <p class="text-lg font-bold">View your stats</p>
            </div>
          </router-link>

          <router-link to="/settings" class="action-card from-orange-500 to-red-500">
            <div class="text-center">
              <div class="text-7xl mb-4">⚙️</div>
              <h3 class="text-2xl font-black mb-2">Settings</h3>
              <p class="text-lg font-bold">Configure account</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="supplyStore.items.length === 0" class="text-center py-12">
        <div class="text-8xl mb-6 animate-bounce">🎮</div>
        <h3 class="text-3xl font-black text-white mb-4 drop-shadow-lg">Ready to Start Your Inventory Adventure?</h3>
        <p class="text-xl font-bold text-white mb-8 drop-shadow">Add your first items to start tracking!</p>
        <router-link to="/supply" class="btn btn-primary text-2xl">
          🚀 Let's Go!
        </router-link>
      </div>
    </main>
  </div>
</template>
