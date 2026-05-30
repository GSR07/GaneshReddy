import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0f172a',
          color: '#f1f5f9',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'Outfit, sans-serif',
        },
        success: { iconTheme: { primary: '#6366f1', secondary: '#0f172a' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
      }}
    />
  </StrictMode>,
)
