import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const serverFile = path.join(root, 'dist-ssr', 'entry-server.js')
const base = '/unitywithin-application-page/'
const htmlTemplate = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
const { render } = await import(pathToFileURL(serverFile).href)
const paths = [
  '/', '/our-story', '/what-we-do', '/peer-training', '/get-support',
  '/self-acceptance-hub', '/stories', '/stories/consent-required',
  '/impact', '/events', '/volunteer', '/partner', '/donate', '/resources',
  '/contact', '/not-found',
]

for (const route of paths) {
  const { html: content, helmet } = render(route)
  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join('')
  let template = htmlTemplate
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
  if (route !== '/') {
    template = template.replace(/<link rel="preload"[^>]*images\/optimized\/oscar-omondi-pLWciVWwGVQ-unsplash-1200\.avif[^>]*>\s*/, '')
  }
  const html = template
    .replace('</head>', `${head}</head>`)
    .replace('<div id="root">', `<div id="root" data-prerendered-route="${route}">`)
    .replace('<!--app-html-->', content)
    .replace(/href="\/(?!unitywithin-application-page\/)([^"]*)"/g, (_, destination) => `href="${base}${destination}"`)
  const output = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route.slice(1), 'index.html')
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, html)
  console.log(`Pre-rendered ${route}`)
}

const notFound = await fs.readFile(path.join(distDir, 'not-found', 'index.html'), 'utf8')
await fs.writeFile(path.join(distDir, '404.html'), notFound)
await fs.rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
