import { useState } from 'react'
import TareaForm from './components/TareaForm.jsx'
import ListadoTareas from './components/ListadoTareas.jsx'
import { useTareas } from './hooks/useTareas.js'
import { ESTADOS } from './constants/tarea.js'

function App() {
  const {
    tareas,
    cargando,
    error,
    filtroEstado,
    setFiltroEstado,
    busqueda,
    setBusqueda,
    guardar,
    eliminar,
    finalizar,
  } = useTareas()

  const [editando, setEditando] = useState(null)
  const [aviso, setAviso] = useState(null)

  const notificar = (mensaje, tipo = 'ok') => {
    setAviso({ mensaje, tipo })
    setTimeout(() => setAviso(null), 4000)
  }

  const alGuardar = async (tarea) => {
    try {
      const guardada = await guardar(tarea)
      setEditando(null)
      notificar(guardada.id ? `Tarea #${guardada.id} actualizada` : `Tarea #${guardada.id} creada`)
    } catch (err) {
      notificar(err.message, 'error')
    }
  }

  const alFinalizar = async (tarea) => {
    if (!window.confirm(`¿Finalizar la tarea "${tarea.nombre_proyecto}"? Se le asignará la fecha de cierre de hoy.`)) {
      return
    }
    try {
      await finalizar(tarea.id)
      notificar(`Tarea #${tarea.id} finalizada`)
    } catch (err) {
      notificar(err.message, 'error')
    }
  }

  const alEliminar = async (tarea) => {
    if (!window.confirm(`¿Eliminar la tarea "${tarea.nombre_proyecto}"? Esta acción no se puede deshacer.`)) {
      return
    }
    try {
      await eliminar(tarea.id)
      notificar(`Tarea #${tarea.id} eliminada`)
    } catch (err) {
      notificar(err.message, 'error')
    }
  }

  const finalizadas = tareas.filter((t) => t.estado === 'Finalizada').length

  return (
    <div className="app">
      <header className="encabezado">
        <h1>Manejador de Tareas</h1>
        <p>Gestión de tareas de proyectos de software</p>
      </header>

      {aviso && <div className={`aviso aviso--${aviso.tipo}`}>{aviso.mensaje}</div>}

      <TareaForm
        key={editando ? `editar-${editando.id}` : 'nueva'}
        valoresIniciales={editando}
        onSubmit={alGuardar}
        onCancelar={() => setEditando(null)}
      />

      <section className="panel">
        <div className="listado-cabecera">
          <h2 className="panel__titulo">Listado de Tareas</h2>
          <div className="filtros">
            <input
              type="search"
              placeholder="Buscar por proyecto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar por proyecto"
            />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              {ESTADOS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="contador">
          {tareas.length} tareas visibles · {finalizadas} finalizadas
        </p>

        <ListadoTareas
          tareas={tareas}
          cargando={cargando}
          error={error}
          onEditar={setEditando}
          onFinalizar={alFinalizar}
          onEliminar={alEliminar}
        />
      </section>
    </div>
  )
}

export default App
