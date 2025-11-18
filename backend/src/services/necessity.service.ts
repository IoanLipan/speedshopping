import { supabase } from '../config/supabase.js'
import type { NecessityItem } from '../types/index.js'

const TABLE = 'necessity_items'

export class NecessityService {
  async getAll(userId: string): Promise<NecessityItem[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch necessity items: ${error.message}`)
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      category: row.category,
      notes: row.notes,
      completed: row.completed,
      createdAt: new Date(row.created_at),
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    }))
  }

  async getById(id: string, userId: string): Promise<NecessityItem | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      category: data.category,
      notes: data.notes,
      completed: data.completed,
      createdAt: new Date(data.created_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    }
  }

  async create(userId: string, data: Omit<NecessityItem, 'id' | 'userId' | 'createdAt' | 'completed'>): Promise<NecessityItem> {
    const { data: inserted, error } = await supabase
      .from(TABLE)
      .insert({
        user_id: userId,
        name: data.name,
        category: data.category,
        notes: data.notes,
        completed: false,
      })
      .select()
      .single()

    if (error || !inserted) {
      throw new Error(`Failed to create necessity item: ${error?.message}`)
    }

    return {
      id: inserted.id,
      userId: inserted.user_id,
      name: inserted.name,
      category: inserted.category,
      notes: inserted.notes,
      completed: inserted.completed,
      createdAt: new Date(inserted.created_at),
      completedAt: inserted.completed_at ? new Date(inserted.completed_at) : undefined,
    }
  }

  async update(id: string, userId: string, updates: Partial<NecessityItem>): Promise<NecessityItem | null> {
    // First check if the item exists and belongs to the user
    const existing = await this.getById(id, userId)
    if (!existing) {
      return null
    }

    const updateData: any = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.notes !== undefined) updateData.notes = updates.notes
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed
      updateData.completed_at = updates.completed ? new Date().toISOString() : null
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error || !data) {
      throw new Error(`Failed to update necessity item: ${error?.message}`)
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      category: data.category,
      notes: data.notes,
      completed: data.completed,
      createdAt: new Date(data.created_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    }
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    return !error
  }
}

export const necessityService = new NecessityService()
