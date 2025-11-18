import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { HistoryEntry, SupplyItem, NecessityItem } from '@/types'
import { useSupplyStore } from './supply'
import { useNecessityStore } from './necessity'

const MAX_HISTORY = 50

export const useHistoryStore = defineStore('history', () => {
  const history = ref<HistoryEntry[]>([])
  const currentIndex = ref(-1)

  function addEntry(entry: Omit<HistoryEntry, 'id' | 'userId' | 'timestamp'>) {
    // Remove any redo history when a new action is performed
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      userId: '', // Will be set by the backend
      ...entry,
      timestamp: new Date(),
    }

    history.value.push(newEntry)
    currentIndex.value = history.value.length - 1

    // Keep history size manageable
    if (history.value.length > MAX_HISTORY) {
      history.value.shift()
      currentIndex.value--
    }
  }

  async function undo() {
    if (!canUndo.value) return

    const entry = history.value[currentIndex.value]
    await applyHistoryEntry(entry, true)
    currentIndex.value--
  }

  async function redo() {
    if (!canRedo.value) return

    currentIndex.value++
    const entry = history.value[currentIndex.value]
    await applyHistoryEntry(entry, false)
  }

  async function applyHistoryEntry(entry: HistoryEntry, isUndo: boolean) {
    const supplyStore = useSupplyStore()
    const necessityStore = useNecessityStore()

    if (entry.itemType === 'supply') {
      if (entry.action === 'create') {
        if (isUndo) {
          await supplyStore.deleteItem(entry.itemId)
        } else {
          await supplyStore.addItem(entry.newState as any)
        }
      } else if (entry.action === 'update') {
        const state = isUndo ? entry.previousState : entry.newState
        await supplyStore.updateItem(entry.itemId, state as SupplyItem)
      } else if (entry.action === 'delete') {
        if (isUndo) {
          await supplyStore.addItem(entry.previousState as any)
        } else {
          await supplyStore.deleteItem(entry.itemId)
        }
      }
    } else if (entry.itemType === 'necessity') {
      if (entry.action === 'create') {
        if (isUndo) {
          await necessityStore.deleteItem(entry.itemId)
        } else {
          await necessityStore.addItem(entry.newState as any)
        }
      } else if (entry.action === 'update') {
        const state = isUndo ? entry.previousState : entry.newState
        await necessityStore.updateItem(entry.itemId, state as NecessityItem)
      } else if (entry.action === 'delete') {
        if (isUndo) {
          await necessityStore.addItem(entry.previousState as any)
        } else {
          await necessityStore.deleteItem(entry.itemId)
        }
      }
    }
  }

  const canUndo = ref(false)
  const canRedo = ref(false)

  // Update can undo/redo computed properties
  function updateCanUndoRedo() {
    canUndo.value = currentIndex.value >= 0
    canRedo.value = currentIndex.value < history.value.length - 1
  }

  return {
    history,
    currentIndex,
    canUndo,
    canRedo,
    addEntry,
    undo,
    redo,
    updateCanUndoRedo,
  }
})
