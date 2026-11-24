import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { BrandLogo } from '../../components/BrandLogo'
import { Button, Input, Skeleton, Toast, type ToastVariant } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../../lib/validators'
import { resetPasswordForEmail, signIn } from '../../services/auth'
import { isSupabaseConfigured } from '../../services/supabase'

interface ToastMessage {
  message: string
  variant: ToastVariant
}

export default function Login() {
  const navigate = useNavigate()
  const { isLoading: isAuthLoading, user } = useAuth()
  const [isResetting, setIsResetting] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const {
    getValues,
    handleSubmit,
    register,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthLoading, navigate, user])

  const onSubmit = async (values: LoginFormValues) => {
    setToast(null)

    try {
      await signIn(values)
      navigate('/admin', { replace: true })
    } catch {
      setToast({
        variant: 'error',
        message: 'Las credenciales no son válidas. Revisa tu email y contraseña.',
      })
    }
  }

  const handlePasswordReset = async () => {
    const isEmailValid = await trigger('email')

    if (!isEmailValid) {
      return
    }

    setIsResetting(true)
    setToast(null)

    try {
      await resetPasswordForEmail(getValues('email'), `${window.location.origin}/admin/reset-password`)
      setToast({
        variant: 'success',
        message: 'Te enviamos un enlace para restablecer tu contraseña.',
      })
    } catch {
      setToast({
        variant: 'error',
        message: 'No pudimos enviar el enlace de recuperación. Inténtalo nuevamente.',
      })
    } finally {
      setIsResetting(false)
    }
  }

  if (isAuthLoading || user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-fondo-claro px-4" role="status">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="mx-auto h-5 w-48" />
          <Skeleton className="h-64 w-full" variant="rectangular" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-fondo-claro px-4 py-10">
      <section className="w-full max-w-md rounded-xl border border-marino/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <Link
            className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta"
            to="/"
          >
            <BrandLogo className="h-24 w-auto sm:h-28" />
          </Link>
          <h1 className="mt-7 text-3xl font-extrabold text-marino">Acceso administrativo</h1>
          <p className="mt-2 text-sm leading-6 text-marino/65">Ingresa para gestionar prospectos y seguimiento comercial.</p>
        </div>

        {!isSupabaseConfigured ? (
          <p className="mt-6 rounded-lg border border-violeta/20 bg-violeta/10 px-3 py-2 text-sm leading-6 text-marino" role="status">
            Configura Supabase para habilitar el acceso administrativo.
          </p>
        ) : null}

        <form className="mt-7 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Input
            required
            autoComplete="email"
            error={errors.email?.message}
            label="Correo electrónico"
            placeholder="nombre@empresa.com"
            type="email"
            {...register('email')}
          />
          <Input
            required
            autoComplete="current-password"
            error={errors.password?.message}
            label="Contraseña"
            type="password"
            {...register('password')}
          />
          <div className="flex justify-end">
            <button
              className="text-sm font-bold text-violeta transition hover:text-marino focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta"
              disabled={!isSupabaseConfigured || isResetting}
              type="button"
              onClick={() => void handlePasswordReset()}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <Button className="w-full" disabled={!isSupabaseConfigured || isSubmitting} loading={isSubmitting} type="submit">
            Ingresar al panel
          </Button>
        </form>
      </section>

      {toast ? <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} /> : null}
    </main>
  )
}
