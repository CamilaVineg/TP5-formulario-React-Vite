import { z } from 'zod'

export const TIPOS_ACTIVIDAD = [
  'Desarrollo',
  'Testing',
  'Diseño',
  'Deploy',
  'Soporte',
]

export const ESTADOS = ['Pendiente', 'En Progreso', 'Finalizada']

export const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica']

export const tareaSchema = z.object({
  nombre_proyecto: z.string().trim().min(1, 'no puede estar vacío').max(120),
  tipo_actividad: z.enum(TIPOS_ACTIVIDAD, {
    error: 'debe ser uno de: ' + TIPOS_ACTIVIDAD.join(', '),
  }),
  estado: z.enum(ESTADOS, {
    error: 'debe ser uno de: ' + ESTADOS.join(', '),
  }),
  resumen: z.string().trim().min(1, 'no puede estar vacío').max(200),
  descripcion: z.string().trim().min(1, 'no puede estar vacío'),
  prioridad: z.enum(PRIORIDADES, {
    error: 'debe ser uno de: ' + PRIORIDADES.join(', '),
  }),
  informador: z.string().trim().min(1, 'no puede estar vacío').max(120),
  persona_asignada: z.string().trim().min(1, 'no puede estar vacío').max(120),
  precondicion: z.string().trim().min(1, 'no puede estar vacío'),
  fecha_creacion: z.iso.date('debe tener formato YYYY-MM-DD'),
  fecha_cierre: z.iso.date('debe tener formato YYYY-MM-DD').nullable().optional(),
  sprint: z.string().trim().min(1, 'no puede estar vacío').max(40),
})
