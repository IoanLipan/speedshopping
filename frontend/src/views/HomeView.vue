<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSupplyStore } from '@/stores/supply'
import { useNecessityStore } from '@/stores/necessity'
import StockMeter from '@/components/StockMeter.vue'
import {
  ShoppingCart,
  LogOut,
  AlertTriangle,
  ClipboardList,
  Wallet,
  ShoppingBag,
  Package,
  CheckCircle,
  TrendingUp,
  Settings
} from 'lucide-vue-next'

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

// Get icon name from product templates if available
function getItemIcon(itemName: string): string {
  const lowerName = itemName.toLowerCase()
  // Return icon names that will be mapped to Lucide icons in the component
  if (lowerName.includes('egg')) return 'egg'
  if (lowerName.includes('milk')) return 'milk'
  if (lowerName.includes('coffee')) return 'coffee'
  if (lowerName.includes('bread')) return 'bread'
  return 'package'
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
    <!-- Minimalist Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <ShoppingCart :size="24" class="text-gray-900" />
            <h1 class="text-xl font-semibold text-gray-900">SpeedShopping</h1>
          </div>
          <button @click="logout" class="btn btn-secondary flex items-center gap-2">
            <LogOut :size="16" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-1">
          Welcome back{{ authStore.user?.displayName ? ', ' + authStore.user.displayName : '' }}
        </h2>
        <p class="text-gray-600">Here's your inventory overview</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <AlertTriangle :size="20" class="text-red-500" />
            <span class="text-xs font-medium text-gray-500">Low Stock</span>
          </div>
          <p class="text-3xl font-semibold text-gray-900">{{ stats.lowStockCount }}</p>
          <p class="text-xs text-gray-500 mt-1">items running low</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <ClipboardList :size="20" class="text-blue-500" />
            <span class="text-xs font-medium text-gray-500">To Buy</span>
          </div>
          <p class="text-3xl font-semibold text-gray-900">{{ stats.necessityCount }}</p>
          <p class="text-xs text-gray-500 mt-1">items to purchase</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <Wallet :size="20" class="text-green-500" />
            <span class="text-xs font-medium text-gray-500">Inventory Value</span>
          </div>
          <p class="text-3xl font-semibold text-gray-900">${{ stats.totalInventoryValue.toFixed(2) }}</p>
          <p class="text-xs text-gray-500 mt-1">total value</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <ShoppingBag :size="20" class="text-orange-500" />
            <span class="text-xs font-medium text-gray-500">Shopping Cost</span>
          </div>
          <p class="text-3xl font-semibold text-gray-900">${{ stats.shoppingListCost.toFixed(2) }}</p>
          <p class="text-xs text-gray-500 mt-1">estimated cost</p>
        </div>
      </div>

      <!-- Critical Items Section -->
      <div v-if="criticalItems.length > 0" class="mb-8">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
          <div class="flex items-center gap-2 mb-1">
            <AlertTriangle :size="18" class="text-red-600" />
            <h2 class="text-base font-semibold text-red-900">Critical Items</h2>
          </div>
          <p class="text-sm text-red-700">These items need your attention</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StockMeter
            v-for="item in criticalItems"
            :key="item.id"
            :item-name="item.name"
            :days-remaining="item.daysRemaining"
            :low-stock-threshold="item.lowStockThreshold"
            :quantity="item.quantity"
            :daily-consumption="item.dailyConsumption"
            :unit="item.unit || 'units'"
            :icon="getItemIcon(item.name)"
          />
        </div>
      </div>

      <!-- All Items Overview -->
      <div v-if="allItemsSorted.length > 0" class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Inventory</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StockMeter
            v-for="item in allItemsSorted"
            :key="item.id"
            :item-name="item.name"
            :days-remaining="item.daysRemaining"
            :low-stock-threshold="item.lowStockThreshold"
            :quantity="item.quantity"
            :daily-consumption="item.dailyConsumption"
            :unit="item.unit || 'units'"
            :icon="getItemIcon(item.name)"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link to="/supply" class="action-card">
            <Package :size="24" class="text-gray-700 mb-3" />
            <h3 class="text-base font-semibold text-gray-900 mb-1">Supply List</h3>
            <p class="text-sm text-gray-600">Manage your inventory</p>
          </router-link>

          <router-link to="/necessity" class="action-card">
            <CheckCircle :size="24" class="text-gray-700 mb-3" />
            <h3 class="text-base font-semibold text-gray-900 mb-1">Shopping List</h3>
            <p class="text-sm text-gray-600">Track what to buy</p>
          </router-link>

          <router-link to="/analytics" class="action-card">
            <TrendingUp :size="24" class="text-gray-700 mb-3" />
            <h3 class="text-base font-semibold text-gray-900 mb-1">Analytics</h3>
            <p class="text-sm text-gray-600">View your stats</p>
          </router-link>

          <router-link to="/settings" class="action-card">
            <Settings :size="24" class="text-gray-700 mb-3" />
            <h3 class="text-base font-semibold text-gray-900 mb-1">Settings</h3>
            <p class="text-sm text-gray-600">Configure account</p>
          </router-link>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="supplyStore.items.length === 0" class="text-center py-16">
        <Package :size="64" class="text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Start tracking your inventory</h3>
        <p class="text-gray-600 mb-6">Add your first items to get started</p>
        <router-link to="/supply" class="btn btn-primary">
          Add Items
        </router-link>
      </div>
    </main>
  </div>
</template>
