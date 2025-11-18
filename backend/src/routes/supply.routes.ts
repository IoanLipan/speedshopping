import { Router } from 'express'
import { supplyService } from '../services/supply.service.js'
import type { AuthRequest } from '../middleware/auth.js'

const router = Router()

// Get all supply items for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const items = await supplyService.getAll(req.user!.uid)
    res.json(items)
  } catch (error) {
    console.error('Error fetching supply items:', error)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

// Get single supply item
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const item = await supplyService.getById(req.params.id, req.user!.uid)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    console.error('Error fetching supply item:', error)
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

// Create supply item
router.post('/', async (req: AuthRequest, res) => {
  try {
    const item = await supplyService.create(req.user!.uid, req.body)
    res.status(201).json(item)
  } catch (error) {
    console.error('Error creating supply item:', error)
    res.status(500).json({ error: 'Failed to create item' })
  }
})

// Update supply item
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const item = await supplyService.update(req.params.id, req.user!.uid, req.body)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    console.error('Error updating supply item:', error)
    res.status(500).json({ error: 'Failed to update item' })
  }
})

// Delete supply item
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const success = await supplyService.delete(req.params.id, req.user!.uid)
    if (!success) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting supply item:', error)
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

// Get low stock items
router.get('/low-stock/list', async (req: AuthRequest, res) => {
  try {
    const items = await supplyService.getLowStockItems(req.user!.uid)
    res.json(items)
  } catch (error) {
    console.error('Error fetching low stock items:', error)
    res.status(500).json({ error: 'Failed to fetch low stock items' })
  }
})

export default router
