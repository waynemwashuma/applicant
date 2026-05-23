/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  Application,
  ApplicationFormState,
  ReviewerDecision,
} from './applicationWorkflow'
import {
  STORAGE_KEY,
  createSeedApplications,
  createTrackingNumber,
  nowIso,
} from './applicationWorkflow'

type ApplicationStoreValue = {
  applications: Application[]
  getApplication: (id: string) => Application | undefined
  createApplication: (form: ApplicationFormState) => Application
  updateApplication: (
    id: string,
    form: ApplicationFormState,
    options?: { resubmit?: boolean },
  ) => Application | null
  submitApplication: (id: string) => Application | null
  startReview: (id: string) => Application | null
  recordDecision: (
    id: string,
    decision: ReviewerDecision,
    comment: string,
  ) => Application | null
}

const ApplicationStoreContext = createContext<ApplicationStoreValue | null>(null)

function readStoredApplications() {
  if (typeof window === 'undefined') return createSeedApplications()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedApplications()

    const parsed = JSON.parse(raw) as Application[]
    if (!Array.isArray(parsed) || parsed.length === 0) return createSeedApplications()

    return parsed
  } catch {
    return createSeedApplications()
  }
}

export function ApplicationStoreProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(readStoredApplications)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  const value = useMemo<ApplicationStoreValue>(() => {
    function getApplication(id: string) {
      return applications.find((application) => application.id === id)
    }

    function createApplication(form: ApplicationFormState) {
      const timestamp = nowIso()
      const application: Application = {
        id: crypto.randomUUID(),
        tracking_number: createTrackingNumber(applications.length),
        ...form,
        status: 'Draft',
        reviewer_comment: '',
        created_at: timestamp,
        updated_at: timestamp,
        submitted_at: null,
        reviewed_at: null,
      }

      setApplications((current) => [application, ...current])
      return application
    }

    function updateApplication(
      id: string,
      form: ApplicationFormState,
      options?: { resubmit?: boolean },
    ) {
      const timestamp = nowIso()
      let updated: Application | null = null

      setApplications((current) =>
        current.map((application) => {
          if (application.id !== id) return application

          const nextStatus =
            options?.resubmit || application.status === 'Need More Information'
              ? 'Submitted'
              : application.status

          updated = {
            ...application,
            ...form,
            status: nextStatus,
            submitted_at: nextStatus === 'Submitted' ? timestamp : application.submitted_at,
            updated_at: timestamp,
          }

          return updated
        }),
      )

      return updated
    }

    function submitApplication(id: string) {
      const timestamp = nowIso()
      let updated: Application | null = null

      setApplications((current) =>
        current.map((application) => {
          if (application.id !== id) return application

          updated = {
            ...application,
            status: 'Submitted',
            submitted_at: timestamp,
            updated_at: timestamp,
          }

          return updated
        }),
      )

      return updated
    }

    function startReview(id: string) {
      const timestamp = nowIso()
      let updated: Application | null = null

      setApplications((current) =>
        current.map((application) => {
          if (application.id !== id) return application

          updated = {
            ...application,
            status: 'Under Review',
            updated_at: timestamp,
          }

          return updated
        }),
      )

      return updated
    }

    function recordDecision(
      id: string,
      decision: ReviewerDecision,
      comment: string,
    ) {
      const timestamp = nowIso()
      let updated: Application | null = null

      setApplications((current) =>
        current.map((application) => {
          if (application.id !== id) return application

          updated = {
            ...application,
            status: decision,
            reviewer_comment: comment.trim(),
            reviewed_at: timestamp,
            updated_at: timestamp,
          }

          return updated
        }),
      )

      return updated
    }

    return {
      applications,
      getApplication,
      createApplication,
      updateApplication,
      submitApplication,
      startReview,
      recordDecision,
    }
  }, [applications])

  return (
    <ApplicationStoreContext.Provider value={value}>
      {children}
    </ApplicationStoreContext.Provider>
  )
}

export function useApplicationStore() {
  const context = useContext(ApplicationStoreContext)
  if (!context) {
    throw new Error('useApplicationStore must be used within ApplicationStoreProvider')
  }

  return context
}
