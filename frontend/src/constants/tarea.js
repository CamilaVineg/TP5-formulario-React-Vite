export const TIPOS_ACTIVIDAD = [
  'Desarrollo',
  'Testing',
  'Diseño',
  'Deploy',
  'Soporte',
]

export const ESTADOS = ['Pendiente', 'En Progreso', 'Finalizada']

export const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica']

export const TAREA_VACIA = {
  nombre_proyecto: '',
  tipo_actividad: 'Desarrollo',
  estado: 'Pendiente',
  resumen: '',
  descripcion: '',
  prioridad: 'Media',
  informador: '',
  persona_asignada: '',
  precondicion: '',
  fecha_creacion: new Date().toISOString().slice(0, 10),
  fecha_cierre: '',
  sprint: '',
}

export const soloFecha = (valor) => (valor ? String(valor).slice(0, 10) : '')
