<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSupplyStore } from '@/stores/supply'
import { useNecessityStore } from '@/stores/necessity'
import ItemListRow from '@/components/ItemListRow.vue'
import {
  ShoppingCart,
  AlertTriangle,
  ClipboardList,
  Wallet,
  ShoppingBag,
  Package
} from 'lucide-vue-next'

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

onMounted(() => {
  supplyStore.fetchItems()
  necessityStore.fetchItems()
})
</script>

<template>
  <div class="h-full flex flex-col bg-gray-900 overflow-hidden">
    <!-- Minimalist Header - Fixed -->
    <header class="flex-none bg-gray-800 border-b border-gray-700">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <ShoppingCart :size="24" class="text-gray-100" />
            <h1 class="text-xl font-semibold text-gray-100">SpeedShopping</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content - Scrollable -->
    <main class="flex-1 overflow-y-auto px-4 py-6">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-100 mb-1">
          Welcome back{{ authStore.user?.displayName ? ', ' + authStore.user.displayName : '' }}
        </h2>
        <p class="text-gray-400">Here's your inventory overview</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <AlertTriangle :size="20" class="text-red-400" />
            <span class="text-xs font-medium text-gray-400">Low Stock</span>
          </div>
          <p class="text-3xl font-semibold text-gray-100">{{ stats.lowStockCount }}</p>
          <p class="text-xs text-gray-400 mt-1">items running low</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <ClipboardList :size="20" class="text-blue-400" />
            <span class="text-xs font-medium text-gray-400">To Buy</span>
          </div>
          <p class="text-3xl font-semibold text-gray-100">{{ stats.necessityCount }}</p>
          <p class="text-xs text-gray-400 mt-1">items to purchase</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <Wallet :size="20" class="text-green-400" />
            <span class="text-xs font-medium text-gray-400">Inventory Value</span>
          </div>
          <p class="text-3xl font-semibold text-gray-100">${{ stats.totalInventoryValue.toFixed(2) }}</p>
          <p class="text-xs text-gray-400 mt-1">total value</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <ShoppingBag :size="20" class="text-orange-400" />
            <span class="text-xs font-medium text-gray-400">Shopping Cost</span>
          </div>
          <p class="text-3xl font-semibold text-gray-100">${{ stats.shoppingListCost.toFixed(2) }}</p>
          <p class="text-xs text-gray-400 mt-1">estimated cost</p>
        </div>
      </div>

      <!-- Critical Items Section -->
      <div v-if="criticalItems.length > 0" class="mb-8">
        <div class="bg-red-900/20 border border-red-800 rounded-2xl p-4 mb-4">
          <div class="flex items-center gap-2 mb-1">
            <AlertTriangle :size="18" class="text-red-400" />
            <h2 class="text-base font-semibold text-red-300">Critical Items</h2>
          </div>
          <p class="text-sm text-red-400">These items need your attention</p>
        </div>

        <div class="space-y-2">
          <ItemListRow
            v-for="item in criticalItems"
            :key="item.id"
            :item-name="item.name"
            :days-remaining="item.daysRemaining"
            :low-stock-threshold="item.lowStockThreshold"
            :quantity="item.quantity"
            :daily-consumption="item.dailyConsumption"
            :unit="item.unit || 'units'"
          />
        </div>
      </div>

      <!-- All Items Overview - List View -->
      <div v-if="allItemsSorted.length > 0" class="mb-8">
        <h2 class="text-lg font-semibold text-gray-100 mb-4">Your Inventory</h2>

        <div class="space-y-2">
          <ItemListRow
            v-for="item in allItemsSorted"
            :key="item.id"
            :item-name="item.name"
            :days-remaining="item.daysRemaining"
            :low-stock-threshold="item.lowStockThreshold"
            :quantity="item.quantity"
            :daily-consumption="item.dailyConsumption"
            :unit="item.unit || 'units'"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="supplyStore.items.length === 0" class="text-center py-16">
        <Package :size="64" class="text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-100 mb-2">Start tracking your inventory</h3>
        <p class="text-gray-400 mb-6">Add your first items to get started</p>
        <router-link to="/supply" class="btn btn-primary">
          Add Items
        </router-link>
      </div>
    </main>
  </div>
</template>
