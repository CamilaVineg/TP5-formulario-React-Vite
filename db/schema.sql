CREATE TABLE IF NOT EXISTS tareas (
  id               SERIAL PRIMARY KEY,
  nombre_proyecto  VARCHAR(120) NOT NULL,
  tipo_actividad   VARCHAR(40)  NOT NULL,
  estado           VARCHAR(20)  NOT NULL DEFAULT 'Pendiente',
  resumen          VARCHAR(200) NOT NULL,
  descripcion      TEXT         NOT NULL,
  prioridad        VARCHAR(20)  NOT NULL,
  informador       VARCHAR(120) NOT NULL,
  persona_asignada VARCHAR(120) NOT NULL,
  precondicion     TEXT         NOT NULL,
  fecha_creacion   DATE         NOT NULL,
  fecha_cierre     DATE,
  sprint           VARCHAR(40)  NOT NULL,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT tareas_tipo_actividad_chk
    CHECK (tipo_actividad IN ('Desarrollo', 'Testing', 'Diseño', 'Deploy', 'Soporte')),
  CONSTRAINT tareas_estado_chk
    CHECK (estado IN ('Pendiente', 'En Progreso', 'Finalizada')),
  CONSTRAINT tareas_prioridad_chk
    CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Crítica'))
);

CREATE INDEX IF NOT EXISTS idx_tareas_estado  ON tareas (estado);
CREATE INDEX IF NOT EXISTS idx_tareas_proyecto ON tareas (nombre_proyecto);
