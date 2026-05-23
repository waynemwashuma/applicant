import { useState } from 'react'
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiFileText,
  FiMail,
  FiRefreshCw,
  FiUser,
  FiUserCheck,
} from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useApplicationStore } from '../common/ApplicationStoreContext'
import {
  formatDateTime,
  canReview,
  canStartReview,
  needsReviewerComment,
  statusMeta,
  type ReviewFormState,
} from '../common/applicationWorkflow'

export default function ReviewerDecisionPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getApplication, startReview, recordDecision } = useApplicationStore()

  const application = id ? getApplication(id) : undefined
  const [reviewState, setReviewState] = useState<ReviewFormState>({
    decision: 'Approved',
    comment: application?.reviewer_comment ?? '',
  })
  const [error, setError] = useState('')

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

  const isReviewable = canReview(application.status)
  const isReadyToStart = canStartReview(application.status)

  function handleDecisionSave() {
    if (needsReviewerComment(reviewState.decision) && !reviewState.comment.trim()) {
      setError('A reviewer comment is required for this decision.')
      return
    }

    const updated = recordDecision(application.id, reviewState.decision, reviewState.comment)
    if (updated) {
      navigate(`/applications/${updated.id}`)
    }
  }

  function handleStartReview() {
    const started = startReview(application.id)
    if (started) {
      navigate(`/applications/${started.id}/review`)
    }
  }

  return (
    <section className="detail-card form-card">
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Reviewer Decision</span>
          <h2>{application.tracking_number}</h2>
        </div>
        <span className={statusMeta[application.status].tone}>{application.status}</span>
      </div>

      {!isReviewable ? (
        <div className="detail-section">
          <h3>Review access</h3>
          <div className="locked-note">
            <FiAlertCircle />
            <span>
              {isReadyToStart
                ? 'This application has been submitted but review has not started yet.'
                : 'Reviewer decisions are only available while the application is under review.'}
            </span>
          </div>

          <div className="action-strip">
            <button className="ghost-button" onClick={() => navigate(`/applications/${application.id}`)}>
              Back to detail
            </button>
            {isReadyToStart ? (
              <button className="primary-button" onClick={handleStartReview}>
                <FiArrowRight />
                Start Review
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <div className="detail-grid">
            <article className="detail-section">
              <h3>Application summary</h3>
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
              <h3>Decision guidance</h3>
              <div className="helper-note">
                <FiRefreshCw />
                <span>
                  Approve to complete the application, request more information to send
                  it back for updates, or reject to close the workflow.
                </span>
              </div>
              <div className="timeline" style={{ marginTop: '14px' }}>
                <div className="timeline-step active">
                  <span className="timeline-dot" />
                  <div>
                    <strong>Under Review</strong>
                    <p>The reviewer decision form is now available.</p>
                  </div>
                </div>
                <div className="timeline-step">
                  <span className="timeline-dot" />
                  <div>
                    <strong>Decision</strong>
                    <p>Your selection will update the application status immediately.</p>
                  </div>
                </div>
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
            <h3>Reviewer decision</h3>
            <div className="review-grid">
              <label>
                <span>Decision</span>
                <select
                  value={reviewState.decision}
                  onChange={(event) =>
                    setReviewState({
                      ...reviewState,
                      decision: event.target.value as ReviewFormState['decision'],
                    })
                  }
                >
                  <option value="Approved">Approved</option>
                  <option value="Need More Information">Need More Information</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>

              <label className="full-width">
                <span>
                  Reviewer comment
                  {reviewState.decision === 'Approved' ? ' (optional)' : ' (required)'}
                </span>
                <textarea
                  value={reviewState.comment}
                  onChange={(event) =>
                    setReviewState({ ...reviewState, comment: event.target.value })
                  }
                  placeholder="Add the reviewer note"
                  rows={7}
                />
              </label>
            </div>

            <div className="helper-note">
              <FiAlertCircle />
              <span>
                Need More Information and Rejected decisions must include a reviewer
                comment.
              </span>
            </div>

            {error ? <div className="error-banner">{error}</div> : null}

            <div className="action-strip">
              <button
                className="ghost-button"
                onClick={() => navigate(`/applications/${application.id}`)}
              >
                Back to detail
              </button>
              <button className="primary-button" onClick={handleDecisionSave}>
                <FiCheckCircle />
                Record Decision
              </button>
            </div>
          </article>
        </>
      )}
    </section>
  )
}
