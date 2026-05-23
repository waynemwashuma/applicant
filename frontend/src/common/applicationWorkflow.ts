export type ApplicationType =
  | 'Recordation'
  | 'Renewal'
  | 'Change of Ownership'
  | 'Change of Name'
  | 'Discontinuation'

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Need More Information'
  | 'Approved'
  | 'Rejected'

export type ReviewerDecision = 'Approved' | 'Need More Information' | 'Rejected'

export type Application = {
  id: string
  tracking_number: string
  applicant_name: string
  applicant_email: string
  company_name: string
  application_type: ApplicationType
  description: string
  status: ApplicationStatus
  reviewer_comment: string
  created_at: string
  updated_at: string
  submitted_at: string | null
  reviewed_at: string | null
}

export type ApplicationFormState = {
  applicant_name: string
  applicant_email: string
  company_name: string
  application_type: ApplicationType
  description: string
}

export type ReviewFormState = {
  decision: ReviewerDecision
  comment: string
}

export type ApplicationTimelineStep = {
  label: string
  active: boolean
  done: boolean
}

export const APPLICATION_TYPES: ApplicationType[] = [
  'Recordation',
  'Renewal',
  'Change of Ownership',
  'Change of Name',
  'Discontinuation',
]

export const WORKFLOW_STATUSES: ApplicationStatus[] = [
  'Draft',
  'Submitted',
  'Under Review',
  'Need More Information',
  'Approved',
  'Rejected',
]

export const statusMeta: Record<
  ApplicationStatus,
  { tone: string; label: string; help: string }
> = {
  Draft: {
    tone: 'status status-draft',
    label: 'Draft',
    help: 'Editable while it is still a draft.',
  },
  Submitted: {
    tone: 'status status-submitted',
    label: 'Submitted',
    help: 'Waiting for a reviewer to start assessment.',
  },
  'Under Review': {
    tone: 'status status-review',
    label: 'Under Review',
    help: 'A reviewer can approve, request more information, or reject.',
  },
  'Need More Information': {
    tone: 'status status-more',
    label: 'Need More Information',
    help: 'The applicant can edit and resubmit the application.',
  },
  Approved: {
    tone: 'status status-approved',
    label: 'Approved',
    help: 'The application is complete and locked.',
  },
  Rejected: {
    tone: 'status status-rejected',
    label: 'Rejected',
    help: 'The application is complete and locked.',
  },
}

export function nowIso() {
  return new Date().toISOString()
}

export function formatDate(iso: string | null) {
  if (!iso) return 'Not yet'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatDateTime(iso: string | null) {
  if (!iso) return 'Not yet'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function createTrackingNumber(index: number) {
  const padded = String(index + 1).padStart(4, '0')
  return `APP-${padded}`
}

export function blankForm(): ApplicationFormState {
  return {
    applicant_name: '',
    applicant_email: '',
    company_name: '',
    application_type: 'Recordation',
    description: '',
  }
}

export function formFromApplication(application: Application): ApplicationFormState {
  return {
    applicant_name: application.applicant_name,
    applicant_email: application.applicant_email,
    company_name: application.company_name,
    application_type: application.application_type,
    description: application.description,
  }
}

export function validateApplicationForm(form: ApplicationFormState) {
  if (!form.applicant_name.trim()) return 'Applicant name is required.'
  if (!form.applicant_email.trim()) return 'Applicant email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.applicant_email)) {
    return 'Enter a valid email address.'
  }
  if (!form.company_name.trim()) return 'Company name is required.'
  if (!form.description.trim()) return 'Description is required.'
  return null
}

export function getStatusCounts(applications: Application[]) {
  return WORKFLOW_STATUSES.reduce(
    (counts, status) => {
      counts[status] = applications.filter((application) => application.status === status).length
      return counts
    },
    {} as Record<ApplicationStatus, number>,
  )
}

export function canEdit(status: ApplicationStatus) {
  return status === 'Draft' || status === 'Need More Information'
}

export function canSubmit(status: ApplicationStatus) {
  return status === 'Draft' || status === 'Need More Information'
}

export function canStartReview(status: ApplicationStatus) {
  return status === 'Submitted'
}

export function canReview(status: ApplicationStatus) {
  return status === 'Under Review'
}

export function needsReviewerComment(decision: ReviewerDecision) {
  return decision === 'Need More Information' || decision === 'Rejected'
}

export function buildApplicationTimeline(
  application: Application,
): ApplicationTimelineStep[] {
  return [
    {
      label: 'Draft',
      active: application.status === 'Draft',
      done: application.status !== 'Draft',
    },
    {
      label: 'Submitted',
      active: application.status === 'Submitted',
      done:
        application.status === 'Under Review' ||
        application.status === 'Need More Information' ||
        application.status === 'Approved' ||
        application.status === 'Rejected',
    },
    {
      label: 'Under Review',
      active: application.status === 'Under Review',
      done:
        application.status === 'Need More Information' ||
        application.status === 'Approved' ||
        application.status === 'Rejected',
    },
    {
      label: 'Decision',
      active:
        application.status === 'Need More Information' ||
        application.status === 'Approved' ||
        application.status === 'Rejected',
      done:
        application.status === 'Need More Information' ||
        application.status === 'Approved' ||
        application.status === 'Rejected',
    },
  ]
}

export function getWorkflowHint(status: ApplicationStatus) {
  if (canEdit(status)) return 'This application is editable right now.'
  if (canSubmit(status)) return 'This application can be submitted from the detail view.'
  if (canStartReview(status)) return 'The next step is to start the review.'
  if (canReview(status)) return 'The reviewer decision form is available.'
  return 'The workflow is locked for this application.'
}
