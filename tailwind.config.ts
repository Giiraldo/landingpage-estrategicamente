import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        marino: '#102E4A',
        violeta: '#715AFF',
        lavanda: '#A682FF',
        azul: '#5887FF',
        celeste: '#55C1FF',
        'fondo-claro': '#F8F9FC',
      },
    },
  },
  plugins: [],
} satisfies Config
