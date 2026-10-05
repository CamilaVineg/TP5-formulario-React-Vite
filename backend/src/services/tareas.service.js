import { pool } from '../db/pool.js'

const CAMPOS = `
  nombre_proyecto,
  tipo_actividad,
  estado,
  resumen,
  descripcion,
  prioridad,
  informador,
  persona_asignada,
  precondicion,
  fecha_creacion,
  fecha_cierre,
  sprint
`

const VALORES = (datos) => [
  datos.nombre_proyecto,
  datos.tipo_actividad,
  datos.estado,
  datos.resumen,
  datos.descripcion,
  datos.prioridad,
  datos.informador,
  datos.persona_asignada,
  datos.precondicion,
  datos.fecha_creacion,
  datos.fecha_cierre ?? null,
  datos.sprint,
]

export const listar = async ({ estado, proyecto } = {}) => {
  const condiciones = []
  const valores = []

  if (estado) {
    valores.push(estado)
    condiciones.push(`estado = $${valores.length}`)
  }

  if (proyecto) {
    valores.push(`%${proyecto}%`)
    condiciones.push(`nombre_proyecto ILIKE $${valores.length}`)
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''

  const { rows } = await pool.query(
    `SELECT * FROM tareas ${where} ORDER BY created_at DESC, id DESC`,
    valores,
  )

  return rows
}

export const obtenerPorId = async (id) => {
  const { rows } = await pool.query('SELECT * FROM tareas WHERE id = $1', [id])
  return rows[0] ?? null
}

export const crear = async (datos) => {
  const { rows } = await pool.query(
    `INSERT INTO tareas (${CAMPOS})
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    VALORES(datos),
  )
  return rows[0]
}

export const actualizar = async (id, datos) => {
  const { rows } = await pool.query(
    `UPDATE tareas SET
       nombre_proyecto = $1,
       tipo_actividad = $2,
       estado = $3,
       resumen = $4,
       descripcion = $5,
       prioridad = $6,
       informador = $7,
       persona_asignada = $8,
       precondicion = $9,
       fecha_creacion = $10,
       fecha_cierre = $11,
       sprint = $12,
       updated_at = NOW()
     WHERE id = $13
     RETURNING *`,
    [...VALORES(datos), id],
  )
  return rows[0] ?? null
}

export const finalizar = async (id) => {
  const { rows } = await pool.query(
    `UPDATE tareas
     SET estado = 'Finalizada',
         fecha_cierre = CURRENT_DATE,
         updated_at = NOW()
     WHERE id = $1 AND estado <> 'Finalizada'
     RETURNING *`,
    [id],
  )
  return rows[0] ?? null
}

export const eliminar = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM tareas WHERE id = $1', [id])
  return rowCount
}

export const contar = async () => {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE estado = 'Finalizada') AS finalizadas
     FROM tareas`,
  )
  return rows[0]
}
