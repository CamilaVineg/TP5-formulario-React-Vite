import { soloFecha } from '../constants/tarea.js'

const claseEstado = (estado) => `badge badge--${estado.toLowerCase().replace(/\s+/g, '-')}`

function ListadoTareas({ tareas, cargando, error, onEditar, onFinalizar, onEliminar }) {
  if (cargando) {
    return <p className="estado-mensaje">Cargando tareas...</p>
  }

  if (error) {
    return (
      <div className="estado-mensaje estado-mensaje--error">
        <strong>No se pudo cargar el listado.</strong>
        <p>{error}</p>
      </div>
    )
  }

  if (tareas.length === 0) {
    return <p className="estado-mensaje">No hay tareas para mostrar.</p>
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Proyecto</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Asignada a</th>
            <th>Sprint</th>
            <th>Creación</th>
            <th>Cierre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id}>
              <td>{tarea.id}</td>
              <td>
                <strong>{tarea.nombre_proyecto}</strong>
                <p className="sub">{tarea.resumen}</p>
              </td>
              <td>{tarea.tipo_actividad}</td>
              <td><span className={claseEstado(tarea.estado)}>{tarea.estado}</span></td>
              <td>{tarea.prioridad}</td>
              <td>{tarea.persona_asignada}</td>
              <td>{tarea.sprint}</td>
              <td>{soloFecha(tarea.fecha_creacion)}</td>
              <td>{soloFecha(tarea.fecha_cierre) || '—'}</td>
              <td className="acciones-celda">
                <button type="button" onClick={() => onEditar(tarea)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="secundario"
                  onClick={() => onFinalizar(tarea)}
                  disabled={tarea.estado === 'Finalizada'}
                  title={
                    tarea.estado === 'Finalizada'
                      ? 'La tarea ya esta finalizada'
                      : 'Marcar como finalizada'
                  }
                >
                  Finalizar
                </button>
                <button type="button" className="peligro" onClick={() => onEliminar(tarea)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListadoTareas
