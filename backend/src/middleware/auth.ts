import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase.js'

export interface AuthRequest extends Request {
  user?: {
    uid: string
    email?: string
  }
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.split('Bearer ')[1]

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = {
      uid: user.id,
      email: user.email,
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}
