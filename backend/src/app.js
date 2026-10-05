import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/health', healthRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

export default app