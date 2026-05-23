import { useState } from 'react'
import {
  FiAlertCircle,
  FiArrowRight,
  FiEdit3,
  FiFileText,
  FiMail,
  FiPlayCircle,
  FiRefreshCw,
  FiSend,
  FiUser,
  FiUserCheck,
} from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useApplicationStore } from '../common/ApplicationStoreContext'
import {
  buildApplicationTimeline,
  formatDateTime,
  getWorkflowHint,
  statusMeta,
} from '../common/applicationWorkflow'

export default function ApplicationDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getApplication, isLoading, submitApplication, startReview } = useApplicationStore()

  const application = id ? getApplication(id) : undefined
  const [feedback, setFeedback] = useState('')

  const timeline = application ? buildApplicationTimeline(application) : []

  if (isLoading) {
    return (
      <section className="detail-card empty-state">
        <div className="empty-illustration">
          <FiRefreshCw />
        </div>
        <span className="panel-kicker">Loading</span>
        <h2>Loading application details...</h2>
        <p>Fetching the current record from the API.</p>
      </section>
    )
  }

  if (!application) {
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
    <section className="detail-card">
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Application Detail</span>
          <h2>{application.tracking_number}</h2>
        </div>
        <span className={statusMeta[application.status].tone}>{application.status}</span>
      </div>

      <div className="detail-grid">
        <article className="detail-section">
          <h3>Applicant</h3>
          <dl className="fact-grid">
            <div>
              <dt>
                <FiUser />
                Name
              </dt>
              <dd>{application.applicant_name}</dd>
            </div>
            <div>
              <dt>
                <FiMail />
                Email
              </dt>
              <dd>{application.applicant_email}</dd>
            </div>
            <div>
              <dt>
                <FiUserCheck />
                Company
              </dt>
              <dd>{application.company_name}</dd>
            </div>
            <div>
              <dt>
                <FiFileText />
                Application type
              </dt>
              <dd>{application.application_type}</dd>
            </div>
          </dl>
        </article>

        <article className="detail-section">
          <h3>Workflow</h3>
          <div className="timeline">
            {timeline.map((step) => (
              <div
                key={step.label}
                className={`timeline-step ${step.active ? 'active' : ''} ${step.done ? 'done' : ''}`}
              >
                <span className="timeline-dot" />
                <div>
                  <strong>{step.label}</strong>
                  <p>
                    {step.label === 'Decision'
                      ? 'Final reviewer response for the current review cycle.'
                      : 'Transition point in the assignment workflow.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
      <article className="detail-section">
        <h3>Description</h3>
        <p className="copy">{application.description}</p>
      </article>

      <div className="meta-grid">
        <div>
          <span>Created</span>
          <strong>{formatDateTime(application.created_at)}</strong>
        </div>
        <div>
          <span>Updated</span>
          <strong>{formatDateTime(application.updated_at)}</strong>
        </div>
        <div>
          <span>Submitted</span>
          <strong>{formatDateTime(application.submitted_at)}</strong>
        </div>
        <div>
          <span>Reviewed</span>
          <strong>{formatDateTime(application.reviewed_at)}</strong>
        </div>
      </div>

      <article className="detail-section">
        <h3>Reviewer comment</h3>
        <p className="copy">
          {application.reviewer_comment || 'No reviewer note has been recorded yet.'}
        </p>
      </article>

      <div className="action-strip">
        {application.status === 'Draft' && (
          <>
            <button
              className="secondary-button"
              onClick={() => navigate(`/applications/${application.id}/edit`)}
            >
              <FiEdit3 />
              Edit
            </button>
            <button
              className="primary-button"
              onClick={async () => {
                await submitApplication(application.id)
                setFeedback('The application has been submitted.')
              }}
            >
              <FiSend />
              Submit
            </button>
          </>
        )}

        {application.status === 'Submitted' && (
          <button
            className="primary-button"
            onClick={async () => {
              const started = await startReview(application.id)
              if (started) {
                navigate(`/applications/${started.id}/review`)
              }
            }}
          >
            <FiPlayCircle />
            Start Review
          </button>
        )}

        {application.status === 'Under Review' && (
          <button
            className="primary-button"
            onClick={() => navigate(`/applications/${application.id}/review`)}
          >
            <FiArrowRight />
            Open Reviewer Form
          </button>
        )}

        {application.status === 'Need More Information' && (
          <>
            <button
              className="secondary-button"
              onClick={() => navigate(`/applications/${application.id}/edit`)}
            >
              <FiEdit3 />
              Edit
            </button>
            <button
              className="primary-button"
              onClick={() => {
                navigate(`/applications/${application.id}/edit`)
              }}
            >
              <FiArrowRight />
              Resubmit
            </button>
          </>
        )}

        {(application.status === 'Approved' || application.status === 'Rejected') && (
          <div className="locked-note">
            <FiAlertCircle />
            <span>No edit actions are available for completed applications.</span>
          </div>
        )}
      </div>

      <div className="rules-note">
        <FiRefreshCw />
        <span>{getWorkflowHint(application.status)}</span>
      </div>

      {feedback ? (
        <div className="feedback-bar" aria-live="polite">
          <FiRefreshCw />
          <span>{feedback}</span>
        </div>
      ) : null}
    </section>
  )
}
