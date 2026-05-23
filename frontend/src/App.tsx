import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { FiFileText, FiFolderPlus, FiList } from 'react-icons/fi'
import { ApplicationStoreProvider } from './common/ApplicationStoreContext'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import ApplicationFormPage from './pages/ApplicationFormPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ReviewerDecisionPage from './pages/ReviewerDecisionPage'
import './App.css'

function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-block">
          <span className="eyebrow">Application Workflow Tracker</span>
          <p>
            Navigate between the application list, the create/edit form, and the
            application detail page while the mock backend persists in your browser.
          </p>
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
          <span className="nav-hint">
            <FiFileText />
            Local mock data
          </span>
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
  return (
    <BrowserRouter>
      <ApplicationStoreProvider>
        <Routes>
          <Route element={<AppLayout />}>
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
      </ApplicationStoreProvider>
    </BrowserRouter>
  )
}
