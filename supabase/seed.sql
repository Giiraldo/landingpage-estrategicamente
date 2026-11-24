insert into public.services (id, name, description, sort_order)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Diagnostico estrategico',
    'Analisis de la situacion actual para identificar oportunidades, prioridades y puntos de mejora.',
    1
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Planificacion estrategica',
    'Diseno de una hoja de ruta accionable con objetivos, indicadores y responsables claros.',
    2
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'Acompanamiento de implementacion',
    'Seguimiento para convertir la estrategia en resultados sostenibles para el negocio.',
    3
  )
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;
