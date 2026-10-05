const BASE = process.env.BASE_URL || 'http://localhost:3000/api'

let ok = 0
let fallos = 0

const color = (codigo) => {
  if (codigo >= 200 && codigo < 300) return '2xx'
  if (codigo >= 400 && codigo < 500) return '4xx'
  return '5xx'
}

const pedir = async (method, ruta, body) => {
  const res = await fetch(`${BASE}${ruta}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  const texto = await res.text()
  let datos
  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = texto
  }
  return { status: res.status, datos }
}

const verificar = async ({ titulo, method, ruta, body, esperado, chequeo, categoria }) => {
  const { status, datos } = await pedir(method, ruta, body)
  const codigo = color(status)
  const bien = status === esperado && (chequeo ? chequeo(datos) : true)

  if (bien) ok++
  else fallos++

  console.log('')
  console.log(`${bien ? 'PASA' : 'FALLA'}  ${titulo}`)
  console.log(`      ${method} ${ruta}`)
  console.log(`      HTTP ${status} (${codigo})  |  esperado: ${esperado}`)
  if (body) console.log(`      body enviado: ${JSON.stringify(body)}`)
  console.log(`      respuesta: ${JSON.stringify(datos)}`)
  if (!bien) console.log(`      ^ fallo la verificacion`)
}

const tareaValida = {
  nombre_proyecto: 'Refactor login',
  tipo_actividad: 'Desarrollo',
  estado: 'Pendiente',
  resumen: 'Reescribir el formulario de acceso',
  descripcion: 'Separar validacion de UI y de negocio en el login.',
  prioridad: 'Alta',
  informador: 'Carla Mendez',
  persona_asignada: 'Vine',
  precondicion: 'Acceso al repo frontend',
  fecha_creacion: '2026-10-05',
  sprint: 'Sprint 9',
}

const tareaEditada = {
  ...tareaValida,
  nombre_proyecto: 'Migracion ERP v2',
  estado: 'En Progreso',
  prioridad: 'Crítica',
  fecha_creacion: '2026-10-01',
  sprint: 'Sprint 7',
}

console.log('='.repeat(70))
console.log('CASOS CORRECTOS')
console.log('='.repeat(70))

let nuevoId = null

await verificar({
  titulo: 'Healthcheck de la API y la base de datos',
  method: 'GET',
  ruta: '/health',
  esperado: 200,
  chequeo: (d) => d.status === 'ok' && d.db === 'up',
})

await verificar({
  titulo: 'Listar tareas existentes',
  method: 'GET',
  ruta: '/tareas',
  esperado: 200,
  chequeo: (d) => Array.isArray(d),
})

await verificar({
  titulo: 'Crear una tarea',
  method: 'POST',
  ruta: '/tareas',
  body: tareaValida,
  esperado: 201,
  chequeo: (d) => d.estado === 'Pendiente' && d.fecha_cierre === null,
})

const creada = await pedir('POST', '/tareas', tareaValida)
nuevoId = creada.datos?.id

await verificar({
  titulo: 'Crear una tarea con fecha_cierre informed (Finalizada)',
  method: 'POST',
  ruta: '/tareas',
  body: { ...tareaValida, estado: 'Finalizada', fecha_cierre: '2026-10-04' },
  esperado: 201,
  chequeo: (d) => d.estado === 'Finalizada' && d.fecha_cierre !== null,
})

await verificar({
  titulo: 'Obtener una tarea por id',
  method: 'GET',
  ruta: `/tareas/${nuevoId}`,
  esperado: 200,
  chequeo: (d) => d.id === nuevoId,
})

await verificar({
  titulo: 'Editar una tarea',
  method: 'PUT',
  ruta: `/tareas/${nuevoId}`,
  body: tareaEditada,
  esperado: 200,
  chequeo: (d) => d.nombre_proyecto === 'Migracion ERP v2' && d.estado === 'En Progreso',
})

await verificar({
  titulo: 'Finalizar una tarea (estado + fecha_cierre automaticos)',
  method: 'PATCH',
  ruta: `/tareas/${nuevoId}/finalizar`,
  esperado: 200,
  chequeo: (d) => d.estado === 'Finalizada' && d.fecha_cierre !== null,
})

await verificar({
  titulo: 'Resumen con estadisticas',
  method: 'GET',
  ruta: '/tareas/resumen',
  esperado: 200,
  chequeo: (d) => typeof d.total === 'number' && d.total > 0,
})

await verificar({
  titulo: 'Filtrar por estado',
  method: 'GET',
  ruta: '/tareas?estado=Finalizada',
  esperado: 200,
  chequeo: (d) => Array.isArray(d) && d.every((t) => t.estado === 'Finalizada'),
})

await verificar({
  titulo: 'Filtrar por proyecto (busqueda parcial, case-insensitive)',
  method: 'GET',
  ruta: '/tareas?proyecto=Migr',
  esperado: 200,
  chequeo: (d) => Array.isArray(d) && d.length > 0 && d.every((t) => t.nombre_proyecto.toLowerCase().includes('migr')),
})

await verificar({
  titulo: 'Eliminar una tarea',
  method: 'DELETE',
  ruta: `/tareas/${nuevoId}`,
  esperado: 204,
  chequeo: (d) => d === null,
})

console.log('')
console.log('='.repeat(70))
console.log('CASOS INCORRECTOS')
console.log('='.repeat(70))

await verificar({
  titulo: 'tipo_actividad fuera del catalogo',
  method: 'POST',
  ruta: '/tareas',
  body: { ...tareaValida, tipo_actividad: 'Hacha' },
  esperado: 400,
  chequeo: (d) => d.error === 'Datos invalidos' && d.detalles.some((x) => x.campo === 'tipo_actividad'),
})

await verificar({
  titulo: 'estado fuera del catalogo',
  method: 'POST',
  ruta: '/tareas',
  body: { ...tareaValida, estado: 'A medio hacer' },
  esperado: 400,
  chequeo: (d) => d.detalles.some((x) => x.campo === 'estado'),
})

await verificar({
  titulo: 'fecha_creacion con formato dd/mm/aaaa',
  method: 'POST',
  ruta: '/tareas',
  body: { ...tareaValida, fecha_creacion: '05/10/2026' },
  esperado: 400,
  chequeo: (d) => d.detalles.some((x) => x.campo === 'fecha_creacion'),
})

await verificar({
  titulo: 'campo obligatorio vacio',
  method: 'POST',
  ruta: '/tareas',
  body: { ...tareaValida, nombre_proyecto: '' },
  esperado: 400,
  chequeo: (d) => d.detalles.some((x) => x.campo === 'nombre_proyecto'),
})

await verificar({
  titulo: 'campo obligatorio ausente',
  method: 'POST',
  ruta: '/tareas',
  body: (({ sprint, ...resto }) => resto)(tareaValida),
  esperado: 400,
  chequeo: (d) => d.detalles.some((x) => x.campo === 'sprint'),
})

await verificar({
  titulo: 'resumen mas largo que el maximo (200)',
  method: 'POST',
  ruta: '/tareas',
  body: { ...tareaValida, resumen: 'x'.repeat(300) },
  esperado: 400,
  chequeo: (d) => d.detalles.some((x) => x.campo === 'resumen'),
})

await verificar({
  titulo: 'body con JSON sintacticamente invalido',
  method: 'POST',
  ruta: '/tareas',
  body: 'esto no es un objeto',
  esperado: 400,
  chequeo: (d) => d.error === 'JSON invalido en el body',
})

await verificar({
  titulo: 'editar una tarea inexistente',
  method: 'PUT',
  ruta: '/tareas/999999',
  body: tareaEditada,
  esperado: 404,
  chequeo: (d) => d.error === 'Tarea no encontrada',
})

await verificar({
  titulo: 'obtener una tarea inexistente',
  method: 'GET',
  ruta: '/tareas/999999',
  esperado: 404,
  chequeo: (d) => d.error === 'Tarea no encontrada',
})

await verificar({
  titulo: 'eliminar una tarea inexistente',
  method: 'DELETE',
  ruta: '/tareas/999999',
  esperado: 404,
  chequeo: (d) => d.error === 'Tarea no encontrada',
})

await verificar({
  titulo: 'finalizar una tarea ya finalizada',
  method: 'PATCH',
  ruta: `/tareas/${nuevoId}/finalizar`,
  esperado: 404,
  chequeo: (d) => d.error.includes('ya finalizada'),
})

await verificar({
  titulo: 'id no numerico',
  method: 'GET',
  ruta: '/tareas/abc',
  esperado: 400,
  chequeo: (d) => d.error === 'Identificador con formato invalido',
})

await verificar({
  titulo: 'ruta inexistente',
  method: 'GET',
  ruta: '/no-existe',
  esperado: 404,
  chequeo: (d) => d.error === 'Ruta no encontrada',
})

console.log('')
console.log('='.repeat(70))
console.log(`RESULTADO: ${ok} pasaron, ${fallos} fallaron`)
console.log('='.repeat(70))

process.exit(fallos === 0 ? 0 : 1)
