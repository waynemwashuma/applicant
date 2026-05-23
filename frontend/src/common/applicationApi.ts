import type { Application, ApplicationFormState, ReviewerDecision } from './applicationWorkflow'

const API_BASE = '/api'

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: string; message?: string }
    return payload.detail ?? payload.message ?? `Request failed with status ${response.status}`
  } catch {
    return `Request failed with status ${response.status}`
  }
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as T
}

export function fetchApplications() {
  return requestJson<Application[]>('/applications')
}

export function fetchApplication(id: string) {
  return requestJson<Application>(`/applications/${id}`)
}

export function createApplication(form: ApplicationFormState) {
  return requestJson<Application>('/applications', {
    method: 'POST',
    body: JSON.stringify(form),
  })
}

export function updateApplication(
  id: string,
  form: ApplicationFormState,
  options?: { resubmit?: boolean },
) {
  return requestJson<Application>(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...form,
      resubmit: options?.resubmit ?? false,
    }),
  })
}

export function submitApplication(id: string) {
  return requestJson<Application>(`/applications/${id}/submit`, {
    method: 'POST',
  })
}

export function startReview(id: string) {
  return requestJson<Application>(`/applications/${id}/start-review`, {
    method: 'POST',
  })
}

export function recordDecision(
  id: string,
  decision: ReviewerDecision,
  comment: string,
) {
  return requestJson<Application>(`/applications/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({
      decision,
      comment,
    }),
  })
}
