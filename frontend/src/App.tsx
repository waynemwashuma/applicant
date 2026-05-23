import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes, useParams } from 'react-router-dom'
import {
  FiAlertCircle,
  FiChevronDown,
  FiFolderPlus,
  FiGlobe,
  FiList,
  FiUser,
  FiUserCheck,
  FiWifiOff,
  FiX,
} from 'react-icons/fi'
import { ApplicationStoreProvider } from './common/ApplicationStoreContext'
import { UserRoleProvider } from './common/UserRoleContext'
import {
  notifyServiceWorkerMode,
  persistApiMode,
  readStoredApiMode,
  type ApiMode,
} from './common/apiMode'
import { persistUserRole, readStoredUserRole, type UserRole } from './common/roleMode'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import ApplicationFormPage from './pages/ApplicationFormPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ReviewerDecisionPage from './pages/ReviewerDecisionPage'
import './App.css'

type AppLayoutProps = {
  apiMode: ApiMode
  userRole: UserRole
  onToggleApiMode: () => void
  onChangeUserRole: (role: UserRole) => void
  showUnavailableBanner: boolean
  onDismissUnavailableBanner: () => void
}

function AppLayout({
  apiMode,
  userRole,
  onChangeUserRole,
  onToggleApiMode,
  showUnavailableBanner,
  onDismissUnavailableBanner,
}: AppLayoutProps) {
  const roleLabel = userRole === 'reviewer' ? 'Reviewer' : 'User'

  return (
    <div className="app-shell">
      <div className="status-banner-shell" aria-hidden={!showUnavailableBanner}>
        <div
          className={`status-banner ${showUnavailableBanner ? 'visible' : 'hidden'}`}
          role="status"
          aria-live="polite"
        >
          <FiAlertCircle />
          <span>The live server is unavailable. Offline mock data is being used.</span>
          <button
            type="button"
            className="status-banner-close"
            onClick={onDismissUnavailableBanner}
            aria-label="Dismiss live server unavailable notice"
          >
            <FiX />
          </button>
        </div>
      </div>
      <header className="site-header">
        <div className="site-header-top">
          <div className="brand-block">
            <span className="eyebrow">Application Workflow Tracker</span>
          </div>

          <div className="role-menu">
            <details className="role-menu-details">
              <summary className="role-menu-trigger" aria-label="Switch user role">
                <span className="role-menu-icon">
                  {userRole === 'reviewer' ? <FiUserCheck /> : <FiUser />}
                </span>
                <span className="role-menu-label">{roleLabel}</span>
                <FiChevronDown className="role-menu-chevron" aria-hidden="true" />
              </summary>
              <div className="role-menu-panel" role="menu" aria-label="Workspace role">
                <button
                  type="button"
                  className={`role-menu-option ${userRole === 'user' ? 'active' : ''}`}
                  onClick={(event) => {
                    onChangeUserRole('user')
                    ;(event.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
                  }}
                  role="menuitemradio"
                  aria-checked={userRole === 'user'}
                >
                  <FiUser />
                  User
                </button>
                <button
                  type="button"
                  className={`role-menu-option ${userRole === 'reviewer' ? 'active' : ''}`}
                  onClick={(event) => {
                    onChangeUserRole('reviewer')
                    ;(event.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open')
                  }}
                  role="menuitemradio"
                  aria-checked={userRole === 'reviewer'}
                >
                  <FiUserCheck />
                  Reviewer
                </button>
              </div>
            </details>
          </div>
        </div>

        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiList />
            Applications
          </NavLink>
          <NavLink
            to="/applications/new"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <FiFolderPlus />
            New Draft
          </NavLink>
          <button
            type="button"
            className={`nav-toggle ${apiMode === 'mock' ? 'mock' : 'live'}`}
            onClick={onToggleApiMode}
            role="switch"
            aria-checked={apiMode === 'mock'}
            title={
              apiMode === 'mock'
                ? 'Switch to live API with offline fallback'
                : 'Switch to offline mock server'
            }
          >
            <span className="nav-toggle-label">
              {apiMode === 'mock' ? <FiWifiOff /> : <FiGlobe />}
              <span>{apiMode === 'mock' ? 'Mock' : 'Live'}</span>
            </span>
            <span className="nav-toggle-track" aria-hidden="true">
              <span className="nav-toggle-thumb" />
            </span>
          </button>
        </nav>
      </header>

      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  )
}

function CreateRoute() {
  return <ApplicationFormPage key="create-route" mode="create" />
}

function DetailRoute() {
  const { id } = useParams()
  return <ApplicationDetailPage key={id ?? 'detail-route'} />
}

function EditApplicationRoute() {
  const { id } = useParams()
  return <ApplicationFormPage key={id ?? 'edit-route'} mode="edit" />
}

function ReviewerDecisionRoute() {
  const { id } = useParams()
  return <ReviewerDecisionPage key={id ?? 'review-route'} />
}

export default function App() {
  const [apiMode, setApiMode] = useState<ApiMode>(() => readStoredApiMode())
  const [userRole, setUserRole] = useState<UserRole>(() => readStoredUserRole())
  const [showUnavailableBanner, setShowUnavailableBanner] = useState(false)
  const [dismissedUnavailableBanner, setDismissedUnavailableBanner] = useState(false)

  useEffect(() => {
    persistApiMode(apiMode)
    void notifyServiceWorkerMode(apiMode)
  }, [apiMode])

  useEffect(() => {
    persistUserRole(userRole)
  }, [userRole])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    function handleMessage(event: MessageEvent) {
      if (!event.data || typeof event.data.type !== 'string') return

      if (event.data.type === 'LIVE_API_UNAVAILABLE') {
        setShowUnavailableBanner(true)
        setDismissedUnavailableBanner(false)
        return
      }

      if (event.data.type === 'LIVE_API_AVAILABLE') {
        setShowUnavailableBanner(false)
        setDismissedUnavailableBanner(false)
      }
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ApplicationStoreProvider apiMode={apiMode}>
        <UserRoleProvider value={{ userRole, setUserRole }}>
          <Routes>
            <Route
              element={
                <AppLayout
                  apiMode={apiMode}
                  userRole={userRole}
                  showUnavailableBanner={showUnavailableBanner && !dismissedUnavailableBanner}
                  onDismissUnavailableBanner={() => {
                    setDismissedUnavailableBanner(true)
                  }}
                  onChangeUserRole={(role) => {
                    setUserRole(role)
                  }}
                  onToggleApiMode={() =>
                    setApiMode((current) => {
                      const nextMode = current === 'live' ? 'mock' : 'live'
                      if (nextMode === 'mock') {
                        setShowUnavailableBanner(false)
                        setDismissedUnavailableBanner(false)
                      }
                      return nextMode
                    })
                  }
                />
              }
            >
              <Route index element={<Navigate to="/applications" replace />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/applications/new" element={<CreateRoute />} />
              <Route path="/applications/:id" element={<DetailRoute />} />
              <Route path="/applications/:id/edit" element={<EditApplicationRoute />} />
              <Route path="/applications/:id/review" element={<ReviewerDecisionRoute />} />
              <Route
                path="*"
                element={<Navigate to="/applications" replace />}
              />
            </Route>
          </Routes>
        </UserRoleProvider>
      </ApplicationStoreProvider>
    </BrowserRouter>
  )
}
