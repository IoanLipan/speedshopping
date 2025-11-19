export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Date
}

export interface SupplyItem {
  id: string
  userId: string
  name: string
  quantity: number
  unit?: string // Unit of measurement (e.g., kg, liters, pieces)
  dailyConsumption: number // How many units consumed per day
  daysRemaining: number // Auto-calculated
  price: number
  currency: string
  productUrl?: string // For price scraping
  addToCartUrl?: string // Direct add to cart
  category?: string
  lastUpdated: Date
  createdAt: Date
  lowStockThreshold: number // When to notify (in days)
  notes?: string
}

export interface NecessityItem {
  id: string
  userId: string
  name: string
  quantity: number // This is now the target quantity
  acquiredQuantity: number // How many have been obtained
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
  timesAddedToCart: number // Track frequency for sorting
}

export interface SpendingAnalytics {
  daily: number
  weekly: number
  monthly: number
  yearly: number
  byCategory: Record<string, number>
  byItem: Record<string, number>
}

export interface HistoryEntry {
  id: string
  userId: string
  action: 'create' | 'update' | 'delete'
  itemType: 'supply' | 'necessity'
  itemId: string
  previousState: SupplyItem | NecessityItem | null
  newState: SupplyItem | NecessityItem | null
  timestamp: Date
}

export interface PriceHistory {
  id: string
  itemId: string
  price: number
  scrapedAt: Date
}

export interface NotificationSettings {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  email?: string
  lowStockDays: number // Notify when X days remaining
}
