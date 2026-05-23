import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiFolderPlus } from 'react-icons/fi'
import { useApplicationStore } from '../common/ApplicationStoreContext'
import { useUserRole } from '../common/UserRoleContext'
import { formatDate, statusMeta } from '../common/applicationWorkflow'
export default function ApplicationsPage() {
  const navigate = useNavigate()
  const { applications, isLoading } = useApplicationStore()
  const userRole = useUserRole()

  const sortedApplications = useMemo(
    () =>
      [...applications].sort(
        (left, right) =>
          new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime(),
      ),
    [applications],
  )

  return (
    <section className="page-stack">
      <section className="list-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">Queue</span>
            <h2>Applications</h2>
          </div>
          {userRole !== 'reviewer' ? (
            <button className="ghost-button" onClick={() => navigate('/applications/new')}>
              <FiFolderPlus />
              Create Draft
            </button>
          ) : null}
        </div>

        <div className="table-head">
          <span>Tracking</span>
          <span>Applicant</span>
          <span>Company</span>
          <span>Type</span>
          <span>Status</span>
          <span>Created</span>
        </div>

        {isLoading ? (
          <div className="loading-state">Loading applications...</div>
        ) : (
          <div className="list">
            {sortedApplications.map((application) => (
              <button
                key={application.id}
                className="list-row"
                onClick={() => navigate(`/applications/${application.id}`)}
              >
                <span className="cell tracking">{application.tracking_number}</span>
                <span className="cell">{application.applicant_name}</span>
                <span className="cell">{application.company_name}</span>
                <span className="cell muted">{application.application_type}</span>
                <span className="cell">
                  <span className={statusMeta[application.status].tone}>
                    {application.status}
                  </span>
                </span>
                <span className="cell muted">{formatDate(application.created_at)}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
