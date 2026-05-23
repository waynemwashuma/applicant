import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { notifyServiceWorkerMode, readStoredApiMode } from './common/apiMode'
import './main.css'

async function bootstrap() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      await notifyServiceWorkerMode(readStoredApiMode())
    } catch {
      // The app still works against the live backend without the offline fallback.
    }
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

void bootstrap()
