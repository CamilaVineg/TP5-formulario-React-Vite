import { useState } from 'react'
import {
  ESTADOS,
  PRIORIDADES,
  TAREA_VACIA,
  TIPOS_ACTIVIDAD,
  soloFecha,
} from '../constants/tarea.js'

const CAMPOS_TEXTO = [
  { name: 'nombre_proyecto', label: 'Nombre del Proyecto', maxLength: 120 },
  { name: 'resumen', label: 'Resumen', maxLength: 200 },
  { name: 'informador', label: 'Informador', maxLength: 120 },
  { name: 'persona_asignada', label: 'Persona asignada', maxLength: 120 },
  { name: 'sprint', label: 'Sprint', maxLength: 40 },
]

const CAMPOS_AREA = [
  { name: 'descripcion', label: 'Descripción' },
  { name: 'precondicion', label: 'Precondición' },
]

const desdeProps = (iniciales) => {
  if (!iniciales) return { ...TAREA_VACIA }
  return {
    ...TAREA_VACIA,
    ...iniciales,
    fecha_creacion: soloFecha(iniciales.fecha_creacion),
    fecha_cierre: soloFecha(iniciales.fecha_cierre),
  }
}

function TareaForm({ valoresIniciales, onSubmit, onCancelar }) {
  const editando = Boolean(valoresIniciales?.id)
  const [tarea, setTarea] = useState(() => desdeProps(valoresIniciales))
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => {
    const { name, value } = e.target
    setTarea((actual) => ({ ...actual, [name]: value }))
    setErrores((actual) => ({ ...actual, [name]: undefined }))
  }

  const validar = () => {
    const nuevos = {}

    for (const campo of CAMPOS_TEXTO) {
      if (!tarea[campo.name].trim()) nuevos[campo.name] = 'Este campo es obligatorio'
    }

    for (const campo of CAMPOS_AREA) {
      if (!tarea[campo.name].trim()) nuevos[campo.name] = 'Este campo es obligatorio'
    }

    if (!tarea.fecha_creacion) nuevos.fecha_creacion = 'Este campo es obligatorio'

    if (tarea.fecha_cierre && !tarea.fecha_creacion) {
      nuevos.fecha_cierre = 'No puede cerrarse una tarea sin fecha de creación'
    }

    if (
      tarea.fecha_cierre &&
      tarea.fecha_creacion &&
      tarea.fecha_cierre < tarea.fecha_creacion
    ) {
      nuevos.fecha_cierre = 'La fecha de cierre no puede ser anterior a la de creación'
    }

    return nuevos
  }

  const enviar = async (e) => {
    e.preventDefault()
    const nuevos = validar()

    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos)
      return
    }

    setEnviando(true)
    try {
      await onSubmit({
        ...tarea,
        fecha_cierre: tarea.fecha_cierre ? tarea.fecha_cierre : null,
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="panel">
      <h2 className="panel__titulo">
        {editando ? `Editar tarea #${valoresIniciales.id}` : 'Nueva tarea'}
      </h2>

      <form onSubmit={enviar} noValidate>
        <div className="grid">
          {CAMPOS_TEXTO.map((campo) => (
            <div className="campo" key={campo.name}>
              <label htmlFor={campo.name}>{campo.label}</label>
              <input
                id={campo.name}
                name={campo.name}
                value={tarea[campo.name]}
                onChange={cambiar}
                maxLength={campo.maxLength}
                className={errores[campo.name] ? 'invalid' : ''}
                aria-invalid={Boolean(errores[campo.name])}
              />
              {errores[campo.name] && <span className="error">{errores[campo.name]}</span>}
            </div>
          ))}

          <div className="campo">
            <label htmlFor="tipo_actividad">Tipo de Actividad</label>
            <select id="tipo_actividad" name="tipo_actividad" value={tarea.tipo_actividad} onChange={cambiar}>
              {TIPOS_ACTIVIDAD.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="estado">Estado</label>
            <select id="estado" name="estado" value={tarea.estado} onChange={cambiar}>
              {ESTADOS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="prioridad">Prioridad</label>
            <select id="prioridad" name="prioridad" value={tarea.prioridad} onChange={cambiar}>
              {PRIORIDADES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="fecha_creacion">Fecha de Creación</label>
            <input
              id="fecha_creacion"
              name="fecha_creacion"
              type="date"
              value={tarea.fecha_creacion}
              onChange={cambiar}
              className={errores.fecha_creacion ? 'invalid' : ''}
            />
            {errores.fecha_creacion && <span className="error">{errores.fecha_creacion}</span>}
          </div>

          <div className="campo">
            <label htmlFor="fecha_cierre">Fecha de Cierre</label>
            <input
              id="fecha_cierre"
              name="fecha_cierre"
              type="date"
              value={tarea.fecha_cierre}
              onChange={cambiar}
              disabled={tarea.estado !== 'Finalizada'}
              className={errores.fecha_cierre ? 'invalid' : ''}
            />
            {errores.fecha_cierre ? (
              <span className="error">{errores.fecha_cierre}</span>
            ) : (
              <span className="hint">Solo habilitada si el estado es Finalizada</span>
            )}
          </div>

          {CAMPOS_AREA.map((campo) => (
            <div className="campo campo--ancho" key={campo.name}>
              <label htmlFor={campo.name}>{campo.label}</label>
              <textarea
                id={campo.name}
                name={campo.name}
                rows={3}
                value={tarea[campo.name]}
                onChange={cambiar}
                className={errores[campo.name] ? 'invalid' : ''}
              />
              {errores[campo.name] && <span className="error">{errores[campo.name]}</span>}
            </div>
          ))}
        </div>

        <div className="acciones">
          <button type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear tarea'}
          </button>
          {editando && (
            <button type="button" className="secundario" onClick={onCancelar} disabled={enviando}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

export default TareaForm
