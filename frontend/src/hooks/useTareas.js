import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'

export const useTareas = () => {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const recargar = useCallback(async () => {
    setCargando(true)
    try {
      const datos = await api.listar({ estado: filtroEstado, proyecto: busqueda })
      setTareas(datos)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [filtroEstado, busqueda])

  // Sincronizar con la API es justamente el caso de uso de un efecto: es un
  // sistema externo. El setState no dispara un render en cascada porque ocurre
  // de forma asincronica, despues de resolver la promise.
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    recargar()
  }, [recargar])

  const guardar = useCallback(
    async (tarea) => {
      const guardada = tarea.id
        ? await api.actualizar(tarea.id, tarea)
        : await api.crear(tarea)
      await recargar()
      return guardada
    },
    [recargar],
  )

  const eliminar = useCallback(
    async (id) => {
      await api.eliminar(id)
      await recargar()
    },
    [recargar],
  )

  const finalizar = useCallback(
    async (id) => {
      const actualizada = await api.finalizar(id)
      await recargar()
      return actualizada
    },
    [recargar],
  )

  return {
    tareas,
    cargando,
    error,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    recargar,
    guardar,
    eliminar,
    finalizar,
  }
}
