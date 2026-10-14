import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer, Header } from './components.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const OurStory = lazy(() => import('./pages/OurStory.jsx'))
const WhatWeDo = lazy(() => import('./pages/WhatWeDo.jsx'))
const PeerTraining = lazy(() => import('./pages/PeerTraining.jsx'))
const GetSupport = lazy(() => import('./pages/GetSupport.jsx'))
const SelfAcceptanceHub = lazy(() => import('./pages/SelfAcceptanceHub.jsx'))
const Stories = lazy(() => import('./pages/Stories.jsx'))
const StoryDetail = lazy(() => import('./pages/StoryDetail.jsx'))
const Impact = lazy(() => import('./pages/Impact.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Volunteer = lazy(() => import('./pages/Volunteer.jsx'))
const Partner = lazy(() => import('./pages/Partner.jsx'))
const Donate = lazy(() => import('./pages/Donate.jsx'))
const Resources = lazy(() => import('./pages/Resources.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const Secret = lazy(() => import('./pages/Secret.jsx'))
const Careers = lazy(() => import('./pages/Careers.jsx'))
const CareerDetail = lazy(() => import('./pages/CareerDetail.jsx'))

const routeDefinitions = [
  ['/', Home],
  ['/our-story', OurStory],
  ['/what-we-do', WhatWeDo],
  ['/peer-training', PeerTraining],
  ['/get-support', GetSupport],
  ['/self-acceptance-hub', SelfAcceptanceHub],
  ['/hub/:slug', SelfAcceptanceHub],
  ['/stories', Stories],
  ['/stories/:slug', StoryDetail],
  ['/impact', Impact],
  ['/events', Events],
  ['/volunteer', Volunteer],
  ['/partner', Partner],
  ['/donate', Donate],
  ['/resources', Resources],
  ['/contact', Contact],
  ['/careers', Careers],
  ['/careers/:slug', CareerDetail],
  ['/tipape', Secret],
    ['*', NotFound],
]

function ScrollToRoute() {
  const location = useLocation()
  useEffect(() => {
    const anchor = location.hash && document.getElementById(location.hash.slice(1))
    if (anchor) anchor.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])
}

export function AppShell() {
  const location = useLocation();
  const isTipape = location.hash.startsWith('#/tipape');
  // Normalize direct /tipape path (no hash) to hash‑router format
  useEffect(() => {
    if (window.location.pathname.endsWith('/tipape') && !window.location.hash) {
      const basePath = window.location.pathname.replace(/\/tipape$/, '');
      const newUrl = `${window.location.origin}${basePath}#/tipape`;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);


  return (
    <>
      {!isTipape && <Header />}
      <main id="main-content" className="page-transition" tabIndex="-1">
        <Suspense fallback={<div className="page-loading wrap" role="status">Loading the next page…</div>}>
          <Routes>
            {routeDefinitions.map(([path, Component]) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </Suspense>
      </main>
      {!isTipape && <Footer />}
      <ScrollToRoute />
    </>
  )
}

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppShell />
    </HashRouter>
  )
}
