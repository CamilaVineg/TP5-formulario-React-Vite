import express from 'express'
import cors from 'cors'
import healthRouter from './routes/health.routes.js'
import tareasRouter from './routes/tareas.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/health', healthRouter)
app.use('/api/tareas', tareasRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use(errorHandler)

export default app
