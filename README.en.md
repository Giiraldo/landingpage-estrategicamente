# ESTRATEGICAMENTE Leads

[Español](README.md) · [English](README.en.md)

A marketing landing page for presenting services and collecting prospects, paired with an admin dashboard for managing leads, statuses, and notes.

> Individual project completed as part of my web development training at [TripleTen](https://tripleten.com/).

**Public demo:** not currently available.

## Features

- Responsive landing page with service information and a quote request form.
- Admin panel with sign-in, dashboard, and lead management.
- Lead search, status updates, and activity notes.
- `admin` and `viewer` roles to control access to the panel.
- Email-based password recovery.
- Optional new-lead email notifications using Supabase Edge Functions and Resend.
- Validated forms, loading states, and clear result messages.

## Technologies

- React 18, TypeScript, and Vite
- Tailwind CSS
- Supabase Auth and PostgreSQL
- Row Level Security (RLS)
- TanStack Query
- React Hook Form and Zod
- Supabase Edge Functions and Resend for notifications

## Security and data access

Supabase migrations define RLS policies that restrict access based on the user's role and authentication state:

| Resource | Public (`anon`) access | Authenticated access |
| --- | --- | --- |
| `leads` | Can insert the fields allowed by the public form; cannot read or modify leads | Only `admin` can read and manage leads |
| `profiles` | No access | Each user can read their own profile |
| `lead_activities` | No access | `admin` only, with activity associated with their user |
| `services` | Can read active services | Can read active services; `admin` can also read all services |

Public lead submissions do not return the inserted row or grant anonymous read access to leads. Notifications are handled by an Edge Function protected by a secret configured in Supabase, never in the browser.

## Requirements

- Node.js 20 or later
- npm
- A Supabase project with Email/Password authentication enabled
- Supabase CLI to apply migrations and deploy functions

## Local development

1. Install dependencies and copy the environment template:

```powershell
npm install
Copy-Item .env.example .env
```

On macOS or Linux, use `cp .env.example .env` instead of `Copy-Item`.

2. Configure `.env` with your Supabase project URL and public key:

```dotenv
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

`VITE_*` variables are included in the public browser bundle. Never put a `service_role` key, Resend secrets, or `LEAD_WEBHOOK_SECRET` in this file.

3. Link Supabase and apply the migrations from the project root:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Sample services are optional. You can load them by running `supabase/seed.sql` in the SQL Editor after applying the migrations.

4. Start the app:

```bash
npm run dev
```

## Create the first admin

Create the user in Supabase Auth. The trigger initially assigns the `viewer` role; promote the user manually in the SQL Editor:

```sql
update public.profiles
set role = 'admin'
from auth.users
where public.profiles.id = auth.users.id
  and lower(auth.users.email) = lower('admin@example.com');
```

The admin panel is intended for manually created users; do not enable public sign-up for the panel.

## Password recovery

In Supabase **Authentication > URL Configuration**, set:

- **Site URL:** `https://<your-domain>`
- **Redirect URL:** `https://<your-domain>/admin/reset-password`
- **Local development:** `http://localhost:5173/admin/reset-password`

## New-lead notifications (optional)

The `supabase/functions/notify-new-lead` function sends notifications through Resend. Configure these secrets in Supabase Functions, not in the frontend:

```bash
supabase secrets set RESEND_API_KEY=<value>
supabase secrets set RESEND_FROM_EMAIL=<verified-sender>
supabase secrets set LEAD_NOTIFICATION_EMAIL=<recipient>
supabase secrets set LEAD_WEBHOOK_SECRET=<long-random-secret>
```

Deploy the function and configure a Database Webhook for `INSERT` events on `public.leads`, sending `x-webhook-secret` with the `LEAD_WEBHOOK_SECRET` value. Verify the sender in Resend before enabling notifications.

## Commands

```bash
npm run dev     # development server
npm run lint    # static analysis with oxlint
npm run build   # TypeScript check and production build
npm run preview # preview the production build
```

The production build is generated in `dist`.

## Deployment

The project includes deployment instructions for Cloudflare Pages. A public demo is not currently available.

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node.js:** 20 or later

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the build environment. `public/_redirects` supports SPA routes, and `public/_headers` defines security headers and caching for static assets.

For production, configure abuse controls at the endpoint that receives leads. RLS protects data, but does not replace rate limiting or a CAPTCHA.

## Main routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/servicios` | Public services |
| `/cotizacion` | Lead capture form |
| `/admin/login` | Admin sign-in |
| `/admin/reset-password` | Password recovery |
| `/admin` | Role-protected dashboard |
| `/admin/leads` | Lead, status, and notes management |

## Author

Jerson Foronda · [GitHub](https://github.com/Giiraldo) · [LinkedIn](https://www.linkedin.com/in/jerson-foronda-giraldo/)
