import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { PublicLayout } from '../components/layout/PublicLayout'
import NotFound from '../pages/NotFound'
import Home from '../pages/public/Home'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'servicios',
        lazy: async () => {
          const { default: Component } = await import('../pages/public/Services')
          return { Component }
        },
      },
      {
        path: 'cotizacion',
        lazy: async () => {
          const { default: Component } = await import('../pages/public/Contact')
          return { Component }
        },
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: 'admin/login',
    lazy: async () => {
      const { default: Component } = await import('../pages/admin/Login')
      return { Component }
    },
  },
  {
    path: 'admin/reset-password',
    lazy: async () => {
      const { default: Component } = await import('../pages/admin/ResetPassword')
      return { Component }
    },
  },
  {
    lazy: async () => {
      const { AdminRoute: Component } = await import('../components/layout/AdminRoute')
      return { Component }
    },
    children: [
      {
        path: 'admin',
        lazy: async () => {
          const { AdminLayout: Component } = await import('../components/layout/AdminLayout')
          return { Component }
        },
        children: [
          {
            index: true,
            lazy: async () => {
              const { default: Component } = await import('../pages/admin/Dashboard')
              return { Component }
            },
          },
          {
            path: 'leads',
            lazy: async () => {
              const { default: Component } = await import('../pages/admin/Leads')
              return { Component }
            },
          },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
