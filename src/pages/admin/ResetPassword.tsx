import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { BrandLogo } from '../../components/BrandLogo'
import { Button, Input, Skeleton } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { passwordResetSchema, type PasswordResetFormValues } from '../../lib/validators'
import { updatePassword } from '../../services/auth'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { isConfigured, isLoading, user } = useAuth()
  const [isComplete, setIsComplete] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async ({ password }: PasswordResetFormValues) => {
    setSubmitError(null)

    try {
      await updatePassword(password)
      setIsComplete(true)
    } catch {
      setSubmitError('No pudimos actualizar la contrasena. Solicita un nuevo enlace e intentalo nuevamente.')
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-fondo-claro px-4" role="status">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="mx-auto h-5 w-48" />
          <Skeleton className="h-64 w-full" variant="rectangular" />
        </div>
      </main>
    )
  }

  if (!isConfigured || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-fondo-claro px-4 py-10">
        <section className="w-full max-w-md rounded-xl border border-marino/10 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto inline-flex rounded-full bg-violeta/10 p-3 text-violeta">
            <KeyRound aria-hidden="true" className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-marino">Enlace no disponible</h1>
          <p className="mt-3 text-sm leading-6 text-marino/65">
            Solicita un nuevo enlace de recuperacion. Verifica tambien que Supabase permita esta URL de redireccionamiento.
          </p>
          <Link
            className="mt-6 inline-flex rounded-lg bg-marino px-4 py-2 text-sm font-extrabold text-white transition hover:bg-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta"
            to="/admin/login"
          >
            Volver al acceso
          </Link>
        </section>
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
            <BrandLogo className="h-20 w-auto sm:h-24" />
          </Link>
          <div className="mx-auto mt-6 inline-flex rounded-full bg-violeta/10 p-3 text-violeta">
            <KeyRound aria-hidden="true" className="size-6" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold text-marino">Define una nueva contrasena</h1>
          <p className="mt-2 text-sm leading-6 text-marino/65">Usa al menos 8 caracteres para proteger el acceso administrativo.</p>
        </div>

        {isComplete ? (
          <div className="mt-7 text-center">
            <CheckCircle2 aria-hidden="true" className="mx-auto size-8 text-azul" />
            <p className="mt-3 text-sm leading-6 text-marino/70">Tu contrasena fue actualizada correctamente.</p>
            <Button className="mt-6 w-full" onClick={() => navigate('/admin', { replace: true })}>
              Continuar al panel
            </Button>
          </div>
        ) : (
          <form className="mt-7 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Input
              required
              autoComplete="new-password"
              error={errors.password?.message}
              label="Nueva contrasena"
              type="password"
              {...register('password')}
            />
            <Input
              required
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              label="Confirmar contrasena"
              type="password"
              {...register('confirmPassword')}
            />
            {submitError ? (
              <p className="text-sm font-semibold text-red-700" role="alert">
                {submitError}
              </p>
            ) : null}
            <Button className="w-full" loading={isSubmitting} type="submit">
              Actualizar contrasena
            </Button>
          </form>
        )}
      </section>
    </main>
  )
}
