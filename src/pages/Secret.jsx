import { lazy, Suspense, useEffect } from 'react'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

const Dashboard = lazy(() => import('./admin/Dashboard.jsx'))

export default function SecretPage() {
  useEffect(() => {
    const previousTitle = document.title
    const existingRobots = document.querySelector('meta[name="robots"]')
    const robots = existingRobots ?? document.createElement('meta')
    const previousContent = robots.content
    robots.name = 'robots'
    robots.content = 'noindex, nofollow, noarchive'
    if (!existingRobots) document.head.appendChild(robots)
    document.title = 'Unity Within'
    return () => {
      document.title = previousTitle
      if (existingRobots) robots.content = previousContent
      else robots.remove()
    }
  }, [])

  return <ErrorBoundary>
    <Suspense fallback={<div className="admin-loading" role="status">Opening your workspace…</div>}>
      <Dashboard />
    </Suspense>
  </ErrorBoundary>
}
