<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNecessityStore } from '@/stores/necessity'
import { useHistoryStore } from '@/stores/history'
import type { NecessityItem } from '@/types'

const router = useRouter()
const necessityStore = useNecessityStore()
const historyStore = useHistoryStore()

const editMode = ref(false)
const showAddModal = ref(false)
const editingItem = ref<NecessityItem | null>(null)
const searchQuery = ref('')
const filterPriority = ref('all')
const showCompleted = ref(false)

const newItem = ref({
  name: '',
  quantity: 1,
  price: 0,
  currency: 'USD',
  productUrl: '',
  addToCartUrl: '',
  category: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  notes: '',
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

  return items.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

const categories = computed(() => {
  const cats = new Set(necessityStore.items.map(item => item.category).filter(Boolean))
  return Array.from(cats)
})

onMounted(() => {
  necessityStore.fetchItems()
  historyStore.updateCanUndoRedo()
})

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200'
    case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'low': return 'bg-green-100 text-green-800 border-green-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

function openAddModal() {
  newItem.value = {
    name: '',
    quantity: 1,
    price: 0,
    currency: 'USD',
    productUrl: '',
    addToCartUrl: '',
    category: '',
    priority: 'medium',
    notes: '',
  }
  editingItem.value = null
  showAddModal.value = true
}

function openEditModal(item: NecessityItem) {
  editingItem.value = item
  newItem.value = {
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    currency: item.currency,
    productUrl: item.productUrl || '',
    addToCartUrl: item.addToCartUrl || '',
    category: item.category || '',
    priority: item.priority,
    notes: item.notes || '',
  }
  showAddModal.value = true
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

async function toggleComplete(item: NecessityItem) {
  try {
    await necessityStore.toggleComplete(item.id)
  } catch (error) {
    console.error('Failed to toggle item:', error)
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
            <h1 class="text-2xl font-bold text-primary-600">Shopping List</h1>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="undo"
              :disabled="!historyStore.canUndo"
              class="btn btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': !historyStore.canUndo }"
            >
              ↶ Undo
            </button>
            <button
              @click="redo"
              :disabled="!historyStore.canRedo"
              class="btn btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': !historyStore.canRedo }"
            >
              ↷ Redo
            </button>
            <button @click="editMode = !editMode" class="btn btn-secondary">
              {{ editMode ? '✓ Done' : '✎ Edit' }}
            </button>
            <button @click="openAddModal" class="btn btn-primary">
              + Add Item
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
          <p class="text-sm text-gray-600">Total Items</p>
          <p class="text-2xl font-bold text-primary-600">{{ necessityStore.activeItems.length }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">High Priority</p>
          <p class="text-2xl font-bold text-red-600">{{ necessityStore.highPriorityItems.length }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">Total Cost</p>
          <p class="text-2xl font-bold text-green-600">${{ necessityStore.totalCost.toFixed(2) }}</p>
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
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="showCompleted" class="w-4 h-4" />
          <span class="text-sm font-medium">Show Completed</span>
        </label>
      </div>

      <!-- Items List -->
      <div v-if="necessityStore.loading" class="text-center py-12">
        <p class="text-gray-600">Loading...</p>
      </div>

      <div v-else-if="filteredItems.length === 0" class="text-center py-12">
        <p class="text-gray-600">No items found. Add your first item to get started!</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="card hover:shadow-md transition-shadow"
          :class="{ 'opacity-60': item.completed }"
        >
          <div class="flex items-start gap-4">
            <!-- Checkbox -->
            <input
              type="checkbox"
              :checked="item.completed"
              @change="toggleComplete(item)"
              class="w-5 h-5 mt-1 cursor-pointer"
            />

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h3
                    class="font-semibold text-lg"
                    :class="{ 'line-through text-gray-500': item.completed }"
                  >
                    {{ item.name }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span :class="['px-2 py-1 text-xs font-medium rounded border', getPriorityColor(item.priority)]">
                      {{ item.priority.toUpperCase() }}
                    </span>
                    <span v-if="item.category" class="text-sm text-gray-500">{{ item.category }}</span>
                  </div>
                </div>
                <div v-if="editMode" class="flex gap-2 ml-4">
                  <button @click="openEditModal(item)" class="text-primary-600 hover:text-primary-700">
                    ✎
                  </button>
                  <button @click="deleteItem(item)" class="text-red-600 hover:text-red-700">
                    ✕
                  </button>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-4 text-sm">
                <span class="text-gray-600">
                  Qty: <span class="font-medium">{{ item.quantity }}</span>
                </span>
                <span class="text-gray-600">
                  Price: <span class="font-medium">{{ item.currency }} ${{ (item.price * item.quantity).toFixed(2) }}</span>
                </span>
              </div>

              <!-- Links -->
              <div v-if="item.productUrl || item.addToCartUrl" class="flex gap-3 mt-2">
                <a
                  v-if="item.productUrl"
                  :href="item.productUrl"
                  target="_blank"
                  class="text-sm text-primary-600 hover:text-primary-700"
                >
                  🔗 View Product
                </a>
                <a
                  v-if="item.addToCartUrl"
                  :href="item.addToCartUrl"
                  target="_blank"
                  class="text-sm text-green-600 hover:text-green-700"
                >
                  🛒 Add to Cart
                </a>
              </div>

              <!-- Notes -->
              <p v-if="item.notes && editMode" class="text-sm text-gray-600 mt-2 pt-2 border-t">
                {{ item.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4">
          {{ editingItem ? 'Edit Item' : 'Add New Item' }}
        </h2>

        <form @submit.prevent="saveItem" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input v-model="newItem.name" type="text" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input v-model.number="newItem.quantity" type="number" min="1" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
              <input v-model.number="newItem.price" type="number" min="0" step="0.01" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select v-model="newItem.currency" class="input">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
              <select v-model="newItem.priority" class="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input v-model="newItem.category" type="text" class="input" list="categories" />
              <datalist id="categories">
                <option v-for="cat in categories" :key="cat" :value="cat" />
              </datalist>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Product URL</label>
              <input v-model="newItem.productUrl" type="url" class="input" placeholder="https://..." />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Add to Cart URL</label>
              <input v-model="newItem.addToCartUrl" type="url" class="input" placeholder="https://..." />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea v-model="newItem.notes" class="input" rows="3"></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" class="btn btn-primary flex-1">
              {{ editingItem ? 'Update' : 'Add' }}
            </button>
            <button type="button" @click="showAddModal = false" class="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
