import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
        position="top-center"
        containerStyle={{
          zIndex: 99999, // Ensure it's above everything
        }}
        toastOptions={{
          duration: 3000,
        }}
      />
    <App />
  </StrictMode>,
)
