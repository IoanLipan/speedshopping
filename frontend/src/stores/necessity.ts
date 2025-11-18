import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NecessityItem } from '@/types'
import { necessityService } from '@/services/api'
import { useHistoryStore } from './history'

export const useNecessityStore = defineStore('necessity', () => {
  const items = ref<NecessityItem[]>([])
  const loading = ref(false)
  const historyStore = useHistoryStore()

  const activeItems = computed(() =>
    items.value.filter(item => !item.completed)
  )

  const completedItems = computed(() =>
    items.value.filter(item => item.completed)
  )

  const totalCost = computed(() =>
    activeItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const highPriorityItems = computed(() =>
    activeItems.value.filter(item => item.priority === 'high')
  )

  async function fetchItems() {
    loading.value = true
    try {
      items.value = await necessityService.getAll()
    } catch (error) {
      console.error('Failed to fetch necessity items:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addItem(item: Omit<NecessityItem, 'id' | 'userId' | 'createdAt' | 'completed'>) {
    try {
      const newItem = await necessityService.create(item)
      items.value.push(newItem)
      historyStore.addEntry({
        action: 'create',
        itemType: 'necessity',
        itemId: newItem.id,
        previousState: null,
        newState: newItem,
      })
      return newItem
    } catch (error) {
      console.error('Failed to add necessity item:', error)
      throw error
    }
  }

  async function updateItem(id: string, updates: Partial<NecessityItem>) {
    const index = items.value.findIndex(item => item.id === id)
    if (index === -1) return

    const previousState = { ...items.value[index] }
    try {
      const updated = await necessityService.update(id, updates)
      items.value[index] = updated
      historyStore.addEntry({
        action: 'update',
        itemType: 'necessity',
        itemId: id,
        previousState,
        newState: updated,
      })
      return updated
    } catch (error) {
      console.error('Failed to update necessity item:', error)
      throw error
    }
  }

  async function deleteItem(id: string) {
    const index = items.value.findIndex(item => item.id === id)
    if (index === -1) return

    const previousState = { ...items.value[index] }
    try {
      await necessityService.delete(id)
      items.value.splice(index, 1)
      historyStore.addEntry({
        action: 'delete',
        itemType: 'necessity',
        itemId: id,
        previousState,
        newState: null,
      })
    } catch (error) {
      console.error('Failed to delete necessity item:', error)
      throw error
    }
  }

  async function toggleComplete(id: string) {
    const item = items.value.find(item => item.id === id)
    if (!item) return

    await updateItem(id, {
      completed: !item.completed,
      completedAt: !item.completed ? new Date() : undefined,
    })
  }

  return {
    items,
    loading,
    activeItems,
    completedItems,
    totalCost,
    highPriorityItems,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    toggleComplete,
  }
})
