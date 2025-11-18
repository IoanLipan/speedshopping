/**
 * Product Templates for Quick-Add Feature
 * These are predefined common household items that can be quickly added to inventory
 */

export interface ProductTemplate {
  name: string
  category: string
  defaultQuantity: number
  unit: string
  defaultDailyConsumption: number
  defaultLowStockThreshold: number
  notes: string
  icon?: string // For UI display
}

export const supplyItemTemplates: ProductTemplate[] = [
  // Kitchen & Food Items
  {
    name: 'Eggs',
    category: 'Food',
    defaultQuantity: 12,
    unit: 'pieces',
    defaultDailyConsumption: 2,
    defaultLowStockThreshold: 6,
    notes: 'Large eggs',
    icon: '🥚',
  },
  {
    name: 'Milk',
    category: 'Food',
    defaultQuantity: 2,
    unit: 'liters',
    defaultDailyConsumption: 0.5,
    defaultLowStockThreshold: 1,
    notes: 'Fresh whole milk',
    icon: '🥛',
  },
  {
    name: 'Cottage Cheese',
    category: 'Food',
    defaultQuantity: 500,
    unit: 'grams',
    defaultDailyConsumption: 100,
    defaultLowStockThreshold: 250,
    notes: 'Low-fat cottage cheese',
    icon: '🧀',
  },
  {
    name: 'Bread',
    category: 'Food',
    defaultQuantity: 1,
    unit: 'loaf',
    defaultDailyConsumption: 0.25,
    defaultLowStockThreshold: 0.5,
    notes: 'Whole wheat bread',
    icon: '🍞',
  },
  {
    name: 'Butter',
    category: 'Food',
    defaultQuantity: 250,
    unit: 'grams',
    defaultDailyConsumption: 20,
    defaultLowStockThreshold: 100,
    notes: 'Salted butter',
    icon: '🧈',
  },
  {
    name: 'Coffee',
    category: 'Beverages',
    defaultQuantity: 500,
    unit: 'grams',
    defaultDailyConsumption: 20,
    defaultLowStockThreshold: 100,
    notes: 'Ground coffee',
    icon: '☕',
  },
  {
    name: 'Pasta',
    category: 'Pantry',
    defaultQuantity: 1000,
    unit: 'grams',
    defaultDailyConsumption: 100,
    defaultLowStockThreshold: 300,
    notes: 'Spaghetti',
    icon: '🍝',
  },
  {
    name: 'Rice',
    category: 'Pantry',
    defaultQuantity: 2000,
    unit: 'grams',
    defaultDailyConsumption: 150,
    defaultLowStockThreshold: 500,
    notes: 'Long grain white rice',
    icon: '🍚',
  },
  {
    name: 'Olive Oil',
    category: 'Pantry',
    defaultQuantity: 1000,
    unit: 'ml',
    defaultDailyConsumption: 15,
    defaultLowStockThreshold: 200,
    notes: 'Extra virgin olive oil',
    icon: '🫒',
  },

  // Cleaning & Household
  {
    name: 'Toilet Paper',
    category: 'Household',
    defaultQuantity: 12,
    unit: 'rolls',
    defaultDailyConsumption: 1,
    defaultLowStockThreshold: 4,
    notes: '3-ply toilet paper',
    icon: '🧻',
  },
  {
    name: 'Paper Towels',
    category: 'Household',
    defaultQuantity: 6,
    unit: 'rolls',
    defaultDailyConsumption: 0.5,
    defaultLowStockThreshold: 2,
    notes: 'Absorbent paper towels',
    icon: '🧻',
  },
  {
    name: 'Dish Sponge',
    category: 'Household',
    defaultQuantity: 4,
    unit: 'pieces',
    defaultDailyConsumption: 0.25,
    defaultLowStockThreshold: 1,
    notes: 'Non-scratch dish sponges',
    icon: '🧽',
  },
  {
    name: 'Dish Soap',
    category: 'Household',
    defaultQuantity: 1000,
    unit: 'ml',
    defaultDailyConsumption: 30,
    defaultLowStockThreshold: 200,
    notes: 'Liquid dish soap',
    icon: '🧴',
  },
  {
    name: 'Laundry Detergent',
    category: 'Household',
    defaultQuantity: 3000,
    unit: 'ml',
    defaultDailyConsumption: 50,
    defaultLowStockThreshold: 500,
    notes: 'Liquid laundry detergent',
    icon: '🧴',
  },
  {
    name: 'All-Purpose Cleaner',
    category: 'Household',
    defaultQuantity: 750,
    unit: 'ml',
    defaultDailyConsumption: 20,
    defaultLowStockThreshold: 150,
    notes: 'Multi-surface cleaner',
    icon: '🧴',
  },
  {
    name: 'Trash Bags',
    category: 'Household',
    defaultQuantity: 30,
    unit: 'bags',
    defaultDailyConsumption: 1,
    defaultLowStockThreshold: 10,
    notes: '50L trash bags',
    icon: '🗑️',
  },

  // Personal Care
  {
    name: 'Shampoo',
    category: 'Personal Care',
    defaultQuantity: 400,
    unit: 'ml',
    defaultDailyConsumption: 10,
    defaultLowStockThreshold: 100,
    notes: 'Daily shampoo',
    icon: '🧴',
  },
  {
    name: 'Body Wash',
    category: 'Personal Care',
    defaultQuantity: 500,
    unit: 'ml',
    defaultDailyConsumption: 15,
    defaultLowStockThreshold: 100,
    notes: 'Moisturizing body wash',
    icon: '🧴',
  },
  {
    name: 'Toothpaste',
    category: 'Personal Care',
    defaultQuantity: 150,
    unit: 'ml',
    defaultDailyConsumption: 3,
    defaultLowStockThreshold: 30,
    notes: 'Fluoride toothpaste',
    icon: '🪥',
  },
  {
    name: 'Hand Soap',
    category: 'Personal Care',
    defaultQuantity: 500,
    unit: 'ml',
    defaultDailyConsumption: 15,
    defaultLowStockThreshold: 100,
    notes: 'Antibacterial hand soap',
    icon: '🧼',
  },

  // Produce
  {
    name: 'Apples',
    category: 'Produce',
    defaultQuantity: 2000,
    unit: 'grams',
    defaultDailyConsumption: 200,
    defaultLowStockThreshold: 500,
    notes: 'Fresh apples',
    icon: '🍎',
  },
  {
    name: 'Bananas',
    category: 'Produce',
    defaultQuantity: 1500,
    unit: 'grams',
    defaultDailyConsumption: 200,
    defaultLowStockThreshold: 400,
    notes: 'Fresh bananas',
    icon: '🍌',
  },
  {
    name: 'Tomatoes',
    category: 'Produce',
    defaultQuantity: 1000,
    unit: 'grams',
    defaultDailyConsumption: 150,
    defaultLowStockThreshold: 300,
    notes: 'Fresh tomatoes',
    icon: '🍅',
  },
  {
    name: 'Potatoes',
    category: 'Produce',
    defaultQuantity: 3000,
    unit: 'grams',
    defaultDailyConsumption: 300,
    defaultLowStockThreshold: 1000,
    notes: 'White potatoes',
    icon: '🥔',
  },
  {
    name: 'Onions',
    category: 'Produce',
    defaultQuantity: 1500,
    unit: 'grams',
    defaultDailyConsumption: 100,
    defaultLowStockThreshold: 500,
    notes: 'Yellow onions',
    icon: '🧅',
  },
  {
    name: 'Carrots',
    category: 'Produce',
    defaultQuantity: 1000,
    unit: 'grams',
    defaultDailyConsumption: 100,
    defaultLowStockThreshold: 300,
    notes: 'Fresh carrots',
    icon: '🥕',
  },
]

