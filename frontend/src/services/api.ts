import axios from 'axios'
import type { SupplyItem, NecessityItem, SpendingAnalytics } from '@/types'
import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Supply Items API
export const supplyService = {
  async getAll(): Promise<SupplyItem[]> {
    const { data } = await api.get('/supply')
    return data
  },

  async getById(id: string): Promise<SupplyItem> {
    const { data } = await api.get(`/supply/${id}`)
    return data
  },

  async create(item: Omit<SupplyItem, 'id' | 'userId' | 'createdAt' | 'lastUpdated' | 'daysRemaining'>): Promise<SupplyItem> {
    const { data } = await api.post('/supply', item)
    return data
  },

  async update(id: string, updates: Partial<SupplyItem>): Promise<SupplyItem> {
    const { data } = await api.patch(`/supply/${id}`, updates)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/supply/${id}`)
  },
}

// Necessity Items API
export const necessityService = {
  async getAll(): Promise<NecessityItem[]> {
    const { data } = await api.get('/necessity')
    return data
  },

  async getById(id: string): Promise<NecessityItem> {
    const { data } = await api.get(`/necessity/${id}`)
    return data
  },

  async create(item: Omit<NecessityItem, 'id' | 'userId' | 'createdAt' | 'completed'>): Promise<NecessityItem> {
    const { data } = await api.post('/necessity', item)
    return data
  },

  async update(id: string, updates: Partial<NecessityItem>): Promise<NecessityItem> {
    const { data } = await api.patch(`/necessity/${id}`, updates)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/necessity/${id}`)
  },
}

// Analytics API
export const analyticsService = {
  async getSpending(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<SpendingAnalytics> {
    const { data } = await api.get(`/analytics/spending?period=${period}`)
    return data
  },
}

// Price Scraping API (Premium feature)
export const priceService = {
  async scrapePrice(itemId: string): Promise<{ price: number; scrapedAt: Date }> {
    const { data } = await api.post(`/prices/scrape/${itemId}`)
    return data
  },

  async getPriceHistory(itemId: string): Promise<Array<{ price: number; scrapedAt: Date }>> {
    const { data } = await api.get(`/prices/history/${itemId}`)
    return data
  },
}

export default api
