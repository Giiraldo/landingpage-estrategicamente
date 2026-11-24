# ESTRATEGICAMENTE Leads

[Español](README.md) · [English](README.en.md)

Landing page para presentar servicios y captar prospectos, junto con un panel administrativo para gestionar leads, estados y notas.

> Proyecto individual desarrollado durante mi formación en desarrollo web en [TripleTen](https://tripleten.com/).

**Demo pública:** no disponible actualmente.

## Funcionalidades

- Landing responsive con presentación de servicios y formulario de cotización.
- Panel administrativo con inicio de sesión, dashboard y gestión de prospectos.
- Búsqueda de leads, actualización de estados y registro de notas.
- Roles `admin` y `viewer` para controlar el acceso al panel.
- Recuperación de contraseña por correo.
- Notificación opcional de nuevos leads por correo mediante Supabase Edge Functions y Resend.
- Interfaz con formularios validados, estados de carga y mensajes de resultado.

## Tecnologías

- React 18, TypeScript y Vite
- Tailwind CSS
- Supabase Auth y PostgreSQL
- Row Level Security (RLS)
- TanStack Query
- React Hook Form y Zod
- Supabase Edge Functions y Resend para notificaciones

## Seguridad y acceso a datos

Las migraciones de Supabase definen políticas RLS para limitar el acceso según el rol y el usuario autenticado:

| Recurso | Acceso público (`anon`) | Usuario autenticado |
| --- | --- | --- |
| `leads` | Puede insertar los campos permitidos por el formulario; no puede leer ni modificar leads | Solo `admin` puede leer y gestionar leads |
| `profiles` | Sin acceso | Cada usuario puede leer su propio perfil |
| `lead_activities` | Sin acceso | Solo `admin`, con actividad asociada a su usuario |
| `services` | Puede leer servicios activos | Puede leer servicios activos; `admin` también puede leer todos |

El alta pública no devuelve la fila insertada ni concede acceso de lectura anónimo a los leads. Las notificaciones se procesan en una Edge Function protegida por un secreto que se configura en Supabase, nunca en el navegador.

## Requisitos

- Node.js 20 o superior
- npm
- Un proyecto de Supabase con Email/Password habilitado
- Supabase CLI para aplicar migraciones y desplegar funciones

## Desarrollo local

1. Instala las dependencias y copia el archivo de variables de entorno:

```powershell
npm install
Copy-Item .env.example .env
```

En macOS o Linux, usa `cp .env.example .env` en lugar de `Copy-Item`.

2. Configura `.env` con la URL y la clave pública de tu proyecto Supabase:

```dotenv
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

Las variables `VITE_*` forman parte del bundle público del navegador. No pongas claves `service_role`, secretos de Resend ni `LEAD_WEBHOOK_SECRET` en `.env`.

3. Enlaza Supabase y aplica las migraciones desde la raíz del proyecto:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Los servicios de ejemplo son opcionales; puedes cargarlos ejecutando `supabase/seed.sql` en el SQL Editor después de aplicar las migraciones.

4. Inicia la aplicación:

```bash
npm run dev
```

## Crear el primer administrador

Crea el usuario desde Supabase Auth. El trigger asigna inicialmente el rol `viewer`; promuévelo manualmente desde el SQL Editor:

```sql
update public.profiles
set role = 'admin'
from auth.users
where public.profiles.id = auth.users.id
  and lower(auth.users.email) = lower('admin@tu-dominio.com');
```

El panel está pensado para usuarios administrativos creados manualmente; no habilites un registro público para el panel.

## Recuperación de contraseña

En **Authentication > URL Configuration** de Supabase, configura:

- **Site URL:** `https://<tu-dominio>`
- **Redirect URL:** `https://<tu-dominio>/admin/reset-password`
- **Desarrollo local:** `http://localhost:5173/admin/reset-password`

## Notificaciones de nuevos leads (opcional)

La función `supabase/functions/notify-new-lead` envía notificaciones con Resend. Configura estos secretos en Supabase Functions, no en el frontend:

```bash
supabase secrets set RESEND_API_KEY=<value>
supabase secrets set RESEND_FROM_EMAIL=<verified-sender>
supabase secrets set LEAD_NOTIFICATION_EMAIL=<recipient>
supabase secrets set LEAD_WEBHOOK_SECRET=<long-random-secret>
```

Despliega la función y configura un Database Webhook para `INSERT` en `public.leads`, enviando `x-webhook-secret` con el valor de `LEAD_WEBHOOK_SECRET`. Verifica el remitente en Resend antes de activar las notificaciones.

## Comandos

```bash
npm run dev    # servidor de desarrollo
npm run lint   # análisis estático con oxlint
npm run build  # comprobación de TypeScript y build de producción
npm run preview # previsualización del build
```

El build de producción se genera en `dist`.

## Despliegue

El proyecto incluye instrucciones de despliegue para Cloudflare Pages. La demo pública todavía no está disponible.

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js:** 20 o superior

Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el entorno de build. `public/_redirects` permite resolver las rutas de la SPA y `public/_headers` define encabezados y caché para los recursos estáticos.

Para producción, configura controles contra abuso en el endpoint que recibe los leads. RLS protege los datos, pero por sí sola no sustituye la limitación de tasa o un CAPTCHA.

## Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Landing page |
| `/servicios` | Servicios públicos |
| `/cotizacion` | Formulario de captación |
| `/admin/login` | Acceso administrativo |
| `/admin/reset-password` | Recuperación de contraseña |
| `/admin` | Dashboard protegido por rol |
| `/admin/leads` | Gestión de prospectos, estados y notas |

## Autor

Jerson Foronda · [GitHub](https://github.com/Giiraldo) · [LinkedIn](https://www.linkedin.com/in/jerson-foronda-giraldo/)
