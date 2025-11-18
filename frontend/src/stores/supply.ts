import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SupplyItem } from '@/types'
import { supplyService } from '@/services/api'
import { useHistoryStore } from './history'

export const useSupplyStore = defineStore('supply', () => {
  const items = ref<SupplyItem[]>([])
  const loading = ref(false)
  const historyStore = useHistoryStore()

  const lowStockItems = computed(() =>
    items.value.filter(item => item.daysRemaining <= item.lowStockThreshold)
  )

  const totalValue = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  async function fetchItems() {
    loading.value = true
    try {
      items.value = await supplyService.getAll()
    } catch (error) {
      console.error('Failed to fetch supply items:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addItem(item: Omit<SupplyItem, 'id' | 'userId' | 'createdAt' | 'lastUpdated' | 'daysRemaining'>) {
    try {
      const newItem = await supplyService.create(item)
      items.value.push(newItem)
      historyStore.addEntry({
        action: 'create',
        itemType: 'supply',
        itemId: newItem.id,
        previousState: null,
        newState: newItem,
      })
      return newItem
    } catch (error) {
      console.error('Failed to add supply item:', error)
      throw error
    }
  }

  async function updateItem(id: string, updates: Partial<SupplyItem>) {
    const index = items.value.findIndex(item => item.id === id)
    if (index === -1) return

    const previousState = { ...items.value[index] }
    try {
      const updated = await supplyService.update(id, updates)
      items.value[index] = updated
      historyStore.addEntry({
        action: 'update',
        itemType: 'supply',
        itemId: id,
        previousState,
        newState: updated,
      })
      return updated
    } catch (error) {
      console.error('Failed to update supply item:', error)
      throw error
    }
  }

  async function deleteItem(id: string) {
    const index = items.value.findIndex(item => item.id === id)
    if (index === -1) return

    const previousState = { ...items.value[index] }
    try {
      await supplyService.delete(id)
      items.value.splice(index, 1)
      historyStore.addEntry({
        action: 'delete',
        itemType: 'supply',
        itemId: id,
        previousState,
        newState: null,
      })
    } catch (error) {
      console.error('Failed to delete supply item:', error)
      throw error
    }
  }

  return {
    items,
    loading,
    lowStockItems,
    totalValue,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  }
})
