import { supabase } from '../config/supabase.js'
import type { SupplyItem } from '../types/index.js'

const TABLE = 'supply_items'

export class SupplyService {
  async getAll(userId: string): Promise<SupplyItem[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch supply items: ${error.message}`)
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      category: row.category,
      quantity: row.quantity,
      unit: row.unit,
      dailyConsumption: row.daily_consumption,
      daysRemaining: row.days_remaining,
      lowStockThreshold: row.low_stock_threshold,
      notes: row.notes,
      createdAt: new Date(row.created_at),
      lastUpdated: new Date(row.last_updated),
    }))
  }

  async getById(id: string, userId: string): Promise<SupplyItem | null> {
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
      quantity: data.quantity,
      unit: data.unit,
      dailyConsumption: data.daily_consumption,
      daysRemaining: data.days_remaining,
      lowStockThreshold: data.low_stock_threshold,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      lastUpdated: new Date(data.last_updated),
    }
  }

  async create(userId: string, data: Omit<SupplyItem, 'id' | 'userId' | 'createdAt' | 'lastUpdated' | 'daysRemaining'>): Promise<SupplyItem> {
    const daysRemaining = data.dailyConsumption > 0
      ? Math.floor(data.quantity / data.dailyConsumption)
      : 999

    const { data: inserted, error } = await supabase
      .from(TABLE)
      .insert({
        user_id: userId,
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        unit: data.unit,
        daily_consumption: data.dailyConsumption,
        days_remaining: daysRemaining,
        low_stock_threshold: data.lowStockThreshold,
        notes: data.notes,
      })
      .select()
      .single()

    if (error || !inserted) {
      throw new Error(`Failed to create supply item: ${error?.message}`)
    }

    return {
      id: inserted.id,
      userId: inserted.user_id,
      name: inserted.name,
      category: inserted.category,
      quantity: inserted.quantity,
      unit: inserted.unit,
      dailyConsumption: inserted.daily_consumption,
      daysRemaining: inserted.days_remaining,
      lowStockThreshold: inserted.low_stock_threshold,
      notes: inserted.notes,
      createdAt: new Date(inserted.created_at),
      lastUpdated: new Date(inserted.last_updated),
    }
  }

  async update(id: string, userId: string, updates: Partial<SupplyItem>): Promise<SupplyItem | null> {
    // First check if the item exists and belongs to the user
    const existing = await this.getById(id, userId)
    if (!existing) {
      return null
    }

    // Recalculate days remaining if quantity or dailyConsumption changed
    const quantity = updates.quantity ?? existing.quantity
    const dailyConsumption = updates.dailyConsumption ?? existing.dailyConsumption

    const daysRemaining = dailyConsumption > 0
      ? Math.floor(quantity / dailyConsumption)
      : 999

    const updateData: any = {
      days_remaining: daysRemaining,
      last_updated: new Date().toISOString(),
    }

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity
    if (updates.unit !== undefined) updateData.unit = updates.unit
    if (updates.dailyConsumption !== undefined) updateData.daily_consumption = updates.dailyConsumption
    if (updates.lowStockThreshold !== undefined) updateData.low_stock_threshold = updates.lowStockThreshold
    if (updates.notes !== undefined) updateData.notes = updates.notes

    const { data, error } = await supabase
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error || !data) {
      throw new Error(`Failed to update supply item: ${error?.message}`)
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      category: data.category,
      quantity: data.quantity,
      unit: data.unit,
      dailyConsumption: data.daily_consumption,
      daysRemaining: data.days_remaining,
      lowStockThreshold: data.low_stock_threshold,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      lastUpdated: new Date(data.last_updated),
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

  async getLowStockItems(userId: string): Promise<SupplyItem[]> {
    const items = await this.getAll(userId)
    return items.filter(item => item.daysRemaining <= item.lowStockThreshold)
  }
}

export const supplyService = new SupplyService()
