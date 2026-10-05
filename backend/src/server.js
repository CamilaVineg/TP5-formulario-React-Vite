import 'dotenv/config'
import app from './app.js'
import { pool } from './db/pool.js'

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya esta ocupado`)
    process.exit(1)
  }
  console.error(err)
  process.exit(1)
})

const apagar = async (senal) => {
  console.log(`${senal} recibido, cerrando servidor`)
  server.close(async () => {
    await pool.end()
    process.exit(0)
  })
}

process.on('SIGTERM', () => apagar('SIGTERM'))
process.on('SIGINT', () => apagar('SIGINT'))
