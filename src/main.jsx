import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MediaProvider } from './context/MediaContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MediaProvider>
      <App />
    </MediaProvider>
  </StrictMode>,
)
