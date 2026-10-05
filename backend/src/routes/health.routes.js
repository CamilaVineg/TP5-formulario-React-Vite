import { Router } from 'express'
import { pool } from '../db/pool.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.status(200).json({ status: 'ok', db: 'up' })
  } catch {
    res.status(503).json({ status: 'error', db: 'down' })
  }
})

export default router