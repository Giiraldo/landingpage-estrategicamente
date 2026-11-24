import { Code2, Megaphone, Workflow } from 'lucide-react'

export const publicServices = [
  {
    name: 'Desarrollo digital',
    description: 'Sitios, productos y experiencias digitales que convierten una visión de negocio en una presencia medible.',
    benefits: ['Sitios web de alto rendimiento', 'Productos digitales escalables', 'Experiencias centradas en conversión'],
    icon: Code2,
  },
  {
    name: 'Captación y automatización',
    description: 'Sistemas conectados para atraer, calificar y acompañar oportunidades sin perder el contexto comercial.',
    benefits: ['Embudo de captación claro', 'Automatizaciones de seguimiento', 'CRM y datos conectados'],
    icon: Workflow,
  },
  {
    name: 'Marketing estratégico',
    description: 'Posicionamiento, mensajes y campañas diseñados para llegar a las audiencias que sí mueven tu negocio.',
    benefits: ['Propuesta de valor diferenciada', 'Campañas orientadas a objetivos', 'Aprendizaje continuo de mercado'],
    icon: Megaphone,
  },
] as const

export const whatsappQuoteUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
  'Hola, quiero solicitar una cotización para mi empresa.',
)}`