export const necessityItemTemplates: ProductTemplate[] = [
  // Kitchen Items
  {
    name: 'Cutting Board',
    category: 'Kitchen',
    defaultQuantity: 1,
    unit: 'piece',
    defaultDailyConsumption: 0,
    defaultLowStockThreshold: 0,
    notes: 'Bamboo cutting board',
    icon: '🔪',
  },
  {
    name: 'Kitchen Knife Set',
    category: 'Kitchen',
    defaultQuantity: 1,
    unit: 'set',
    defaultDailyConsumption: 0,
    defaultLowStockThreshold: 0,
    notes: 'Professional chef knives',
    icon: '🔪',
  },
  {
    name: 'Food Storage Containers',
    category: 'Kitchen',
    defaultQuantity: 1,
    unit: 'set',
    defaultDailyConsumption: 0,
    defaultLowStockThreshold: 0,
    notes: 'Glass containers with lids',
    icon: '📦',
  },

  // Household Items
  {
    name: 'Light Bulbs',
    category: 'Household',
    defaultQuantity: 4,
    unit: 'bulbs',
    defaultDailyConsumption: 0,
    defaultLowStockThreshold: 0,
    notes: 'LED 60W equivalent, warm white',
    icon: '💡',
  },
  {
    name: 'Batteries (AA)',
    category: 'Household',
    defaultQuantity: 12,
    unit: 'batteries',
    defaultDailyConsumption: 0,
    defaultLowStockThreshold: 0,
    notes: 'Alkaline AA batteries',
    icon: '🔋',
  },
  {
    name: 'Batteries (AAA)',
    category: 'Household',
    defaultQuantity: 12,
    unit: 'batteries',
    defaultDailyConsumption: 0,
    defaultLowStockThreshold: 0,
    notes: 'Alkaline AAA batteries',
    icon: '🔋',
  },

  // Personal Items
  {
    name: 'Toothbrush',
    category: 'Personal Care',
    defaultQuantity: 1,
    unit: 'piece',
    defaultDailyConsumption: 0,
    defaultLowStockThreshold: 0,
    notes: 'Soft bristles',
    icon: '🪥',
  },
  {
    name: 'Bath Towels',
    category: 'Personal Care',
    defaultQuantity: 2,
    unit: 'towels',
    defaultDailyConsumption: 0,
    defaultLowStockThreshold: 0,
    notes: 'Large bath towels',
    icon: '🧺',
  },
]

/**
 * Get templates by category for easier filtering
 */
export function getTemplatesByCategory(
  templates: ProductTemplate[],
  category?: string
): ProductTemplate[] {
  if (!category || category === 'all') {
    return templates
  }
  return templates.filter((t) => t.category === category)
}

/**
 * Get all unique categories from templates
 */
export function getTemplateCategories(templates: ProductTemplate[]): string[] {
  const categories = new Set(templates.map((t) => t.category))
  return Array.from(categories).sort()
}
