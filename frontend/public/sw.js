const CACHE_NAME = 'workflow-tracker-mock-api-v2'
const APPLICATIONS_CACHE_KEY = '/__workflow-tracker__/applications'
const API_ROOT_PATH = new URL('api/', self.location.href).pathname
let apiMode = 'live'

async function notifyClients(message) {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  })

  for (const client of clients) {
    client.postMessage(message)
  }
}

function nowIso() {
  return new Date().toISOString()
}

function createTrackingNumber(index) {
  return `APP-${String(index + 1).padStart(4, '0')}`
}

function createSeedApplications() {
  const base = new Date('2026-05-12T08:30:00.000Z')
  const at = (days, hours = 0) =>
    new Date(base.getTime() + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000).toISOString()

  const statusCycle = [
    'Draft',
    'Submitted',
    'Under Review',
    'Need More Information',
    'Approved',
    'Rejected',
  ]
  const applicationTypes = [
    'Recordation',
    'Renewal',
    'Change of Ownership',
    'Change of Name',
    'Discontinuation',
  ]
  const applicantNames = [
    'Amina Kibet',
    'Daniel Mwangi',
    'Sophia Njeri',
    'Peter Otieno',
    'Nadia Hassan',
    'Moses Ouma',
    'Grace Achieng',
    'Ibrahim Ali',
    'Esther Wanjiku',
    'Kevin Kiptoo',
    'Mercy Chebet',
    'Brian Mutua',
    'Faith Kamau',
    'Josephine Atieno',
    'Isaac Mumo',
    'Lilian Nduku',
    'Charles Muriuki',
    'Hellen Wairimu',
    'Samuel Ndungu',
    'Naomi Jelagat',
  ]
  const companyNames = [
    'Northstar Media Ltd',
    'Greenfield Renewals',
    'Harbor IP Services',
    'Kijiji Brands',
    'Sunrise Registry',
    'Lighthouse Holdings',
    'Summit Legal Partners',
    'Bluewater Commerce',
    'Pinecrest Ventures',
    'Riverside Filings',
    'Atlas Compliance Group',
    'Evergreen Records',
    'Meridian Assets Ltd',
    'Cedar Gate Solutions',
    'Nairobi Filing Co',
    'Highland Mark Ltd',
    'Orbit Legal Services',
    'Mosaic Registry Bureau',
    'Stonebridge Holdings',
    'Prairie House Ventures',
  ]
  const reviewerComments = {
    Approved: 'Looks complete. Approved for closure.',
    Rejected: 'Missing supporting material or required signatures.',
    'Need More Information': 'Please attach the missing supporting documents.',
    Submitted: '',
    'Under Review': '',
    Draft: '',
  }

  const seedApplications = [
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

  const generatedApplications = Array.from({ length: 44 }, (_, index) => {
    const seedNumber = index + 7
    const status = statusCycle[index % statusCycle.length]
    const applicationType = applicationTypes[index % applicationTypes.length]
    const applicantName = applicantNames[index % applicantNames.length]
    const companyName = companyNames[index % companyNames.length]
    const dayOffset = seedNumber - 1
    const createdAt = at(dayOffset)
    const submittedAt = status === 'Draft' ? null : at(dayOffset, 2)
    const reviewedAt =
      status === 'Approved' || status === 'Rejected' || status === 'Need More Information'
        ? at(dayOffset + 1, 1)
        : null
    const updatedAt =
      reviewedAt ?? submittedAt ?? createdAt

    return {
      id: `seed-${seedNumber}`,
      tracking_number: createTrackingNumber(seedNumber - 1),
      applicant_name: applicantName,
      applicant_email: `${applicantName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '')}@example.com`,
      company_name: companyName,
      application_type: applicationType,
      description:
        status === 'Draft'
          ? `Draft filing for ${applicationType.toLowerCase()} awaiting final review.`
          : status === 'Submitted'
            ? `Submitted ${applicationType.toLowerCase()} ready for the next workflow step.`
            : status === 'Under Review'
              ? `Current review in progress for this ${applicationType.toLowerCase()} request.`
              : status === 'Need More Information'
                ? `Reviewer asked for additional documents before approval can continue.`
                : status === 'Approved'
                  ? `Completed ${applicationType.toLowerCase()} application approved and closed.`
                  : `Completed ${applicationType.toLowerCase()} application rejected after review.`,
      status,
      reviewer_comment: reviewerComments[status],
      created_at: createdAt,
      updated_at: updatedAt,
      submitted_at: submittedAt,
      reviewed_at: reviewedAt,
    }
  })

  return [...seedApplications, ...generatedApplications]
}

async function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

async function errorResponse(message, status = 400) {
  return jsonResponse({ detail: message }, status)
}

async function loadApplications() {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(APPLICATIONS_CACHE_KEY)

  if (cached) {
    return await cached.json()
  }

  const seed = createSeedApplications()
  await cache.put(APPLICATIONS_CACHE_KEY, await jsonResponse(seed))
  return seed
}

async function saveApplications(applications) {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(APPLICATIONS_CACHE_KEY, await jsonResponse(applications))
}

function cloneApplication(application) {
  return structuredClone(application)
}

function parseJsonBody(request) {
  return request.clone().json()
}

async function handleMockRequest(request) {
  const url = new URL(request.url)
  const apiPath = url.pathname.slice(API_ROOT_PATH.length)
  const applications = await loadApplications()

  if (request.method === 'GET' && apiPath === 'applications') {
    return jsonResponse(applications)
  }

  if (request.method === 'POST' && apiPath === 'applications') {
    const payload = await parseJsonBody(request)
    const timestamp = nowIso()
    const application = {
      id: crypto.randomUUID(),
      tracking_number: createTrackingNumber(applications.length),
      ...payload,
      status: 'Draft',
      reviewer_comment: '',
      created_at: timestamp,
      updated_at: timestamp,
      submitted_at: null,
      reviewed_at: null,
    }

    const nextApplications = [application, ...applications]
    await saveApplications(nextApplications)
    return jsonResponse(application, 201)
  }

  const applicationPathMatch = apiPath.match(/^applications\/([^/]+)(?:\/(submit|start-review|decision))?$/)

  if (!applicationPathMatch) {
    return errorResponse('Not found', 404)
  }

  const [, applicationId, action] = applicationPathMatch
  const applicationIndex = applications.findIndex((application) => application.id === applicationId)

  if (applicationIndex === -1) {
    return errorResponse('Application not found.', 404)
  }

  const application = cloneApplication(applications[applicationIndex])

  if (request.method === 'GET' && !action) {
    return jsonResponse(application)
  }

  if (request.method === 'PATCH' && !action) {
    const payload = await parseJsonBody(request)
    const timestamp = nowIso()
    const nextStatus =
      payload.resubmit || application.status === 'Need More Information'
        ? 'Submitted'
        : application.status

    const updated = {
      ...application,
      applicant_name: payload.applicant_name,
      applicant_email: payload.applicant_email,
      company_name: payload.company_name,
      application_type: payload.application_type,
      description: payload.description,
      status: nextStatus,
      submitted_at:
        nextStatus === 'Submitted' ? timestamp : application.submitted_at,
      updated_at: timestamp,
    }

    const nextApplications = [...applications]
    nextApplications[applicationIndex] = updated
    await saveApplications(nextApplications)
    return jsonResponse(updated)
  }

  if (request.method === 'POST' && action === 'submit') {
    const timestamp = nowIso()
    const updated = {
      ...application,
      status: 'Submitted',
      submitted_at: application.submitted_at ?? timestamp,
      updated_at: timestamp,
    }

    const nextApplications = [...applications]
    nextApplications[applicationIndex] = updated
    await saveApplications(nextApplications)
    return jsonResponse(updated)
  }

  if (request.method === 'POST' && action === 'start-review') {
    const updated = {
      ...application,
      status: 'Under Review',
      updated_at: nowIso(),
    }

    const nextApplications = [...applications]
    nextApplications[applicationIndex] = updated
    await saveApplications(nextApplications)
    return jsonResponse(updated)
  }

  if (request.method === 'POST' && action === 'decision') {
    const payload = await parseJsonBody(request)
    const comment = String(payload.comment ?? '').trim()

    if ((payload.decision === 'Need More Information' || payload.decision === 'Rejected') && !comment) {
      return errorResponse('A reviewer comment is required for this decision.', 400)
    }

    const updated = {
      ...application,
      status: payload.decision,
      reviewer_comment: comment,
      reviewed_at: nowIso(),
      updated_at: nowIso(),
    }

    const nextApplications = [...applications]
    nextApplications[applicationIndex] = updated
    await saveApplications(nextApplications)
    return jsonResponse(updated)
  }

  return errorResponse('Not found', 404)
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'SET_API_MODE') {
    return
  }

  apiMode = event.data.mode === 'mock' ? 'mock' : 'live'
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (!url.pathname.startsWith(API_ROOT_PATH)) {
    return
  }

  if (apiMode === 'mock') {
    event.respondWith(handleMockRequest(event.request))
    return
  }

  event.respondWith(
    (async () => {
      const networkRequest = event.request.clone()

      try {
        const response = await fetch(networkRequest)
        // Static hosts can return HTML 404s for missing API routes; only treat JSON as live API data.
        const contentType = response.headers.get('content-type') ?? ''

        if (contentType.includes('application/json')) {
          if (apiMode === 'live') {
            void notifyClients({ type: 'LIVE_API_AVAILABLE' })
          }
          return response
        }
      } catch {
        // Fall through to the mock store below when the backend is unreachable.
      }

      if (apiMode === 'live') {
        void notifyClients({
          type: 'LIVE_API_UNAVAILABLE',
          detail: 'The live server is unavailable, so offline mock data is being used.',
        })
      }

      return handleMockRequest(event.request)
    })(),
  )
})
