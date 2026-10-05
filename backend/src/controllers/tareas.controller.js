import * as service from '../services/tareas.service.js'
import { tareaSchema } from '../schemas/tarea.schema.js'

export const listar = async (req, res) => {
  const { estado, proyecto } = req.query
  const tareas = await service.listar({ estado, proyecto })
  res.json(tareas)
}

export const resumen = async (_req, res) => {
  const stats = await service.contar()
  res.json({
    total: Number(stats.total),
    finalizadas: Number(stats.finalizadas),
    pendientes: Number(stats.total) - Number(stats.finalizadas),
  })
}

export const obtenerPorId = async (req, res) => {
  const tarea = await service.obtenerPorId(req.params.id)
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }
  res.json(tarea)
}

export const crear = async (req, res) => {
  const datos = tareaSchema.parse(req.body)
  const tarea = await service.crear(datos)
  res.status(201).json(tarea)
}

export const actualizar = async (req, res) => {
  const datos = tareaSchema.parse(req.body)
  const tarea = await service.actualizar(req.params.id, datos)
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }
  res.json(tarea)
}

export const finalizar = async (req, res) => {
  const tarea = await service.finalizar(req.params.id)
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada o ya finalizada' })
  }
  res.json(tarea)
}

export const eliminar = async (req, res) => {
  const filas = await service.eliminar(req.params.id)
  if (filas === 0) {
    return res.status(404).json({ error: 'Tarea no encontrada' })
  }
  res.status(204).send()
}
