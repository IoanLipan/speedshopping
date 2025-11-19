/**
 * Default Household Necessities
 * These items are automatically added to a new user's shopping list
 * Users can remove or modify them as needed
 */

export interface DefaultNecessity {
  name: string
  category: string
  quantity: number
  priority: 'low' | 'medium' | 'high'
  notes: string
}

export const defaultNecessities: DefaultNecessity[] = [
  // Kitchen Essentials
  {
    name: 'Dish Soap',
    category: 'Kitchen',
    quantity: 1,
    priority: 'high',
    notes: 'For washing dishes',
  },
  {
    name: 'Dish Sponge',
    category: 'Kitchen',
    quantity: 3,
    priority: 'high',
    notes: 'Non-scratch sponges',
  },
  {
    name: 'Paper Towels',
    category: 'Kitchen',
    quantity: 6,
    priority: 'medium',
    notes: 'Kitchen roll',
  },
  {
    name: 'Trash Bags',
    category: 'Kitchen',
    quantity: 20,
    priority: 'high',
    notes: 'Kitchen waste bags',
  },

  // Bathroom Essentials
  {
    name: 'Toilet Paper',
    category: 'Bathroom',
    quantity: 12,
    priority: 'high',
    notes: '3-ply toilet tissue',
  },
  {
    name: 'Hand Soap',
    category: 'Bathroom',
    quantity: 2,
    priority: 'high',
    notes: 'Liquid hand soap',
  },
  {
    name: 'Shampoo',
    category: 'Bathroom',
    quantity: 1,
    priority: 'medium',
    notes: 'Hair shampoo',
  },
  {
    name: 'Body Wash',
    category: 'Bathroom',
    quantity: 1,
    priority: 'medium',
    notes: 'Shower gel',
  },
  {
    name: 'Toothpaste',
    category: 'Bathroom',
    quantity: 2,
    priority: 'high',
    notes: 'Fluoride toothpaste',
  },

  // Laundry & Cleaning
  {
    name: 'Laundry Detergent',
    category: 'Cleaning',
    quantity: 1,
    priority: 'high',
    notes: 'Washing liquid/powder',
  },
  {
    name: 'All-Purpose Cleaner',
    category: 'Cleaning',
    quantity: 1,
    priority: 'medium',
    notes: 'Multi-surface spray',
  },

  // Food Staples
  {
    name: 'Eggs',
    category: 'Food',
    quantity: 12,
    priority: 'medium',
    notes: 'Large eggs',
  },
  {
    name: 'Milk',
    category: 'Food',
    quantity: 2,
    priority: 'medium',
    notes: 'Fresh milk',
  },
  {
    name: 'Bread',
    category: 'Food',
    quantity: 1,
    priority: 'medium',
    notes: 'Loaf of bread',
  },
  {
    name: 'Butter',
    category: 'Food',
    quantity: 1,
    priority: 'low',
    notes: 'Salted or unsalted',
  },
  {
    name: 'Coffee',
    category: 'Beverages',
    quantity: 1,
    priority: 'medium',
    notes: 'Ground coffee or beans',
  },
  {
    name: 'Tea',
    category: 'Beverages',
    quantity: 1,
    priority: 'low',
    notes: 'Tea bags',
  },
  {
    name: 'Rice',
    category: 'Pantry',
    quantity: 1,
    priority: 'low',
    notes: 'Long grain rice',
  },
  {
    name: 'Pasta',
    category: 'Pantry',
    quantity: 1,
    priority: 'low',
    notes: 'Spaghetti or penne',
  },

  // Personal Care
  {
    name: 'Tissues',
    category: 'Personal Care',
    quantity: 3,
    priority: 'medium',
    notes: 'Facial tissues',
  },
]
