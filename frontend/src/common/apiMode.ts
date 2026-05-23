export type ApiMode = 'live' | 'mock'

const STORAGE_KEY = 'workflow-tracker-api-mode'

export function readStoredApiMode(): ApiMode {
  if (typeof window === 'undefined') return 'live'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'mock' ? 'mock' : 'live'
}

export function persistApiMode(mode: ApiMode) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, mode)
}

export async function notifyServiceWorkerMode(mode: ApiMode) {
  if (!('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.ready
    const controller = navigator.serviceWorker.controller ?? registration.active

    controller?.postMessage({
      type: 'SET_API_MODE',
      mode,
    })
  } catch {
    // The app still works if the worker is unavailable; the live API remains the default.
  }
}
