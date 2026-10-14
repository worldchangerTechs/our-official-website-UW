import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { staticPages } from './staticPages.jsx'
import { AppShell } from './App.jsx'

export function render(url) {
  const route = url.replace(/\/+$/, '') || '/'
  const ssrPages = Object.fromEntries(staticPages)
  const helmetContext = {}
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={`/${route === '/' ? '' : route.replace(/^\/+/, '')}`}>
        <AppShell ssrPages={ssrPages} />
      </StaticRouter>
    </HelmetProvider>,
  )
  return { html, helmet: helmetContext.helmet }
}
