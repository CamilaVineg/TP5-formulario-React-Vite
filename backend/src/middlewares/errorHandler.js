import { ZodError } from 'zod'

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Datos invalidos',
      detalles: err.issues.map((issue) => ({
        campo: issue.path.join('.') || '(raiz)',
        mensaje: issue.message,
      })),
    })
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON invalido en el body' })
  }

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Registro duplicado' })
  }

  if (err.code === '23503') {
    return res.status(409).json({ error: 'Referencia a un registro inexistente' })
  }

  if (err.code === '22P02') {
    return res.status(400).json({ error: 'Identificador con formato invalido' })
  }

  if (err.code === '23514') {
    return res.status(400).json({
      error: 'Dato rechazado por una restriccion de la base de datos',
      restriccion: err.constraint,
    })
  }

  console.error('[error]', err)

  res.status(500).json({ error: 'Error interno del servidor' })
}
