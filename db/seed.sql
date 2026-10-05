INSERT INTO tareas
  (nombre_proyecto, tipo_actividad, estado, resumen, descripcion, prioridad,
   informador, persona_asignada, precondicion, fecha_creacion, sprint)
VALUES
  ('Migración ERP', 'Desarrollo', 'En Progreso',
   'Migrar módulo de facturación a PostgreSQL',
   'Reescribir las consultas del módulo de facturación para que funcionen sobre el esquema nuevo.',
   'Alta', 'Carla Méndez', 'Vine',
   'Acceso a la base de datos vieja y backup verificado',
   CURRENT_DATE, 'Sprint 7'),

  ('Portal de clientes', 'Diseño', 'Pendiente',
   'Rediseñar la pantalla de login',
   'Maquetación de la nueva pantalla de acceso con validación de errores en vivo.',
   'Media', 'Diego Sosa', 'Ana Ruiz',
   'Definición de los colores de la marca',
   CURRENT_DATE - 3, 'Sprint 7'),

  ('Suite de tests', 'Testing', 'Finalizada',
   'Cubrir endpoints de tareas',
   'Casos de prueba CRUD sobre la API de tareas, incluyendo validaciones.',
   'Baja', 'Carla Méndez', 'Bruno Díaz',
   'API desplegada en staging',
   CURRENT_DATE - 20, 'Sprint 6'),

  ('Deploy mensual', 'Deploy', 'Pendiente',
   'Publicar versión 2.3.0',
   'Ejecutar el pipeline de publicación y verificar el smoke test en producción.',
   'Crítica', 'Diego Sosa', 'Vine',
   'Versionado en el CHANGELOG y aprobación del release',
   CURRENT_DATE, 'Sprint 8'),

  ('Soporte N1', 'Soporte', 'Pendiente',
   'Atender tickets de usuarios',
   'Primera línea de soporte: clasificar y escalar tickets.',
   'Media', 'Ana Ruiz', 'Bruno Díaz',
   'Acceso al panel de tickets',
   CURRENT_DATE, 'Sprint 8');
