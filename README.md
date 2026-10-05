# TP5 — Formulario React con Vite

Manejador de tareas de proyectos de software. Aplicación web con frontend React,
backend Express y base de datos PostgreSQL, los tres dentro de Docker.

## Requerimientos del TP y dónde se cumplen

| Requerimiento | Dónde |
|---|---|
| Formulario en React con Vite | `frontend/src/components/TareaForm.jsx` |
| Lógica de negocio: manejador de tareas | `frontend/src/hooks/useTareas.js`, `backend/src/services/` |
| 12 campos requeridos | `db/schema.sql`, `backend/src/schemas/tarea.schema.js` |
| Componente "Listado de Tareas" | `frontend/src/components/ListadoTareas.jsx` |
| Editar, eliminar y finalizar | `PUT`, `DELETE`, `PATCH /:id/finalizar` |
| Persistencia en SQL/PostgreSQL | `db/schema.sql` + volumen `pgdata` |
| Frontend y backend en Docker | `frontend/Dockerfile`, `backend/Dockerfile`, `compose.yaml` |

## Arquitectura

```
Navegador → :8080 (nginx, imagen frontend)
              └─ /api/* → proxy inverso → :3000 (Express, imagen backend)
                                              └─ pg → db:5432 (PostgreSQL)
```

El navegador siempre habla con un solo origen (`:8080`). Nginx hace de proxy
inverso de `/api`, por eso **no hay CORS** en producción y las URLs de la API
no están hardcodeadas en el frontend.

## Levantar el proyecto

```bash
cp .env.example .env
docker compose up -d --build
```

| Servicio | URL |
|---|---|
| Aplicación web | http://localhost:8080 |
| API directa | http://localhost:3000/api |
| PostgreSQL | localhost:5433 |

Cargar datos de ejemplo (solo la primera vez, o tras `docker compose down -v`):

```bash
docker cp db/seed.sql <contenedor-db>:/tmp/seed.sql
docker compose exec -T db psql -U admin -d tareas -f /tmp/seed.sql
```

Comandos útiles:

```bash
docker compose ps                              # estado
docker compose logs -f backend                 # logs del backend
docker compose exec db psql -U admin -d tareas # consola SQL
docker compose down                            # detiene, conserva los datos
docker compose down -v                         # detiene y borra los datos
```

## Desarrollo sin Docker (opcional)

Requiere un PostgreSQL local en el puerto 5433.

```bash
# base de datos
docker run -d --name tp5-db -e POSTGRES_DB=tareas -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 -p 5433:5432 \
  -v pgdata:/var/lib/postgresql/data postgres:16-alpine

# backend
cd backend && npm install && npm run dev

# frontend (otra terminal)
cd frontend && npm install && npm run dev
```

En desarrollo, `vite.config.js` proxea `/api` a `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica API y base de datos |
| GET | `/api/tareas` | Lista todas. Filtros: `?estado=`, `?proyecto=` |
| GET | `/api/tareas/resumen` | Totales y cantidad finalizadas |
| GET | `/api/tareas/:id` | Obtiene una tarea |
| POST | `/api/tareas` | Crea una tarea |
| PUT | `/api/tareas/:id` | Actualiza una tarea |
| PATCH | `/api/tareas/:id/finalizar` | Marca `Finalizada` y asigna `fecha_cierre` |
| DELETE | `/api/tareas/:id` | Elimina una tarea |

## Pruebas

```bash
cd backend
npm test                                  # contra localhost:3000
BASE_URL=http://localhost:8080/api npm test   # a través de nginx
```

`test/api.test.js` cubre 24 casos: 11 correctos y 13 de error. No requiere
librerías externas, usa el `fetch` nativo de Node.

## Decisiones de diseño

**Validación en dos capas.** Zod valida en el servidor y las restricciones
`CHECK` en PostgreSQL. La validación del cliente es solo UX: la regla real
siempre se aplica en el backend y en la base.

**Consultas parametrizadas.** Todas las queries usan `$1, $2`, nunca
interpolación de strings. Es lo que evita inyección SQL.

**El Pool no se conecta al importar.** `src/db/pool.js` solo crea el Pool; cada
`pool.query()` toma una conexión prestada y la devuelve. Conectarse al importar
y olvidar cerrar agota el pool.

**`finalizar` no recibe datos.** Es la regla de negocio central: el endpoint
pone `estado = 'Finalizada'` y `fecha_cierre = CURRENT_DATE` juntos. El cliente
no puede desincronizar esos dos valores. Además ignora tareas ya finalizadas
para no pisa la fecha de cierre original.

**Códigos de error de Postgres traducidos.** `23514` (CHECK), `23505`
(duplicado), `22P02` (id inválido) se convierten en respuestas 4xx con un
mensaje útil en lugar de un 500 genérico.

**`key` en lugar de `useEffect` para resetear el formulario.** Al editar una
tarea distinta, React remonta `TareaForm` mediante `key`, en vez de
sincronizar estado con un efecto.

**Reinicio idempotente del esquema.** `schema.sql` usa `IF NOT EXISTS`, así que
aplicarlo sobre una base existente no rompe nada.

## Estructura

```
.
├── compose.yaml
├── .env.example
├── db/
│   ├── schema.sql            # tabla, CHECK constraints, índices
│   └── seed.sql              # datos de ejemplo
├── backend/
│   ├── Dockerfile
│   ├── test/api.test.js
│   └── src/
│       ├── server.js         # arranque y apagado limpio
│       ├── app.js            # middleware y montaje de rutas
│       ├── db/
│       │   ├── pool.js
│       │   └── migrate.js    # aplica schema.sql
│       ├── routes/
│       ├── controllers/
│       ├── services/         # queries SQL
│       ├── schemas/          # validación Zod
│       └── middlewares/
└── frontend/
    ├── Dockerfile            # multi-stage: build → nginx
    ├── nginx.conf
    └── src/
        ├── api/client.js
        ├── hooks/useTareas.js
        ├── constants/tarea.js
        └── components/
```

## Stack

React 19 · Vite 8 · Express 5 · PostgreSQL 16 · Zod 4 · oxlint · Docker Compose
