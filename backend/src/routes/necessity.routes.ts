import { Router } from 'express'
import { necessityService } from '../services/necessity.service.js'
import type { AuthRequest } from '../middleware/auth.js'

const router = Router()

// Get all necessity items for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const items = await necessityService.getAll(req.user!.uid)
    res.json(items)
  } catch (error) {
    console.error('Error fetching necessity items:', error)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

// Get single necessity item
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const item = await necessityService.getById(req.params.id, req.user!.uid)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    console.error('Error fetching necessity item:', error)
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

// Create necessity item
router.post('/', async (req: AuthRequest, res) => {
  try {
    const item = await necessityService.create(req.user!.uid, req.body)
    res.status(201).json(item)
  } catch (error) {
    console.error('Error creating necessity item:', error)
    res.status(500).json({ error: 'Failed to create item' })
  }
})

// Update necessity item
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const item = await necessityService.update(req.params.id, req.user!.uid, req.body)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    console.error('Error updating necessity item:', error)
    res.status(500).json({ error: 'Failed to update item' })
  }
})

// Delete necessity item
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const success = await necessityService.delete(req.params.id, req.user!.uid)
    if (!success) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting necessity item:', error)
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

export default router
