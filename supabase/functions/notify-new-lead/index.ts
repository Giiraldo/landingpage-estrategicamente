interface LeadRecord {
  full_name?: unknown
  email?: unknown
  phone?: unknown
  company?: unknown
  service_interest?: unknown
  message?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readText(record: LeadRecord, key: keyof LeadRecord, fallback = 'No especificado'): string {
  const value = record[key]

  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const webhookSecret = Deno.env.get('LEAD_WEBHOOK_SECRET')

  if (!webhookSecret || request.headers.get('x-webhook-secret') !== webhookSecret) {
    return new Response('Unauthorized', { status: 401 })
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('RESEND_FROM_EMAIL')
  const recipient = Deno.env.get('LEAD_NOTIFICATION_EMAIL')

  if (!resendApiKey || !from || !recipient) {
    console.error('Lead notification secrets are not configured.')
    return new Response('Notification service is not configured', { status: 503 })
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return new Response('Invalid JSON payload', { status: 400 })
  }

  const record = isRecord(payload) && isRecord(payload.record) ? payload.record : payload

  if (!isRecord(record)) {
    return new Response('Lead record is required', { status: 400 })
  }

  const lead: LeadRecord = record
  const fullName = readText(lead, 'full_name', 'Prospecto sin nombre')
  const email = readText(lead, 'email')
  const phone = readText(lead, 'phone')
  const company = readText(lead, 'company')
  const serviceInterest = readText(lead, 'service_interest')
  const message = readText(lead, 'message', 'Sin mensaje adicional')
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      subject: `Nuevo prospecto: ${fullName}`,
      text: [
        `Nombre: ${fullName}`,
        `Email: ${email}`,
        `Teléfono: ${phone}`,
        `Empresa: ${company}`,
        `Servicio: ${serviceInterest}`,
        '',
        'Mensaje:',
        message,
      ].join('\n'),
    }),
  })

  if (!emailResponse.ok) {
    console.error('Resend rejected the lead notification.', await emailResponse.text())
    return new Response('Unable to send notification', { status: 502 })
  }

  return Response.json({ delivered: true }, { status: 202 })
})
