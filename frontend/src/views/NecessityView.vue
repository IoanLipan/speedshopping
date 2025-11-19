<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNecessityStore } from '@/stores/necessity'
import { useHistoryStore } from '@/stores/history'
import type { NecessityItem } from '@/types'
import { necessityItemTemplates, getTemplatesByCategory, getTemplateCategories, type ProductTemplate } from '@/data/productTemplates'
import SwipeableShoppingCard from '@/components/SwipeableShoppingCard.vue'

const router = useRouter()
const necessityStore = useNecessityStore()
const historyStore = useHistoryStore()

const editMode = ref(false)
const showAddModal = ref(false)
const showQuickAdd = ref(false)
const editingItem = ref<NecessityItem | null>(null)
const searchQuery = ref('')
const filterPriority = ref('all')
const showCompleted = ref(false)
const quickAddCategory = ref('all')

const newItem = ref({
  name: '',
  quantity: 1,
  acquiredQuantity: 0,
  price: 0,
  currency: 'USD',
  productUrl: '',
  addToCartUrl: '',
  category: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  notes: '',
  timesAddedToCart: 0,
})

const isFormDirty = computed(() => {
  return newItem.value.name !== '' ||
    newItem.value.quantity !== 1 ||
    newItem.value.price !== 0 ||
    newItem.value.productUrl !== '' ||
    newItem.value.addToCartUrl !== '' ||
    newItem.value.category !== '' ||
    newItem.value.notes !== ''
})

