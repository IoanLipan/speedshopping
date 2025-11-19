<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSupplyStore } from '@/stores/supply'
import { useHistoryStore } from '@/stores/history'
import type { SupplyItem } from '@/types'
import { supplyItemTemplates, getTemplatesByCategory, getTemplateCategories, type ProductTemplate } from '@/data/productTemplates'
import StockMeter from '@/components/StockMeter.vue'

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
    <!-- Game-style Header -->
    <header class="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 shadow-2xl">
      <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <button @click="router.back()" class="btn btn-secondary text-base px-6 py-3">
              ⬅️ Back
            </button>
            <div class="flex items-center gap-3">
              <span class="text-5xl">📦</span>
              <h1 class="text-4xl font-black text-white drop-shadow-lg">Supply Inventory</h1>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              @click="undo"
              :disabled="!historyStore.canUndo"
              class="btn btn-secondary text-sm px-4 py-2"
              :class="{ 'opacity-50 cursor-not-allowed': !historyStore.canUndo }"
            >
              ↶ Undo
            </button>
            <button
              @click="redo"
              :disabled="!historyStore.canRedo"
              class="btn btn-secondary text-sm px-4 py-2"
              :class="{ 'opacity-50 cursor-not-allowed': !historyStore.canRedo }"
            >
              ↷ Redo
            </button>
            <button @click="editMode = !editMode" class="btn btn-warning text-base px-6 py-3">
              {{ editMode ? '✓ Done' : '✎ Edit Mode' }}
            </button>
            <button @click="openAddModal" class="btn btn-success text-base px-6 py-3">
              ➕ Add Item
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Filters -->
      <div class="mb-8 flex flex-col sm:flex-row gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 Search items..."
          class="input flex-1 text-lg"
        />
        <select v-model="filterCategory" class="input sm:w-64 text-lg font-bold">
          <option value="all">📂 All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            📁 {{ cat }}
          </option>
        </select>
      </div>

      <!-- Quick Add Section -->
      <div class="mb-8">
        <button
          @click="showQuickAdd = !showQuickAdd"
          class="w-full flex items-center justify-between p-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl shadow-2xl border-4 border-white hover:shadow-purple-400 transition-all hover:scale-105"
        >
          <div class="flex items-center gap-3">
            <span class="text-4xl">⚡</span>
            <span class="text-2xl font-black text-white drop-shadow-lg">Quick Add Common Items</span>
          </div>
          <span class="text-4xl text-white font-black">{{ showQuickAdd ? '−' : '+' }}</span>
        </button>

        <div v-if="showQuickAdd" class="mt-6 p-6 bg-white rounded-3xl shadow-2xl border-4 border-purple-300">
          <!-- Category Filter for Templates -->
          <div class="mb-6">
            <select v-model="quickAddCategory" class="input text-lg font-bold">
              <option value="all">🎯 All Categories</option>
              <option v-for="cat in templateCategories" :key="cat" :value="cat">
                📁 {{ cat }}
              </option>
            </select>
          </div>

          <!-- Template Items Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button
              v-for="template in filteredTemplates"
              :key="template.name"
              @click="quickAddTemplate(template)"
              class="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-200 rounded-2xl hover:border-purple-500 hover:shadow-xl hover:scale-110 transition-all group"
              :title="`Add ${template.name}`"
            >
              <span class="text-5xl mb-2 group-hover:animate-bounce">{{ template.icon }}</span>
              <span class="text-sm font-bold text-center text-gray-800 group-hover:text-purple-700">
                {{ template.name }}
              </span>
              <span class="text-xs text-gray-600 font-medium mt-1">
                {{ template.defaultQuantity }} {{ template.unit }}
              </span>
            </button>
          </div>

          <p class="text-sm text-gray-600 font-bold mt-6 text-center bg-yellow-100 p-3 rounded-2xl">
            ✨ Click any item to instantly add it! You can customize it later.
          </p>
        </div>
      </div>

      <!-- Items List -->
      <div v-if="supplyStore.loading" class="text-center py-16">
        <div class="text-8xl mb-6 animate-bounce">⏳</div>
        <p class="text-2xl font-black text-white drop-shadow-lg">Loading your awesome inventory...</p>
      </div>

      <div v-else-if="filteredItems.length === 0" class="text-center py-16">
        <div class="text-8xl mb-6 animate-bounce">📦</div>
        <h3 class="text-3xl font-black text-white mb-4 drop-shadow-lg">No Items Found!</h3>
        <p class="text-xl font-bold text-white mb-8 drop-shadow">Start adding items to track your inventory!</p>
        <button @click="openAddModal" class="btn btn-success text-2xl">
          ➕ Add Your First Item
        </button>
      </div>

      <div v-else>
        <!-- Stock Meters Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in filteredItems" :key="item.id" class="relative">
            <!-- Edit/Delete Buttons Overlay -->
            <div v-if="editMode" class="absolute top-3 right-3 z-10 flex gap-2 bg-white rounded-full p-2 shadow-lg border-2 border-purple-300">
              <button
                @click="openEditModal(item)"
                class="text-2xl text-blue-600 hover:text-blue-700 hover:scale-125 transition-transform"
                title="Edit"
              >
                ✏️
              </button>
              <button
                @click="deleteItem(item)"
                class="text-2xl text-red-600 hover:text-red-700 hover:scale-125 transition-transform"
                title="Delete"
              >
                🗑️
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
              :emoji="getItemEmoji(item.name)"
            />

            <!-- Additional Info Card -->
            <div class="mt-2 bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-200">
              <div class="space-y-2">
                <!-- Category -->
                <div v-if="item.category" class="flex items-center gap-2">
                  <span class="text-lg">📁</span>
                  <span class="text-sm font-bold text-purple-700">{{ item.category }}</span>
                </div>

                <!-- Price -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-gray-700">💰 Price:</span>
                  <span class="font-bold text-green-600">{{ item.currency }} ${{ item.price.toFixed(2) }}</span>
                </div>

                <!-- Links -->
                <div v-if="item.productUrl || item.addToCartUrl" class="pt-2 border-t-2 border-purple-200 space-y-2">
                  <a
                    v-if="item.productUrl"
                    :href="item.productUrl"
                    target="_blank"
                    class="block text-center py-2 px-4 bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all hover:scale-105 shadow-lg"
                  >
                    🔗 View Product
                  </a>
                  <a
                    v-if="item.addToCartUrl"
                    :href="item.addToCartUrl"
                    target="_blank"
                    class="block text-center py-2 px-4 bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-lg"
                  >
                    🛒 Add to Cart
                  </a>
                </div>

                <!-- Notes -->
                <p v-if="item.notes" class="text-sm text-gray-700 pt-2 border-t-2 border-purple-200 bg-yellow-50 p-3 rounded-xl">
                  <span class="font-bold">📝 Note:</span> {{ item.notes }}
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
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
    >
      <div class="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-purple-400 shadow-2xl">
        <div class="flex items-center justify-center gap-3 mb-6">
          <span class="text-5xl">{{ editingItem ? '✏️' : '➕' }}</span>
          <h2 class="text-4xl font-black text-purple-700">
            {{ editingItem ? 'Edit Item' : 'Add New Item' }}
          </h2>
        </div>

        <form @submit.prevent="saveItem" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="sm:col-span-2">
              <label class="block text-base font-black text-purple-700 mb-2">📝 Item Name *</label>
              <input v-model="newItem.name" type="text" required class="input" placeholder="e.g., Milk, Eggs, etc." />
            </div>

            <div>
              <label class="block text-base font-black text-purple-700 mb-2">📦 Quantity *</label>
              <input v-model.number="newItem.quantity" type="number" min="0" step="0.1" required class="input" />
            </div>

            <div>
              <label class="block text-base font-black text-purple-700 mb-2">📉 Daily Use *</label>
              <input v-model.number="newItem.dailyConsumption" type="number" min="0" step="0.1" required class="input" />
            </div>

            <div>
              <label class="block text-base font-black text-purple-700 mb-2">💰 Price *</label>
              <input v-model.number="newItem.price" type="number" min="0" step="0.01" required class="input" />
            </div>

            <div>
              <label class="block text-base font-black text-purple-700 mb-2">💵 Currency</label>
              <select v-model="newItem.currency" class="input">
                <option value="USD">💵 USD</option>
                <option value="EUR">💶 EUR</option>
                <option value="GBP">💷 GBP</option>
              </select>
            </div>

            <div>
              <label class="block text-base font-black text-purple-700 mb-2">📁 Category</label>
              <input v-model="newItem.category" type="text" class="input" list="categories" placeholder="e.g., Food, Household" />
              <datalist id="categories">
                <option v-for="cat in categories" :key="cat" :value="cat" />
              </datalist>
            </div>

            <div>
              <label class="block text-base font-black text-purple-700 mb-2">🚨 Low Stock Alert (days)</label>
              <input v-model.number="newItem.lowStockThreshold" type="number" min="1" class="input" />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-base font-black text-purple-700 mb-2">🔗 Product URL</label>
              <input v-model="newItem.productUrl" type="url" class="input" placeholder="https://..." />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-base font-black text-purple-700 mb-2">🛒 Add to Cart URL</label>
              <input v-model="newItem.addToCartUrl" type="url" class="input" placeholder="https://..." />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-base font-black text-purple-700 mb-2">📝 Notes</label>
              <textarea v-model="newItem.notes" class="input" rows="3" placeholder="Any additional information..."></textarea>
            </div>
          </div>

          <div class="flex gap-4 pt-6">
            <button type="submit" class="btn btn-success flex-1 text-xl">
              {{ editingItem ? '✅ Update Item' : '➕ Add Item' }}
            </button>
            <button type="button" @click="closeModal" class="btn btn-danger flex-1 text-xl">
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
