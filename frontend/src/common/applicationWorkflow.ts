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

export const STORAGE_KEY = 'workflow-tracker-mock-applications-v2'

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

export function createSeedApplications(): Application[] {
  const base = new Date('2026-05-12T08:30:00.000Z')
  const at = (days: number, hours = 0) =>
    new Date(base.getTime() + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000).toISOString()

  return [
    {
      id: 'seed-1',
      tracking_number: 'APP-0001',
      applicant_name: 'Amina Kibet',
      applicant_email: 'amina.kibet@example.com',
      company_name: 'Northstar Media Ltd',
      application_type: 'Recordation',
      description:
        'Register a new recordation application for a recently completed transfer.',
      status: 'Draft',
      reviewer_comment: '',
      created_at: at(0),
      updated_at: at(0),
      submitted_at: null,
      reviewed_at: null,
    },
    {
      id: 'seed-2',
      tracking_number: 'APP-0002',
      applicant_name: 'Daniel Mwangi',
      applicant_email: 'daniel.mwangi@example.com',
      company_name: 'Greenfield Renewals',
      application_type: 'Renewal',
      description:
        'Renew an existing filing with updated supporting documents and contact details.',
      status: 'Submitted',
      reviewer_comment: '',
      created_at: at(1),
      updated_at: at(1, 4),
      submitted_at: at(1, 2),
      reviewed_at: null,
    },
    {
      id: 'seed-3',
      tracking_number: 'APP-0003',
      applicant_name: 'Sophia Njeri',
      applicant_email: 'sophia.njeri@example.com',
      company_name: 'Harbor IP Services',
      application_type: 'Change of Ownership',
      description:
        'Ownership moved from the previous operator to a new corporate entity.',
      status: 'Under Review',
      reviewer_comment: '',
      created_at: at(2),
      updated_at: at(3, 1),
      submitted_at: at(2, 5),
      reviewed_at: null,
    },
    {
      id: 'seed-4',
      tracking_number: 'APP-0004',
      applicant_name: 'Peter Otieno',
      applicant_email: 'peter.otieno@example.com',
      company_name: 'Kijiji Brands',
      application_type: 'Change of Name',
      description:
        'The business has rebranded and needs the application updated to the new legal name.',
      status: 'Need More Information',
      reviewer_comment: 'Please attach the certificate of incorporation and supporting resolution.',
      created_at: at(3),
      updated_at: at(4, 2),
      submitted_at: at(3, 4),
      reviewed_at: at(4, 2),
    },
    {
      id: 'seed-5',
      tracking_number: 'APP-0005',
      applicant_name: 'Nadia Hassan',
      applicant_email: 'nadia.hassan@example.com',
      company_name: 'Sunrise Registry',
      application_type: 'Discontinuation',
      description:
        'The applicant has requested discontinuation and closure of the registration record.',
      status: 'Approved',
      reviewer_comment: 'Looks complete. Approved for closure.',
      created_at: at(4),
      updated_at: at(5, 3),
      submitted_at: at(4, 6),
      reviewed_at: at(5, 3),
    },
    {
      id: 'seed-6',
      tracking_number: 'APP-0006',
      applicant_name: 'Moses Ouma',
      applicant_email: 'moses.ouma@example.com',
      company_name: 'Lighthouse Holdings',
      application_type: 'Recordation',
      description:
        'Submitted with incomplete supporting material and missing signatures.',
      status: 'Rejected',
      reviewer_comment: 'Missing signatures and incomplete supporting material.',
      created_at: at(5),
      updated_at: at(6, 2),
      submitted_at: at(5, 2),
      reviewed_at: at(6, 2),
    },
  ]
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

