<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSupplyStore } from '@/stores/supply'
import { useHistoryStore } from '@/stores/history'
import type { SupplyItem } from '@/types'
import { supplyItemTemplates, getTemplatesByCategory, getTemplateCategories, type ProductTemplate } from '@/data/productTemplates'
import StockMeter from '@/components/StockMeter.vue'
import {
  ArrowLeft,
  RotateCcw,
  RotateCw,
  Edit3,
  Plus,
  Search,
  Filter,
  Zap,
  Edit,
  Trash2,
  ExternalLink,
  ShoppingCart as CartIcon
} from 'lucide-vue-next'

const router = useRouter()
const supplyStore = useSupplyStore()
const historyStore = useHistoryStore()

const editMode = ref(false)
const showAddModal = ref(false)
const showQuickAdd = ref(false)
const editingItem = ref<SupplyItem | null>(null)
const searchQuery = ref('')
const filterCategory = ref('all')
const quickAddCategory = ref('all')

const newItem = ref({
  name: '',
  quantity: 0,
  dailyConsumption: 0,
  price: 0,
  currency: 'USD',
  productUrl: '',
  addToCartUrl: '',
  category: '',
  lowStockThreshold: 3,
  notes: '',
})

const isFormDirty = computed(() => {
  return newItem.value.name !== '' ||
    newItem.value.quantity !== 0 ||
    newItem.value.dailyConsumption !== 0 ||
    newItem.value.price !== 0 ||
    newItem.value.productUrl !== '' ||
    newItem.value.addToCartUrl !== '' ||
    newItem.value.category !== '' ||
    newItem.value.notes !== ''
})

const filteredItems = computed(() => {
  let items = supplyStore.items

  if (searchQuery.value) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterCategory.value !== 'all') {
    items = items.filter(item => item.category === filterCategory.value)
  }

  return items.sort((a, b) => a.daysRemaining - b.daysRemaining)
})

const categories = computed(() => {
  const cats = new Set(supplyStore.items.map(item => item.category).filter(Boolean))
  return Array.from(cats)
})

const templateCategories = computed(() => {
  return getTemplateCategories(supplyItemTemplates)
})

const filteredTemplates = computed(() => {
  return getTemplatesByCategory(supplyItemTemplates, quickAddCategory.value)
})

onMounted(() => {
  supplyStore.fetchItems()
  historyStore.updateCanUndoRedo()
})

function getItemIcon(itemName: string): string {
  const lowerName = itemName.toLowerCase()
  if (lowerName.includes('egg')) return 'egg'
  if (lowerName.includes('milk')) return 'milk'
  if (lowerName.includes('coffee')) return 'coffee'
  if (lowerName.includes('bread')) return 'bread'
  return 'package'
}

function openAddModal() {
  newItem.value = {
    name: '',
    quantity: 0,
    dailyConsumption: 0,
    price: 0,
    currency: 'USD',
    productUrl: '',
    addToCartUrl: '',
    category: '',
    lowStockThreshold: 3,
    notes: '',
  }
  editingItem.value = null
  showAddModal.value = true
}

function openEditModal(item: SupplyItem) {
  editingItem.value = item
  newItem.value = {
    name: item.name,
    quantity: item.quantity,
    dailyConsumption: item.dailyConsumption,
    price: item.price,
    currency: item.currency,
    productUrl: item.productUrl || '',
    addToCartUrl: item.addToCartUrl || '',
    category: item.category || '',
    lowStockThreshold: item.lowStockThreshold,
    notes: item.notes || '',
  }
  showAddModal.value = true
}

function closeModal() {
  if (isFormDirty.value) {
    if (confirm('You have unsaved changes. Are you sure you want to close?')) {
      showAddModal.value = false
    }
  } else {
    showAddModal.value = false
  }
}

