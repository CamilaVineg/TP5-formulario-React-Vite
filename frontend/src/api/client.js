const BASE = import.meta.env.VITE_API_URL || '/api'

class ApiError extends Error {
  constructor(message, status, detalles) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detalles = detalles ?? []
  }
}

const request = async (path, { method = 'GET', body } = {}) => {
  let res

  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0)
  }

  if (res.status === 204) return null

  const texto = await res.text()
  let datos = null
  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = null
  }

  if (!res.ok) {
    throw new ApiError(
      datos?.error || `Error ${res.status}`,
      res.status,
      datos?.detalles,
    )
  }

  return datos
}

export const api = {
  listar: (filtros = {}) => {
    const params = new URLSearchParams()
    if (filtros.estado) params.set('estado', filtros.estado)
    if (filtros.proyecto) params.set('proyecto', filtros.proyecto)
    const query = params.toString()
    return request(`/tareas${query ? `?${query}` : ''}`)
  },
  crear: (tarea) => request('/tareas', { method: 'POST', body: tarea }),
  actualizar: (id, tarea) => request(`/tareas/${id}`, { method: 'PUT', body: tarea }),
  finalizar: (id) => request(`/tareas/${id}/finalizar`, { method: 'PATCH' }),
  eliminar: (id) => request(`/tareas/${id}`, { method: 'DELETE' }),
}
