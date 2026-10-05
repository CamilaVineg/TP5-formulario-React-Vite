import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './pool.js'

const aqui = dirname(fileURLToPath(import.meta.url))
const candidates = [
  join(aqui, '..', '..', '..', 'db', 'schema.sql'),
  join(aqui, '..', '..', 'db', 'schema.sql'),
  join(process.cwd(), 'db', 'schema.sql'),
]

const encontrarSchema = async () => {
  for (const ruta of candidates) {
    try {
      await readFile(ruta)
      return ruta
    } catch {
      continue
    }
  }
  return null
}

export const migrar = async () => {
  const ruta = await encontrarSchema()
  if (!ruta) {
    throw new Error('No se encontro db/schema.sql')
  }
  const sql = await readFile(ruta, 'utf8')
  await pool.query(sql)
  console.log('Migracion aplicada desde db/schema.sql')
}

const ejecutar = async () => {
  await migrar()
  await pool.end()
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  ejecutar().catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
}