async function saveItem() {
  try {
    if (editingItem.value) {
      await supplyStore.updateItem(editingItem.value.id, newItem.value)
    } else {
      await supplyStore.addItem(newItem.value)
    }
    showAddModal.value = false
  } catch (error) {
    console.error('Failed to save item:', error)
    alert('Failed to save item')
  }
}

async function deleteItem(item: SupplyItem) {
  if (confirm(`Delete ${item.name}?`)) {
    try {
      await supplyStore.deleteItem(item.id)
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item')
    }
  }
}

function undo() {
  historyStore.undo()
  historyStore.updateCanUndoRedo()
}

function redo() {
  historyStore.redo()
  historyStore.updateCanUndoRedo()
}

async function quickAddTemplate(template: ProductTemplate) {
  try {
    await supplyStore.addItem({
      name: template.name,
      quantity: template.defaultQuantity,
      dailyConsumption: template.defaultDailyConsumption,
      price: 0,
      currency: 'USD',
      category: template.category,
      lowStockThreshold: template.defaultLowStockThreshold,
      notes: template.notes,
      productUrl: '',
      addToCartUrl: '',
    })
  } catch (error) {
    console.error('Failed to add template item:', error)
    alert('Failed to add item')
  }
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Minimalist Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <button @click="router.back()" class="btn btn-secondary flex items-center gap-2">
              <ArrowLeft :size="16" />
              <span>Back</span>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Supply Inventory</h1>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="undo"
              :disabled="!historyStore.canUndo"
              class="btn btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': !historyStore.canUndo }"
            >
              <RotateCcw :size="16" />
            </button>
            <button
              @click="redo"
              :disabled="!historyStore.canRedo"
              class="btn btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': !historyStore.canRedo }"
            >
              <RotateCw :size="16" />
            </button>
            <button @click="editMode = !editMode" class="btn btn-warning flex items-center gap-2">
              <Edit3 :size="16" />
              <span>{{ editMode ? 'Done' : 'Edit' }}</span>
            </button>
            <button @click="openAddModal" class="btn btn-success flex items-center gap-2">
              <Plus :size="16" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <!-- Filters -->
      <div class="mb-6 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search items..."
            class="input pl-10"
          />
        </div>
        <div class="relative sm:w-48">
          <Filter :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select v-model="filterCategory" class="input pl-10">
            <option value="all">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <!-- Quick Add Section -->
      <div class="mb-6">
        <button
          @click="showQuickAdd = !showQuickAdd"
          class="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all"
        >
          <div class="flex items-center gap-2">
            <Zap :size="18" class="text-gray-700" />
            <span class="text-sm font-medium text-gray-900">Quick Add Common Items</span>
          </div>
          <span class="text-gray-500">{{ showQuickAdd ? '−' : '+' }}</span>
        </button>

        <div v-if="showQuickAdd" class="mt-3 p-4 bg-white border border-gray-200 rounded-2xl">
          <!-- Category Filter for Templates -->
          <div class="mb-4">
            <select v-model="quickAddCategory" class="input">
              <option value="all">All Categories</option>
              <option v-for="cat in templateCategories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- Template Items Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <button
              v-for="template in filteredTemplates"
              :key="template.name"
              @click="quickAddTemplate(template)"
              class="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-100 transition-all group"
              :title="`Add ${template.name}`"
            >
              <span class="text-3xl mb-1">{{ template.icon }}</span>
              <span class="text-xs font-medium text-center text-gray-800">
                {{ template.name }}
              </span>
              <span class="text-xs text-gray-500 mt-0.5">
                {{ template.defaultQuantity }} {{ template.unit }}
              </span>
            </button>
          </div>

          <p class="text-xs text-gray-600 mt-4 text-center bg-gray-50 p-2 rounded-xl">
            Click any item to add it. You can customize later.
          </p>
        </div>
      </div>

      <!-- Items List -->
      <div v-if="supplyStore.loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900 mb-4"></div>
        <p class="text-base text-gray-600">Loading inventory...</p>
      </div>

      <div v-else-if="filteredItems.length === 0" class="text-center py-16">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No Items Found</h3>
        <p class="text-sm text-gray-600 mb-6">Start adding items to track your inventory</p>
        <button @click="openAddModal" class="btn btn-success">
          Add Your First Item
        </button>
      </div>

      <div v-else>
        <!-- Stock Meters Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="item in filteredItems" :key="item.id" class="relative">
            <!-- Edit/Delete Buttons Overlay -->
            <div v-if="editMode" class="absolute top-2 right-2 z-10 flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                @click="openEditModal(item)"
                class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <Edit :size="16" />
              </button>
              <button
                @click="deleteItem(item)"
                class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 :size="16" />
              </button>
            </div>

            <!-- Stock Meter Component -->
            <StockMeter
              :item-name="item.name"
              :days-remaining="item.daysRemaining"
              :low-stock-threshold="item.lowStockThreshold"
              :quantity="item.quantity"
              :daily-consumption="item.dailyConsumption"
              :unit="item.unit || 'units'"
              :icon="getItemIcon(item.name)"
            />

            <!-- Additional Info Card -->
            <div class="mt-2 bg-white rounded-2xl p-3 border border-gray-200">
              <div class="space-y-2">
                <!-- Category -->
                <div v-if="item.category" class="flex items-center gap-2">
                  <span class="text-xs font-medium text-gray-500">{{ item.category }}</span>
                </div>

                <!-- Price -->
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-600">Price:</span>
                  <span class="text-sm font-medium text-gray-900">{{ item.currency }} ${{ item.price.toFixed(2) }}</span>
                </div>

                <!-- Links -->
                <div v-if="item.productUrl || item.addToCartUrl" class="pt-2 border-t border-gray-200 space-y-2">
                  <a
                    v-if="item.productUrl"
                    :href="item.productUrl"
                    target="_blank"
                    class="flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <ExternalLink :size="14" />
                    <span>View Product</span>
                  </a>
                  <a
                    v-if="item.addToCartUrl"
                    :href="item.addToCartUrl"
                    target="_blank"
                    class="flex items-center justify-center gap-1 py-2 px-3 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-all"
                  >
                    <CartIcon :size="14" />
                    <span>Add to Cart</span>
                  </a>
                </div>

                <!-- Notes -->
                <p v-if="item.notes" class="text-xs text-gray-600 pt-2 border-t border-gray-200 bg-gray-50 p-2 rounded-lg">
                  {{ item.notes }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingItem ? 'Edit Item' : 'Add New Item' }}
          </h2>
        </div>

        <form @submit.prevent="saveItem" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Item Name *</label>
              <input v-model="newItem.name" type="text" required class="input" placeholder="e.g., Milk, Eggs, etc." />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Quantity *</label>
              <input v-model.number="newItem.quantity" type="number" min="0" step="0.1" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Daily Use *</label>
              <input v-model.number="newItem.dailyConsumption" type="number" min="0" step="0.1" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Price *</label>
              <input v-model.number="newItem.price" type="number" min="0" step="0.01" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
              <select v-model="newItem.currency" class="input">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <input v-model="newItem.category" type="text" class="input" list="categories" placeholder="e.g., Food, Household" />
              <datalist id="categories">
                <option v-for="cat in categories" :key="cat" :value="cat" />
              </datalist>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Alert (days)</label>
              <input v-model.number="newItem.lowStockThreshold" type="number" min="1" class="input" />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Product URL</label>
              <input v-model="newItem.productUrl" type="url" class="input" placeholder="https://..." />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Add to Cart URL</label>
              <input v-model="newItem.addToCartUrl" type="url" class="input" placeholder="https://..." />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
              <textarea v-model="newItem.notes" class="input" rows="3" placeholder="Any additional information..."></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" class="btn btn-primary flex-1">
              {{ editingItem ? 'Update Item' : 'Add Item' }}
            </button>
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
