import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { Cadastro } from '@/pages/Cadastro'
import { Dashboard } from '@/pages/Dashboard'
import { NotFound } from '@/pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'sobre', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
