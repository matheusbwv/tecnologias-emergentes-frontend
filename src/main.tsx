import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import './index.css'

// Carrega o script global do Google AdSense uma única vez, apenas se o publisher
// estiver configurado em VITE_ADSENSE_CLIENT (formato `ca-pub-XXXXXXXXXXXXXXXX`).
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT
if (ADSENSE_CLIENT) {
  const s = document.createElement('script')
  s.async = true
  s.crossOrigin = 'anonymous'
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
  document.head.appendChild(s)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
