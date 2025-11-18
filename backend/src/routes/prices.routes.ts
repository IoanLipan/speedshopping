import { Router } from 'express'
import { priceScraperService } from '../services/price-scraper.service.js'
import { supplyService } from '../services/supply.service.js'
import { necessityService } from '../services/necessity.service.js'
import type { AuthRequest } from '../middleware/auth.js'

const router = Router()

// Scrape price for a supply item
router.post('/scrape/supply/:id', async (req: AuthRequest, res) => {
  try {
    const item = await supplyService.getById(req.params.id, req.user!.uid)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    if (!item.productUrl) {
      return res.status(400).json({ error: 'Item has no product URL' })
    }

    const result = await priceScraperService.scrapePriceAndSave(item.id, item.productUrl)

    if (result.price === null) {
      return res.status(500).json({ error: 'Failed to scrape price' })
    }

    res.json(result)
  } catch (error) {
    console.error('Error scraping price:', error)
    res.status(500).json({ error: 'Failed to scrape price' })
  }
})

// Scrape price for a necessity item
router.post('/scrape/necessity/:id', async (req: AuthRequest, res) => {
  try {
    const item = await necessityService.getById(req.params.id, req.user!.uid)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    if (!item.productUrl) {
      return res.status(400).json({ error: 'Item has no product URL' })
    }

    const result = await priceScraperService.scrapePriceAndSave(item.id, item.productUrl)

    if (result.price === null) {
      return res.status(500).json({ error: 'Failed to scrape price' })
    }

    res.json(result)
  } catch (error) {
    console.error('Error scraping price:', error)
    res.status(500).json({ error: 'Failed to scrape price' })
  }
})

// Get price history for an item
router.get('/history/:id', async (req: AuthRequest, res) => {
  try {
    const history = await priceScraperService.getPriceHistory(req.params.id)
    res.json(history)
  } catch (error) {
    console.error('Error fetching price history:', error)
    res.status(500).json({ error: 'Failed to fetch price history' })
  }
})

export default router
