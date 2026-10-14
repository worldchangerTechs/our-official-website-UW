import { useEffect, useState } from 'react'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function usePublicView(view, fallback = []) {
  const [result, setResult] = useState({ data: fallback, loading: false, error: '' })

  useEffect(() => {
    if (!url || !anonKey) return undefined
    const controller = new AbortController()
    setResult({ data: [], loading: true, error: '' })
    fetch(`${url.replace(/\/$/, '')}/rest/v1/${view}?select=*`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      signal: controller.signal,
    }).then(async response => {
      if (!response.ok) throw new Error(`Public content request failed (${response.status}).`)
      const data = await response.json()
      if (!Array.isArray(data)) throw new Error('Public content response was not a list.')
      setResult({ data, loading: false, error: '' })
    }).catch(error => {
      if (error.name === 'AbortError') return
      console.error(`Could not load public content from ${view}`, error)
      setResult({ data: [], loading: false, error: 'Some website content is unavailable right now. Please try again later.' })
    })
    return () => controller.abort()
  }, [view])

  return result
}

export function publicImageUrl(path) {
  if (!path) return ''
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('data:')) return path
  if (!url) return path
  const objectPath = path.replace(/^\/+/, '').replace(/^unity-media\//, '')
  return `${url.replace(/\/$/, '')}/storage/v1/object/public/unity-media/${objectPath.split('/').map(encodeURIComponent).join('/')}`
}

export function toPublicStory(row) {
  return {
    ...row,
    id: row.id,
    consent: true,
    author: row.author_display_name || 'Shared with permission',
    imageUrl: publicImageUrl(row.image_path),
    imageAlt: row.image_alt || '',
    body: (row.body_markdown || '').split(/\n{2,}/).map(text => text.trim()).filter(Boolean),
    date: row.published_at ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Africa/Nairobi' }).format(new Date(row.published_at)) : '',
  }
}

export function toPublicCareer(row) {
  return {
    ...row,
    status: 'open',
    responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : [],
    lookingFor: Array.isArray(row.looking_for) ? row.looking_for : [],
    applyUrl: row.apply_url || '',
    applyEmail: row.apply_email || '',
  }
}
