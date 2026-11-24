import { z } from 'zod'

import { LEAD_PRIORITIES, LEAD_STATUSES } from './constants'

export const loginSchema = z.object({
  email: z.string().trim().email('Ingresa un correo valido.'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const passwordResetSchema = z
  .object({
    password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.').max(72),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contrasenas no coinciden.',
    path: ['confirmPassword'],
  })

export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>

export const leadSchema = z.object({
  full_name: z.string().trim().min(2, 'Ingresa el nombre del lead.').max(120),
  email: z.string().trim().email('Ingresa un correo valido.'),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(120).optional(),
  service_interest: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2_000).optional(),
  source: z.string().trim().max(100).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  priority: z.enum(LEAD_PRIORITIES).optional(),
  notes: z.string().trim().max(2_000).optional(),
  assigned_to: z.string().uuid().optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>

export const quoteSchema = z.object({
  full_name: z.string().trim().min(2, 'Ingresa tu nombre.').max(120),
  email: z.string().trim().email('Ingresa un correo valido.'),
  phone: z.string().trim().min(7, 'Ingresa un telefono valido.').max(30),
  company: z.string().trim().max(120).optional(),
  service_interest: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2_000).optional(),
})

export type QuoteFormValues = z.infer<typeof quoteSchema>
