import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authenticate } from './middleware/auth.js'
import supplyRoutes from './routes/supply.routes.js'
import necessityRoutes from './routes/necessity.routes.js'
import pricesRoutes from './routes/prices.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import { scheduleCountdown } from './jobs/countdown.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes (all protected with authentication)
app.use('/api/supply', authenticate, supplyRoutes)
app.use('/api/necessity', authenticate, necessityRoutes)
app.use('/api/prices', authenticate, pricesRoutes)
app.use('/api/analytics', authenticate, analyticsRoutes)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 API available at http://localhost:${PORT}/api`)

  // Schedule countdown job
  scheduleCountdown()
})

export default app
