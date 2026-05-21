import { createHashRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { Cadastro } from '@/pages/Cadastro'
import { Dashboard } from '@/pages/Dashboard'
import { Pacientes } from '@/pages/Pacientes'
import { Hospitais } from '@/pages/Hospitais'
import { Agenda } from '@/pages/Agenda'
import { Exames } from '@/pages/Exames'
import { NotFound } from '@/pages/NotFound'

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'pacientes', element: <Pacientes /> },
      { path: 'hospitais', element: <Hospitais /> },
      { path: 'agenda', element: <Agenda /> },
      { path: 'exames', element: <Exames /> },
      { path: 'sobre', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
