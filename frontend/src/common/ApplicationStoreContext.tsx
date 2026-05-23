/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  Application,
  ApplicationFormState,
  ReviewerDecision,
} from './applicationWorkflow'
import {
  createApplication as createApplicationRequest,
  fetchApplications as fetchApplicationsRequest,
  recordDecision as recordDecisionRequest,
  startReview as startReviewRequest,
  submitApplication as submitApplicationRequest,
  updateApplication as updateApplicationRequest,
} from './applicationApi'

type ApplicationStoreValue = {
  applications: Application[]
  isLoading: boolean
  refreshApplications: () => Promise<void>
  getApplication: (id: string) => Application | undefined
  createApplication: (form: ApplicationFormState) => Promise<Application>
  updateApplication: (
    id: string,
    form: ApplicationFormState,
    options?: { resubmit?: boolean },
  ) => Promise<Application | null>
  submitApplication: (id: string) => Promise<Application | null>
  startReview: (id: string) => Promise<Application | null>
  recordDecision: (
    id: string,
    decision: ReviewerDecision,
    comment: string,
  ) => Promise<Application | null>
}

const ApplicationStoreContext = createContext<ApplicationStoreValue | null>(null)

export function ApplicationStoreProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadApplications() {
      try {
        const response = await fetchApplicationsRequest()
        if (!mounted) return
        setApplications(response)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadApplications()

    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo<ApplicationStoreValue>(() => {
    function getApplication(id: string) {
      return applications.find((application) => application.id === id)
    }

    async function refreshApplications() {
      setIsLoading(true)
      try {
        const response = await fetchApplicationsRequest()
        setApplications(response)
      } finally {
        setIsLoading(false)
      }
    }

    async function createApplication(form: ApplicationFormState) {
      const created = await createApplicationRequest(form)
      setApplications((current) => [created, ...current.filter((application) => application.id !== created.id)])
      return created
    }

    async function updateApplication(
      id: string,
      form: ApplicationFormState,
      options?: { resubmit?: boolean },
    ) {
      const updated = await updateApplicationRequest(id, form, options)
      setApplications((current) =>
        current.map((application) => (application.id === updated.id ? updated : application)),
      )
      return updated
    }

    async function submitApplication(id: string) {
      const updated = await submitApplicationRequest(id)
      setApplications((current) =>
        current.map((application) => (application.id === updated.id ? updated : application)),
      )
      return updated
    }

    async function startReview(id: string) {
      const updated = await startReviewRequest(id)
      setApplications((current) =>
        current.map((application) => (application.id === updated.id ? updated : application)),
      )
      return updated
    }

    async function recordDecision(
      id: string,
      decision: ReviewerDecision,
      comment: string,
    ) {
      const updated = await recordDecisionRequest(id, decision, comment)
      setApplications((current) =>
        current.map((application) => (application.id === updated.id ? updated : application)),
      )
      return updated
    }

    return {
      applications,
      isLoading,
      refreshApplications,
      getApplication,
      createApplication,
      updateApplication,
      submitApplication,
      startReview,
      recordDecision,
    }
  }, [applications, isLoading])

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
