import { Router } from 'express'
import { supplyService } from '../services/supply.service.js'
import { necessityService } from '../services/necessity.service.js'
import type { AuthRequest } from '../middleware/auth.js'

const router = Router()

// Get spending analytics
router.get('/spending', async (req: AuthRequest, res) => {
  try {
    const supplyItems = await supplyService.getAll(req.user!.uid)
    const necessityItems = await necessityService.getAll(req.user!.uid)

    // Calculate spending based on items
    const byCategory: Record<string, number> = {}
    const byItem: Record<string, number> = {}

    // Calculate from supply items (annualized based on daily consumption)
    for (const item of supplyItems) {
      const yearlyConsumption = item.dailyConsumption * 365
      const yearlySpending = yearlyConsumption * item.price

      // By category
      const category = item.category || 'Uncategorized'
      byCategory[category] = (byCategory[category] || 0) + yearlySpending

      // By item
      byItem[item.name] = (byItem[item.name] || 0) + yearlySpending
    }

    // Add necessity items (one-time purchases)
    for (const item of necessityItems) {
      if (!item.completed) {
        const totalCost = item.price * item.quantity

        const category = item.category || 'Uncategorized'
        byCategory[category] = (byCategory[category] || 0) + totalCost

        byItem[item.name] = (byItem[item.name] || 0) + totalCost
      }
    }

    // Calculate totals
    const yearly = Object.values(byCategory).reduce((sum, val) => sum + val, 0)
    const monthly = yearly / 12
    const weekly = yearly / 52
    const daily = yearly / 365

    res.json({
      daily,
      weekly,
      monthly,
      yearly,
      byCategory,
      byItem,
    })
  } catch (error) {
    console.error('Error calculating analytics:', error)
    res.status(500).json({ error: 'Failed to calculate analytics' })
  }
})

export default router
