import { useState } from 'react'
import { FiAlertCircle, FiCheckCircle, FiSend } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useApplicationStore } from '../common/ApplicationStoreContext'
import {
  APPLICATION_TYPES,
  blankForm,
  canEdit,
  formFromApplication,
  validateApplicationForm,
  type ApplicationFormState,
} from '../common/applicationWorkflow'

export default function ApplicationFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getApplication, createApplication, updateApplication } = useApplicationStore()

  const application = mode === 'edit' && id ? getApplication(id) : undefined
  const [formState, setFormState] = useState<ApplicationFormState>(() => {
    if (application) return formFromApplication(application)
    return blankForm()
  })
  const [error, setError] = useState('')

  const resubmitMode = application?.status === 'Need More Information'
  const heading =
    mode === 'create'
      ? 'Create Application Draft'
      : resubmitMode
        ? 'Edit and Resubmit'
        : 'Edit Draft'

  function handleSave() {
    const validationError = validateApplicationForm(formState)
    if (validationError) {
      setError(validationError)
      return
    }

    if (mode === 'create') {
      const created = createApplication(formState)
      navigate(`/applications/${created.id}`)
      return
    }

    if (!application) {
      setError('That application could not be found.')
      return
    }

    if (!canEdit(application.status)) {
      setError('Only Draft and Need More Information applications can be edited.')
      return
    }

    const updated = updateApplication(application.id, formState, {
      resubmit: resubmitMode,
    })

    if (updated) {
      navigate(`/applications/${updated.id}`)
    }
  }

  if (mode === 'edit' && !application) {
    return (
      <section className="detail-card empty-state">
        <div className="empty-illustration">
          <FiAlertCircle />
        </div>
        <span className="panel-kicker">Not found</span>
        <h2>The requested application does not exist.</h2>
        <p>Check the tracking number or return to the queue.</p>
        <button className="primary-button" onClick={() => navigate('/applications')}>
          Back to applications
        </button>
      </section>
    )
  }

  return (
    <section className="detail-card form-card">
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Application Form</span>
          <h2>{heading}</h2>
        </div>
        <span className="form-badge">
          {mode === 'create' ? 'New draft' : resubmitMode ? 'Needs resubmission' : 'Draft edit'}
        </span>
      </div>

      {mode === 'edit' && application && !canEdit(application.status) ? (
        <div className="locked-note">
          <FiAlertCircle />
          <span>
            This application is locked. Only Draft and Need More Information records
            can be edited.
          </span>
        </div>
      ) : (
        <>
          <div className="form-grid">
            <label>
              <span>Applicant name</span>
              <input
                value={formState.applicant_name}
                onChange={(event) =>
                  setFormState({ ...formState, applicant_name: event.target.value })
                }
                placeholder="Enter applicant name"
              />
            </label>

            <label>
              <span>Applicant email</span>
              <input
                value={formState.applicant_email}
                onChange={(event) =>
                  setFormState({ ...formState, applicant_email: event.target.value })
                }
                placeholder="name@example.com"
                type="email"
              />
            </label>

            <label>
              <span>Company name</span>
              <input
                value={formState.company_name}
                onChange={(event) =>
                  setFormState({ ...formState, company_name: event.target.value })
                }
                placeholder="Company or organization"
              />
            </label>

            <label>
              <span>Application type</span>
              <select
                value={formState.application_type}
                onChange={(event) =>
                  setFormState({
                    ...formState,
                    application_type: event.target.value as ApplicationFormState['application_type'],
                  })
                }
              >
                {APPLICATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="full-width">
              <span>Description</span>
              <textarea
                value={formState.description}
                onChange={(event) =>
                  setFormState({ ...formState, description: event.target.value })
                }
                placeholder="Describe the filing, supporting context, or requested change"
                rows={6}
              />
            </label>
          </div>

          {error ? <div className="error-banner">{error}</div> : null}

          <div className="action-strip">
            <button
              className="ghost-button"
              onClick={() =>
                navigate(mode === 'create' ? '/applications' : `/applications/${application?.id}`)
              }
            >
              Cancel
            </button>
            <button className="primary-button" onClick={handleSave}>
              <FiSend />
              {mode === 'create'
                ? 'Create Draft'
                : resubmitMode
                  ? 'Save and Resubmit'
                  : 'Save Draft'}
            </button>
          </div>
        </>
      )}

      {mode === 'create' ? (
        <div className="helper-note">
          <FiCheckCircle />
          <span>The draft will remain editable until it is submitted.</span>
        </div>
      ) : null}
    </section>
  )
}
