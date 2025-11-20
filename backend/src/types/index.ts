export interface SupplyItem {
  id: string
  userId: string
  name: string
  quantity: number
  unit?: string
  dailyConsumption: number
  daysRemaining: number
  price: number
  currency: string
  productUrl?: string
  addToCartUrl?: string
  category?: string
  lastUpdated: Date
  createdAt: Date
  lowStockThreshold: number
  notes?: string
}

export interface NecessityItem {
  id: string
  userId: string
  name: string
  quantity: number
  acquiredQuantity: number
  price: number
  currency: string
  productUrl?: string
  addToCartUrl?: string
  category?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: Date
  completedAt?: Date
  notes?: string
  timesAddedToCart: number
}

export interface NotificationSettings {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  email?: string
  lowStockDays: number
}

export interface PriceHistory {
  id: string
  itemId: string
  price: number
  scrapedAt: Date
}
