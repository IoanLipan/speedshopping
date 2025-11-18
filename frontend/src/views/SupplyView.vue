<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSupplyStore } from '@/stores/supply'
import { useHistoryStore } from '@/stores/history'
import type { SupplyItem } from '@/types'
import { supplyItemTemplates, getTemplatesByCategory, getTemplateCategories, type ProductTemplate } from '@/data/productTemplates'

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

function getDaysColor(days: number, threshold: number) {
  if (days <= threshold) return 'text-red-600'
  if (days <= threshold * 2) return 'text-orange-600'
  return 'text-green-600'
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
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="router.back()" class="btn btn-secondary">
              ← Back
            </button>
            <h1 class="text-2xl font-bold text-primary-600">Supply List</h1>
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
      <!-- Filters -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search items..."
          class="input flex-1"
        />
        <select v-model="filterCategory" class="input sm:w-48">
          <option value="all">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <!-- Quick Add Section -->
      <div class="mb-6">
        <button
          @click="showQuickAdd = !showQuickAdd"
          class="w-full flex items-center justify-between p-4 bg-white border-2 border-primary-200 rounded-lg hover:border-primary-400 transition-colors"
        >
          <div class="flex items-center gap-2">
            <span class="text-lg">⚡</span>
            <span class="font-semibold text-primary-700">Quick Add Common Items</span>
          </div>
          <span class="text-2xl text-primary-600">{{ showQuickAdd ? '−' : '+' }}</span>
        </button>

        <div v-if="showQuickAdd" class="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
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
              class="flex flex-col items-center justify-center p-3 border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all group"
              :title="`Add ${template.name}`"
            >
              <span class="text-3xl mb-1">{{ template.icon }}</span>
              <span class="text-xs font-medium text-center text-gray-700 group-hover:text-primary-700">
                {{ template.name }}
              </span>
              <span class="text-xs text-gray-500 mt-1">
                {{ template.defaultQuantity }} {{ template.unit }}
              </span>
            </button>
          </div>

          <p class="text-xs text-gray-500 mt-4 text-center">
            Click any item to quickly add it with default values. You can edit details later.
          </p>
        </div>
      </div>

      <!-- Items List -->
      <div v-if="supplyStore.loading" class="text-center py-12">
        <p class="text-gray-600">Loading...</p>
      </div>

      <div v-else-if="filteredItems.length === 0" class="text-center py-12">
        <p class="text-gray-600">No items found. Add your first item to get started!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="card hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-lg text-gray-900">{{ item.name }}</h3>
              <p v-if="item.category" class="text-sm text-gray-500">{{ item.category }}</p>
            </div>
            <div v-if="editMode" class="flex gap-2">
              <button @click="openEditModal(item)" class="text-primary-600 hover:text-primary-700">
                ✎
              </button>
              <button @click="deleteItem(item)" class="text-red-600 hover:text-red-700">
                ✕
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <!-- Days Remaining -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Days Remaining:</span>
              <span :class="['font-bold text-lg', getDaysColor(item.daysRemaining, item.lowStockThreshold)]">
                {{ item.daysRemaining }}
              </span>
            </div>

            <!-- Quantity -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Quantity:</span>
              <span class="font-medium">{{ item.quantity }}</span>
            </div>

            <!-- Daily Consumption -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Daily Use:</span>
              <span class="font-medium">{{ item.dailyConsumption }}</span>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Price:</span>
              <span class="font-medium">{{ item.currency }} ${{ item.price.toFixed(2) }}</span>
            </div>

            <!-- Links -->
            <div v-if="item.productUrl || item.addToCartUrl" class="pt-2 border-t space-y-1">
              <a
                v-if="item.productUrl"
                :href="item.productUrl"
                target="_blank"
                class="block text-sm text-primary-600 hover:text-primary-700"
              >
                🔗 View Product
              </a>
              <a
                v-if="item.addToCartUrl"
                :href="item.addToCartUrl"
                target="_blank"
                class="block text-sm text-green-600 hover:text-green-700"
              >
                🛒 Add to Cart
              </a>
            </div>

            <!-- Notes -->
            <p v-if="item.notes && editMode" class="text-sm text-gray-600 pt-2 border-t">
              {{ item.notes }}
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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
              <input v-model.number="newItem.quantity" type="number" min="0" step="0.1" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Daily Consumption *</label>
              <input v-model.number="newItem.dailyConsumption" type="number" min="0" step="0.1" required class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input v-model="newItem.category" type="text" class="input" list="categories" />
              <datalist id="categories">
                <option v-for="cat in categories" :key="cat" :value="cat" />
              </datalist>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert (days)</label>
              <input v-model.number="newItem.lowStockThreshold" type="number" min="1" class="input" />
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
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
