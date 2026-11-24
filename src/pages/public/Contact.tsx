import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, CheckCircle2, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import { Button, Card, Input, Select, Textarea, Toast, type ToastVariant } from '../../components/ui'
import { useCreateLead } from '../../hooks/useLeads'
import { useServices } from '../../hooks/useServices'
import { publicServices, whatsappQuoteUrl } from '../../lib/offerings'
import { quoteSchema, type QuoteFormValues } from '../../lib/validators'
import { isSupabaseConfigured } from '../../services/supabase'

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error'

interface ToastMessage {
  message: string
  variant: ToastVariant
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const initialService = searchParams.get('service') ?? ''
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle')
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const createLeadMutation = useCreateLead()
  const {
    data: databaseServices = [],
    isError: isServicesError,
    isLoading: isServicesLoading,
  } = useServices()
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      company: '',
      service_interest: initialService,
      message: '',
    },
  })

  const services = databaseServices.length > 0 ? databaseServices : publicServices
  const serviceOptions = services.map((service) => ({ value: service.name, label: service.name }))

  if (initialService && !serviceOptions.some((service) => service.value === initialService)) {
    serviceOptions.push({ value: initialService, label: initialService })
  }

  const onSubmit = async (values: QuoteFormValues) => {
    setSubmissionState('submitting')
    setToast(null)

    try {
      await createLeadMutation.mutateAsync({
        ...values,
        company: values.company || undefined,
        service_interest: values.service_interest || undefined,
        message: values.message || undefined,
      })
      reset({
        full_name: '',
        email: '',
        phone: '',
        company: '',
        service_interest: '',
        message: '',
      })
      setSubmissionState('success')
      setToast({
        variant: 'success',
        message: 'Recibimos tu solicitud. Te contactaremos pronto.',
      })
    } catch {
      setSubmissionState('error')
      setToast({
        variant: 'error',
        message: 'No pudimos enviar la solicitud. Inténtalo nuevamente o escríbenos por WhatsApp.',
      })
    }
  }

  const isSubmitting = submissionState === 'submitting'
  const serviceHelperText = isServicesError
    ? 'No pudimos actualizar los servicios. Puedes seleccionar una solución base.'
    : isServicesLoading
      ? 'Cargando servicios disponibles...'
      : 'Selecciona la solución que más se acerca a tu necesidad.'

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="lg:pt-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-violeta">Cotización</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-marino sm:text-5xl">
            Conversemos sobre el próximo movimiento de tu empresa.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-marino/65">
            Comparte el contexto de tu reto. Prepararemos una respuesta enfocada en las oportunidades que pueden mover el negocio.
          </p>

          <Card className="mt-8" variant="outlined">
            <MessageCircle aria-hidden="true" className="size-7 text-violeta" />
            <h2 className="mt-4 text-lg font-extrabold text-marino">¿Prefieres escribirnos?</h2>
            <p className="mt-2 text-sm leading-6 text-marino/65">
              También puedes iniciar una conversación por WhatsApp con un mensaje ya preparado.
            </p>
            <a
              className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-violeta transition hover:text-marino focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta"
              href={whatsappQuoteUrl}
              rel="noreferrer"
              target="_blank"
            >
              Escribir por WhatsApp
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </Card>
        </div>

        <Card padding="lg" variant="elevated">
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                required
                autoComplete="name"
                error={errors.full_name?.message}
                label="Nombre"
                placeholder="Tu nombre"
                {...register('full_name')}
              />
              <Input
                required
                autoComplete="email"
                error={errors.email?.message}
                label="Email"
                placeholder="nombre@empresa.com"
                type="email"
                {...register('email')}
              />
              <Input
                required
                autoComplete="tel"
                error={errors.phone?.message}
                label="Teléfono"
                placeholder="Tu número de contacto"
                type="tel"
                {...register('phone')}
              />
              <Input
                autoComplete="organization"
                error={errors.company?.message}
                label="Empresa"
                placeholder="Nombre de tu empresa"
                {...register('company')}
              />
            </div>

            <div className="mt-5">
              <Select
                error={errors.service_interest?.message}
                helperText={serviceHelperText}
                label="Servicio de interés"
                options={serviceOptions}
                placeholder="Selecciona un servicio"
                {...register('service_interest')}
              />
            </div>

            <div className="mt-5">
              <Textarea
                error={errors.message?.message}
                label="Mensaje"
                placeholder="Cuéntanos brevemente qué quieres lograr."
                rows={5}
                {...register('message')}
              />
            </div>

            {!isSupabaseConfigured ? (
              <p className="mt-5 rounded-lg border border-violeta/20 bg-violeta/10 px-3 py-2 text-sm leading-6 text-marino" role="status">
                Conecta Supabase para habilitar el envío de solicitudes desde este formulario.
              </p>
            ) : null}

            {submissionState === 'success' ? (
              <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-marino" role="status">
                <CheckCircle2 aria-hidden="true" className="size-5 text-azul" />
                Solicitud enviada correctamente.
              </p>
            ) : null}
            {submissionState === 'error' ? (
              <p className="mt-5 text-sm font-semibold text-red-700" role="alert">
                No fue posible enviar la solicitud. Revisa tu conexión e inténtalo otra vez.
              </p>
            ) : null}

            <Button
              className="mt-7 w-full sm:w-auto"
              disabled={!isSupabaseConfigured || isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              <Send aria-hidden="true" className="size-4" />
              Enviar solicitud
            </Button>
          </form>
        </Card>
      </div>

      {toast ? <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} /> : null}
    </section>
  )
}