const filteredItems = computed(() => {
  let items = showCompleted.value ? necessityStore.items : necessityStore.activeItems

  if (searchQuery.value) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterPriority.value !== 'all') {
    items = items.filter(item => item.priority === filterPriority.value)
  }

  // Sort by frequency (times added to cart) first, then by priority
  return items.sort((a, b) => {
    const freqA = a.timesAddedToCart || 0
    const freqB = b.timesAddedToCart || 0

    if (freqB !== freqA) {
      return freqB - freqA // Higher frequency first
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

const categories = computed(() => {
  const cats = new Set(necessityStore.items.map(item => item.category).filter(Boolean))
  return Array.from(cats)
})

const templateCategories = computed(() => {
  return getTemplateCategories(necessityItemTemplates)
})

const filteredTemplates = computed(() => {
  return getTemplatesByCategory(necessityItemTemplates, quickAddCategory.value)
})

onMounted(() => {
  necessityStore.fetchItems()
  historyStore.updateCanUndoRedo()
})

function openAddModal() {
  newItem.value = {
    name: '',
    quantity: 1,
    acquiredQuantity: 0,
    price: 0,
    currency: 'USD',
    productUrl: '',
    addToCartUrl: '',
    category: '',
    priority: 'medium',
    notes: '',
    timesAddedToCart: 0,
  }
  editingItem.value = null
  showAddModal.value = true
}

function openEditModal(item: NecessityItem) {
  editingItem.value = item
  newItem.value = {
    name: item.name,
    quantity: item.quantity,
    acquiredQuantity: item.acquiredQuantity || 0,
    price: item.price,
    currency: item.currency,
    productUrl: item.productUrl || '',
    addToCartUrl: item.addToCartUrl || '',
    category: item.category || '',
    priority: item.priority,
    notes: item.notes || '',
    timesAddedToCart: item.timesAddedToCart || 0,
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
      await necessityStore.updateItem(editingItem.value.id, newItem.value)
    } else {
      await necessityStore.addItem(newItem.value)
    }
    showAddModal.value = false
  } catch (error) {
    console.error('Failed to save item:', error)
    alert('Failed to save item')
  }
}

async function deleteItem(item: NecessityItem) {
  if (confirm(`Delete ${item.name}?`)) {
    try {
      await necessityStore.deleteItem(item.id)
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
    await necessityStore.addItem({
      name: template.name,
      quantity: template.defaultQuantity,
      acquiredQuantity: 0,
      price: 0,
      currency: 'USD',
      category: template.category,
      priority: 'medium',
      notes: template.notes,
      productUrl: '',
      addToCartUrl: '',
      timesAddedToCart: 1,
    })
  } catch (error) {
    console.error('Failed to add template item:', error)
    alert('Failed to add item')
  }
}

async function handleIncrementAcquired(item: NecessityItem) {
  try {
    const result = await necessityStore.incrementAcquired(item.id)
    if (result?.isNowComplete) {
      // Transfer to supply when complete
      await transferToSupply(result.item)
    }
  } catch (error) {
    console.error('Failed to increment acquired quantity:', error)
  }
}

async function handleDecrementAcquired(item: NecessityItem) {
  try {
    await necessityStore.decrementAcquired(item.id)
  } catch (error) {
    console.error('Failed to decrement acquired quantity:', error)
  }
}

async function handleIncreaseTarget(item: NecessityItem) {
  try {
    await necessityStore.increaseTargetQuantity(item.id)
  } catch (error) {
    console.error('Failed to increase target quantity:', error)
  }
}

async function transferToSupply(item: NecessityItem) {
  // Import supply store at the top if not already imported
  const { useSupplyStore } = await import('@/stores/supply')
  const supplyStore = useSupplyStore()

  try {
    // Add to supply with default consumption values
    await supplyStore.addItem({
      name: item.name,
      quantity: item.quantity,
      unit: 'pcs',
      dailyConsumption: 1,
      price: item.price,
      currency: item.currency,
      productUrl: item.productUrl || '',
      addToCartUrl: item.addToCartUrl || '',
      category: item.category || '',
      lowStockThreshold: 3,
      notes: item.notes || 'Auto-added from shopping list',
    })
  } catch (error) {
    console.error('Failed to transfer to supply:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header - Modern & Sticky -->
    <header class="sticky top-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 z-40">
      <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button @click="router.back()" class="btn btn-secondary text-sm">
              ← Back
            </button>
            <h1 class="text-xl font-bold text-white">Shopping List</h1>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="undo"
              :disabled="!historyStore.canUndo"
              class="btn btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': !historyStore.canUndo }"
            >
              ↶
            </button>
            <button
              @click="redo"
              :disabled="!historyStore.canRedo"
              class="btn btn-secondary text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': !historyStore.canRedo }"
            >
              ↷
            </button>
            <button @click="editMode = !editMode" class="btn btn-secondary text-sm">
              {{ editMode ? '✓' : '✎' }}
            </button>
            <button @click="openAddModal" class="btn btn-primary text-sm">
              + Add
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="card">
          <p class="text-sm text-gray-400">Total Items</p>
          <p class="text-2xl font-bold text-white">{{ necessityStore.activeItems.length }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-400">High Priority</p>
          <p class="text-2xl font-bold text-red-400">{{ necessityStore.highPriorityItems.length }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-400">Total Cost</p>
          <p class="text-2xl font-bold text-green-400">${{ necessityStore.totalCost.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search items..."
          class="input flex-1"
        />
        <select v-model="filterPriority" class="input sm:w-48">
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <label class="flex items-center gap-2 cursor-pointer text-gray-300">
          <input type="checkbox" v-model="showCompleted" class="w-4 h-4" />
          <span class="text-sm font-medium">Show Completed</span>
        </label>
      </div>

      <!-- Quick Add Section -->
      <div class="mb-6">
        <button
          @click="showQuickAdd = !showQuickAdd"
          class="w-full flex items-center justify-between p-4 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
        >
          <div class="flex items-center gap-2">
            <span class="text-lg">⚡</span>
            <span class="font-semibold text-white">Quick Add Common Items</span>
          </div>
          <span class="text-2xl text-gray-400">{{ showQuickAdd ? '−' : '+' }}</span>
        </button>

        <div v-if="showQuickAdd" class="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
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
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <button
              v-for="template in filteredTemplates"
              :key="template.name"
              @click="quickAddTemplate(template)"
              class="flex flex-col items-center justify-center p-3 border-2 border-gray-700 rounded-lg hover:border-gray-500 hover:bg-gray-700 transition-all group"
              :title="`Add ${template.name}`"
            >
              <span class="text-3xl mb-1">{{ template.icon }}</span>
              <span class="text-xs font-medium text-center text-gray-300 group-hover:text-white">
                {{ template.name }}
              </span>
              <span class="text-xs text-gray-500 mt-1">
                {{ template.defaultQuantity }} {{ template.unit }}
              </span>
            </button>
          </div>

          <p class="text-xs text-gray-500 mt-4 text-center">
            Click any item to quickly add it to your shopping list. You can edit details later.
          </p>
        </div>
      </div>

      <!-- Items List -->
      <div v-if="necessityStore.loading" class="text-center py-12">
        <p class="text-gray-400">Loading...</p>
      </div>

      <div v-else-if="filteredItems.length === 0" class="text-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
            <span class="text-5xl">🛒</span>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-200 mb-2">Your shopping list is empty</h3>
            <p class="text-gray-400">Add items using the Quick Add section or the + Add button</p>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Swipe Instructions -->
        <div class="mb-4 p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
          <div class="flex items-center gap-3">
            <span class="text-2xl">👉</span>
            <div class="flex-1">
              <p class="text-sm font-medium text-blue-300">Quick Actions</p>
              <p class="text-xs text-blue-400 mt-0.5">
                <span class="font-semibold">Swipe left</span> to mark as bought •
                <span class="font-semibold">Swipe right</span> to add more
              </p>
            </div>
          </div>
        </div>

        <!-- Edit Mode Toolbar -->
        <div v-if="editMode" class="mb-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-xl flex items-center gap-2">
          <span class="text-yellow-400 text-sm font-medium">✎ Edit Mode Active</span>
          <span class="text-yellow-500 text-xs">Tap items to edit or delete</span>
        </div>

        <!-- Swipeable Cards -->
        <div class="space-y-3">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="relative"
            :class="{ 'opacity-50': item.completed }"
          >
            <!-- Edit Mode Overlay -->
            <div
              v-if="editMode"
              class="absolute top-2 right-2 z-10 flex gap-2"
            >
              <button
                @click="openEditModal(item)"
                class="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
              >
                ✎
              </button>
              <button
                @click="deleteItem(item)"
                class="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
              >
                ✕
              </button>
            </div>

            <!-- Swipeable Card -->
            <SwipeableShoppingCard
              :item="item"
              @increment="handleIncrementAcquired(item)"
              @decrement="handleDecrementAcquired(item)"
              @need-more="handleIncreaseTarget(item)"
            />

            <!-- Completed Badge -->
            <div v-if="item.completed" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div class="bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-lg rotate-12">
                ✓ COMPLETED
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <h2 class="text-2xl font-bold mb-4 text-white">
          {{ editingItem ? 'Edit Item' : 'Add New Item' }}
        </h2>

        <form @submit.prevent="saveItem" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-1">Name *</label>
              <input v-model="newItem.name" type="text" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Quantity *</label>
              <input v-model.number="newItem.quantity" type="number" min="1" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Unit Price *</label>
              <input v-model.number="newItem.price" type="number" min="0" step="0.01" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Currency</label>
              <select v-model="newItem.currency" class="input">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Priority *</label>
              <select v-model="newItem.priority" class="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <input v-model="newItem.category" type="text" class="input" list="categories" />
              <datalist id="categories">
                <option v-for="cat in categories" :key="cat" :value="cat" />
              </datalist>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-1">Product URL</label>
              <input v-model="newItem.productUrl" type="url" class="input" placeholder="https://..." />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-1">Add to Cart URL</label>
              <input v-model="newItem.addToCartUrl" type="url" class="input" placeholder="https://..." />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-1">Notes</label>
              <textarea v-model="newItem.notes" class="input" rows="3"></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" class="btn btn-primary flex-1">
              {{ editingItem ? 'Update' : 'Add' }}
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
