import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import './index.css'

// O script do Google AdSense agora vive direto no <head> de index.html
// (exigência do crawler de verificação de propriedade do site).

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
