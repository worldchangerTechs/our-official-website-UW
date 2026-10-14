import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { supabase, supabaseConfigured } from '../../lib/supabaseClient.js'
import {
  ConfirmDialog, DataTable, DateTimePicker, Drawer, EmptyState, FormField, ImagePicker,
  MarkdownEditor, SlugField, StatusBadge, Tabs, TagInput, Toast,
} from './AdminUI.jsx'
import './Dashboard.css'

const contentTabs = [
  { id: 'stories', label: 'Stories' },
  { id: 'events', label: 'Events' },
  { id: 'careers', label: 'Careers' },
  { id: 'resources', label: 'Resources' },
  { id: 'impact_stats', label: 'Impact' },
]

const configs = {
  stories: {
    label: 'stories', table: 'stories', key: 'id', title: 'Story',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type' },
      { key: 'consent_confirmed', label: 'Consent', render: row => row.consent_confirmed ? 'Confirmed' : 'Not confirmed' },
      { key: 'content_status', label: 'Status', render: row => <StatusBadge status={row.content_status} /> },
    ],
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'type', label: 'Story type', kind: 'select', required: true, options: ['story', 'testimonial', 'video'] },
      { name: 'author_display_name', label: 'Name to show' },
      { name: 'role_label', label: 'Role or description' },
      { name: 'quote', label: 'Short quote', kind: 'textarea' },
      { name: 'body_markdown', label: 'Story text', kind: 'markdown' },
      { name: 'image_path', label: 'Photo', kind: 'image' },
      { name: 'image_alt', label: 'Photo description' },
      { name: 'video_url', label: 'Video link', kind: 'url' },
      { name: 'featured', label: 'Feature this story', kind: 'boolean' },
      { name: 'consent_confirmed', label: 'I have confirmed informed permission to publish this story and identifying details', kind: 'boolean' },
      { name: 'consent_note', label: 'Consent record (what was approved and when)', kind: 'textarea', required: true },
      { name: 'content_status', label: 'Publishing status', kind: 'status', required: true },
      { name: 'published_at', label: 'Publish date and time', kind: 'datetime' },
    ],
    schema: z.object({
      title: z.string().trim().min(1, 'Add a title.').max(180, 'Use 180 characters or fewer.'),
      type: z.enum(['story', 'testimonial', 'video']),
      consent_confirmed: z.boolean(),
      consent_note: z.string().max(1000).optional(),
      content_status: z.enum(['draft', 'scheduled', 'published', 'archived']),
      published_at: z.string().optional(),
    }),
  },
  events: {
    label: 'events', table: 'events', key: 'id', title: 'Event',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'starts_at', label: 'Starts', render: row => formatDate(row.starts_at) },
      { key: 'content_status', label: 'Status', render: row => <StatusBadge status={row.content_status} /> },
    ],
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'type', label: 'Activity type' },
      { name: 'description', label: 'Description', kind: 'markdown' },
      { name: 'location', label: 'Location' },
      { name: 'starts_at', label: 'Start date and time', kind: 'datetime' },
      { name: 'ends_at', label: 'End date and time', kind: 'datetime' },
      { name: 'image_path', label: 'Photo', kind: 'image' },
      { name: 'image_alt', label: 'Photo description' },
      { name: 'content_status', label: 'Publishing status', kind: 'status', required: true },
      { name: 'published_at', label: 'Publish date and time', kind: 'datetime' },
    ],
    schema: z.object({
      title: z.string().trim().min(1, 'Add a title.').max(180),
      content_status: z.enum(['draft', 'scheduled', 'published', 'archived']),
      published_at: z.string().optional(),
    }),
  },
  careers: {
    label: 'careers', table: 'careers', key: 'id', title: 'Opportunity',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Applications', render: row => <StatusBadge status={row.status} /> },
      { key: 'content_status', label: 'Publishing status', render: row => <StatusBadge status={row.content_status} /> },
    ],
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'slug', label: 'Page link', kind: 'slug', required: true },
      { name: 'type', label: 'Opportunity type', kind: 'select', required: true, options: ['volunteer', 'leadership', 'research', 'internship', 'fellowship', 'paid'] },
      { name: 'summary', label: 'Summary', kind: 'markdown', required: true },
      { name: 'responsibilities', label: 'Responsibilities', kind: 'tags' },
      { name: 'looking_for', label: 'What we are looking for', kind: 'tags' },
      { name: 'mode', label: 'Working mode' },
      { name: 'commitment', label: 'Time commitment' },
      { name: 'location', label: 'Location' },
      { name: 'status', label: 'Applications', kind: 'select', options: ['open', 'closed'] },
      { name: 'apply_url', label: 'Application link', kind: 'url' },
      { name: 'apply_email', label: 'Application email', kind: 'email' },
      { name: 'content_status', label: 'Publishing status', kind: 'status', required: true },
      { name: 'published_at', label: 'Publish date and time', kind: 'datetime' },
    ],
    schema: z.object({
      title: z.string().trim().min(1, 'Add a title.').max(180),
      slug: z.string().trim().min(1, 'Add a page link.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and dashes.'),
      type: z.enum(['volunteer', 'leadership', 'research', 'internship', 'fellowship', 'paid']),
      summary: z.string().trim().min(1, 'Add a short summary.'),
      status: z.enum(['open', 'closed']),
      content_status: z.enum(['draft', 'scheduled', 'published', 'archived']),
      published_at: z.string().optional(),
    }),
  },
  resources: {
    label: 'resources', table: 'resources', key: 'id', title: 'Resource',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'content_status', label: 'Status', render: row => <StatusBadge status={row.content_status} /> },
    ],
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'category', label: 'Category' },
      { name: 'description', label: 'Description', kind: 'markdown' },
      { name: 'file_path', label: 'File path or media URL' },
      { name: 'link_url', label: 'External link', kind: 'url' },
      { name: 'content_status', label: 'Publishing status', kind: 'status', required: true },
      { name: 'published_at', label: 'Publish date and time', kind: 'datetime' },
    ],
    schema: z.object({
      title: z.string().trim().min(1, 'Add a title.').max(180),
      content_status: z.enum(['draft', 'scheduled', 'published', 'archived']),
      published_at: z.string().optional(),
    }),
  },
  impact_stats: {
    label: 'impact figures', table: 'impact_stats', key: 'key', title: 'Impact figure',
    columns: [
      { key: 'label', label: 'Measure' },
      { key: 'value', label: 'Verified value' },
      { key: 'content_status', label: 'Status', render: row => <StatusBadge status={row.content_status} /> },
    ],
    fields: [
      { name: 'key', label: 'Unique key', required: true },
      { name: 'label', label: 'What was measured', required: true },
      { name: 'value', label: 'Verified value', kind: 'number', required: true },
      { name: 'goal_text', label: 'Goal or context', kind: 'textarea' },
      { name: 'content_status', label: 'Publishing status', kind: 'status', required: true },
      { name: 'published_at', label: 'Publish date and time', kind: 'datetime' },
    ],
    schema: z.object({
      key: z.string().trim().min(1, 'Add a unique key.').regex(/^[a-z0-9_-]+$/, 'Use lowercase letters, numbers, dashes, or underscores.'),
      label: z.string().trim().min(1, 'Describe what was measured.').max(160),
      value: z.number().int().min(0, 'Use a non-negative whole number.'),
      content_status: z.enum(['draft', 'scheduled', 'published', 'archived']),
      published_at: z.string().optional(),
    }),
  },
}

const defaultValues = {
  stories: { title: '', type: 'story', author_display_name: '', role_label: '', quote: '', body_markdown: '', image_path: '', image_alt: '', video_url: '', featured: false, consent_confirmed: false, consent_note: '', content_status: 'draft', published_at: '' },
  events: { title: '', type: '', description: '', location: '', starts_at: '', ends_at: '', image_path: '', image_alt: '', content_status: 'draft', published_at: '' },
  careers: { title: '', slug: '', type: 'volunteer', summary: '', responsibilities: [], looking_for: [], mode: '', commitment: '', location: '', status: 'open', apply_url: '', apply_email: '', content_status: 'draft', published_at: '' },
  resources: { title: '', category: '', description: '', file_path: '', link_url: '', content_status: 'draft', published_at: '' },
  impact_stats: { key: '', label: '', value: '0', goal_text: '', content_status: 'published', published_at: new Date().toISOString() },
}

const formatDate = value => value ? new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Nairobi',
}).format(new Date(value)) : '—'

const formatLastSaved = value => value
  ? `Saved ${new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', timeZone: 'Africa/Nairobi' }).format(new Date(value))}`
  : 'Not saved yet'

function FormControl({ field, value, onChange, error, media }) {
  if (field.kind === 'slug') return <SlugField value={value} onChange={onChange} error={error} />
  if (field.kind === 'datetime') return <DateTimePicker value={value} onChange={onChange} label={field.label} />
  if (field.kind === 'image') return <>
    <ImagePicker value={value} media={media} onChange={onChange} />
    {error && <small className="admin-field__error" role="alert">{error}</small>}
  </>
  if (field.kind === 'tags') return <TagInput value={Array.isArray(value) ? value : []} onChange={onChange} label={field.label} />
  if (field.kind === 'markdown') return <div className="admin-field">
    <label>{field.label}{field.required && <span aria-hidden="true"> *</span>}</label>
    <MarkdownEditor value={value ?? ''} onChange={onChange} label={field.label} invalid={Boolean(error)} />
    {error && <small className="admin-field__error" role="alert">{error}</small>}
  </div>
  if (field.kind === 'boolean') return <label className="admin-checkbox">
    <input type="checkbox" checked={Boolean(value)} onChange={event => onChange(event.target.checked)} />
    <span>{field.label}</span>
  </label>
  if (field.kind === 'select' || field.kind === 'status') return <FormField label={field.label} required={field.required} error={error}>
    {props => <select {...props} value={value ?? ''} onChange={event => onChange(event.target.value)}>
      {(field.kind === 'status' ? ['draft', 'scheduled', 'published', 'archived'] : field.options).map(option => <option key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}
    </select>}
  </FormField>
  if (field.kind === 'number') return <FormField label={field.label} required={field.required} error={error}>
    {props => <input {...props} type="number" min="0" step="1" value={value ?? ''} onChange={event => onChange(event.target.value)} />}
  </FormField>
  const type = field.kind === 'url' ? 'url' : field.kind === 'email' ? 'email' : 'text'
  if (field.kind === 'textarea') return <FormField label={field.label} required={field.required} error={error}>
    {props => <textarea {...props} rows={4} value={value ?? ''} onChange={event => onChange(event.target.value)} />}
  </FormField>
  return <FormField label={field.label} required={field.required} error={error}>
    {props => <input {...props} type={type} value={value ?? ''} onChange={event => onChange(event.target.value)} />}
  </FormField>
}

function ScreenMessage({ loading, error, onRetry }) {
  if (loading) return <div className="admin-screen-message" role="status">Loading…</div>
  if (error) return <div className="admin-screen-error" role="alert"><strong>We could not load this page.</strong><p>{error}</p><button className="button button--line" type="button" onClick={onRetry}>Try again</button></div>
  return null
}

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginBusy, setLoginBusy] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [screenError, setScreenError] = useState('')
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [media, setMedia] = useState([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaError, setMediaError] = useState('')
  const [uploadBusy, setUploadBusy] = useState(false)
  const [overviewCounts, setOverviewCounts] = useState(null)
  const [editor, setEditor] = useState(null)
  const [formValues, setFormValues] = useState(null)
  const [baseline, setBaseline] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [draftKey, setDraftKey] = useState('')
  const [lastSaved, setLastSaved] = useState('')
  const [draftWarning, setDraftWarning] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [revisions, setRevisions] = useState(null)
  const [revisionLoading, setRevisionLoading] = useState(false)
  const [submission, setSubmission] = useState(null)
  const [auditDetail, setAuditDetail] = useState(null)
  const draftValuesRef = useRef(null)

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), [])
  const clearToast = useCallback(() => setToast({ message: '', type: 'success' }), [])
  const isAdmin = profile?.role === 'admin'
  const signedIn = Boolean(session && profile)
  const activeConfig = configs[activeTab]
  const isDirty = Boolean(formValues && JSON.stringify(formValues) !== baseline)
  draftValuesRef.current = { formValues, baseline }

  const loadProfile = useCallback(async userId => {
    if (!supabase) return
    const { data, error } = await supabase.from('profiles').select('id, display_name, role').eq('id', userId).maybeSingle()
    if (error) {
      setAuthError(`We could not check your access: ${error.message}`)
      setProfile(null)
      return
    }
    if (!data || !['admin', 'editor'].includes(data.role)) {
      setAuthError('This account does not have a staff profile. Ask an administrator to add your account.')
      setProfile(null)
      return
    }
    setAuthError('')
    setProfile(data)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false)
      return undefined
    }
    let active = true
    const load = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!active) return
      if (error) setAuthError(`We could not check your sign-in: ${error.message}`)
      setSession(data.session)
      if (data.session) await loadProfile(data.session.user.id)
      if (active) setAuthLoading(false)
    }
    void load()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!nextSession) {
        setProfile(null)
        return
      }
      window.setTimeout(() => { if (active) void loadProfile(nextSession.user.id) }, 0)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const loadMedia = useCallback(async () => {
    if (!supabase) return
    setMediaLoading(true)
    setMediaError('')
    const { data, error } = await supabase.storage.from('unity-media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (error) {
      setMediaError(error.message)
      setMediaLoading(false)
      return
    }
    setMedia(data.filter(item => item.id).map(item => ({
      ...item,
      url: supabase.storage.from('unity-media').getPublicUrl(item.name).data.publicUrl,
    })))
    setMediaLoading(false)
  }, [])

  const loadOverview = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setScreenError('')
    const results = await Promise.all([
      ...contentTabs.map(item => supabase.from(configs[item.id].table).select('*', { count: 'exact', head: true })),
      supabase.from('story_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    ])
    const failed = results.find(result => result.error)
    if (failed) setScreenError(failed.error.message)
    else setOverviewCounts(Object.fromEntries([...contentTabs.map((item, index) => [item.id, results[index].count ?? 0]), ['submissions', results.at(-1).count ?? 0]]))
    setLoading(false)
  }, [])

  const loadRows = useCallback(async () => {
    if (!supabase || !activeConfig) return
    setLoading(true)
    setScreenError('')
    const orderColumn = activeConfig.table === 'impact_stats' ? 'key' : 'updated_at'
    const { data, error } = await supabase.from(activeConfig.table).select('*').order(orderColumn, { ascending: false, nullsFirst: false })
    if (error) {
      setScreenError(error.message)
      setRows([])
    } else setRows(data ?? [])
    setLoading(false)
  }, [activeConfig])

  const loadSubmissions = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setScreenError('')
    const { data, error } = await supabase.from('story_submissions').select('id, name, anonymous, status, created_at').order('created_at', { ascending: false })
    if (error) {
      setScreenError(error.message)
      setRows([])
    } else setRows(data ?? [])
    setLoading(false)
  }, [])

  const loadAudit = useCallback(async () => {
    if (!supabase || !isAdmin) return
    setLoading(true)
    setScreenError('')
    const { data, error } = await supabase.from('audit_log').select('id, action, table_name, row_id, user_id, created_at, before_data, after_data').order('created_at', { ascending: false }).limit(200)
    if (error) {
      setScreenError(error.message)
      setRows([])
    } else setRows(data ?? [])
    setLoading(false)
  }, [isAdmin])

  useEffect(() => {
    if (!signedIn) return
    if (activeTab === 'overview') void loadOverview()
    else if (activeConfig) void loadRows()
    else if (activeTab === 'submissions') void loadSubmissions()
    else if (activeTab === 'media') void loadMedia()
    else if (activeTab === 'activity' && isAdmin) void loadAudit()
  }, [signedIn, activeTab, activeConfig, isAdmin, loadOverview, loadRows, loadSubmissions, loadMedia, loadAudit])

  const handleSignIn = async event => {
    event.preventDefault()
    if (!supabase) return
    setLoginBusy(true)
    setAuthError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoginBusy(false)
    if (error) {
      setAuthError('Sign-in did not work. Check your email and password, then try again.')
      return
    }
    setSession(data.session)
    if (data.session) await loadProfile(data.session.user.id)
  }

  const handleSignOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) {
      showToast(`We could not sign you out: ${error.message}`, 'error')
      return
    }
    setSession(null)
    setProfile(null)
    setActiveTab('overview')
  }

  const setTab = id => {
    if (editor && JSON.stringify(formValues) !== baseline) {
      setConfirm({ kind: 'switch', nextTab: id })
      return
    }
    setEditor(null)
    setFormValues(null)
    setActiveTab(id)
    setRows([])
    setScreenError('')
  }

  const openEditor = async (configId, record = null) => {
    if (!supabase || !session) return
    const config = configs[configId]
    const initial = { ...defaultValues[configId], ...(record ?? {}) }
    const freshKey = crypto.randomUUID()
    setEditor({ configId, record })
    setFormValues(initial)
    setBaseline(JSON.stringify(initial))
    setFieldErrors({})
    setDraftKey(freshKey)
    setLastSaved('')
    setDraftWarning('')
    if (record) {
      const { data, error } = await supabase.from('content_drafts').select('draft_key, data, updated_at')
        .eq('user_id', session.user.id).eq('table_name', config.table).eq('record_id', String(record[config.key]))
        .order('updated_at', { ascending: false }).limit(1).maybeSingle()
      if (error) {
        setDraftWarning(`Could not check for a saved draft: ${error.message}`)
        return
      }
      if (data) {
        setDraftKey(data.draft_key)
        const resumed = { ...initial, ...data.data }
        setFormValues(resumed)
        setBaseline(JSON.stringify(initial))
        setLastSaved(data.updated_at)
        showToast('Your saved draft is ready to continue.')
      }
    }
  }

  const validateValues = configId => {
    const config = configs[configId]
    const submitted = { ...formValues }
    if (configId === 'impact_stats') submitted.value = Number(submitted.value)
    const parsed = config.schema.safeParse(submitted)
    const errors = parsed.success ? {} : Object.fromEntries(parsed.error.issues.map(issue => [issue.path[0], issue.message]))
    if (submitted.content_status === 'scheduled' && !submitted.published_at) errors.published_at = 'Choose when this item should go live.'
    if (submitted.content_status === 'published' && configId === 'stories' && (!submitted.consent_confirmed || !submitted.consent_note?.trim())) {
      errors.consent_confirmed = 'Confirm and record the contributor’s permission before publishing.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length ? null : submitted
  }

  const saveRecord = async (statusOverride = null) => {
    if (!supabase || !editor || !formValues) return
    const config = configs[editor.configId]
    const validated = validateValues(editor.configId)
    if (!validated) return
    const contentStatus = statusOverride ?? validated.content_status
    const publishAt = contentStatus === 'published'
      ? (validated.published_at && new Date(validated.published_at) <= new Date() ? validated.published_at : new Date().toISOString())
      : contentStatus === 'scheduled' ? validated.published_at : validated.published_at || null
    const payload = { ...validated, content_status: contentStatus, published_at: publishAt }
    if (editor.configId === 'stories' || editor.configId === 'events' || editor.configId === 'resources') {
      payload.status = contentStatus === 'scheduled' ? 'draft' : contentStatus
    }
    if (editor.configId === 'careers') payload.status = contentStatus === 'archived' ? 'closed' : validated.status
    delete payload.id
    delete payload.created_at
    delete payload.updated_at
    setSaving(true)
    const request = editor.record
      ? supabase.from(config.table).update(payload).eq(config.key, editor.record[config.key]).select().single()
      : supabase.from(config.table).insert(payload).select().single()
    const { data, error } = await request
    if (error) {
      setSaving(false)
      setDraftWarning(`The save did not go through: ${error.message}`)
      showToast('Your changes were not saved. Please try again.', 'error')
      return
    }
    const { error: draftError } = await supabase.from('content_drafts').delete().eq('user_id', session.user.id).eq('draft_key', draftKey)
    setSaving(false)
    setEditor(null)
    setFormValues(null)
    setLastSaved('')
    if (draftError) showToast(`Saved successfully, but the temporary draft could not be cleared: ${draftError.message}`, 'error')
    else showToast(`${config.title} saved.`)
    if (data) setRows(current => editor.record ? current.map(row => row[config.key] === data[config.key] ? data : row) : [data, ...current])
    void loadOverview()
  }

  useEffect(() => {
    if (!editor || !formValues || !supabase || !session) return undefined
    let savingDraft = false
    const interval = window.setInterval(async () => {
      const current = draftValuesRef.current
      if (savingDraft || !current?.formValues || JSON.stringify(current.formValues) === current.baseline) return
      const validated = { ...current.formValues }
      if (editor.configId === 'impact_stats') validated.value = Number(validated.value)
      const config = configs[editor.configId]
      const parsed = config.schema.safeParse(validated)
      const missingSchedule = validated.content_status === 'scheduled' && !validated.published_at
      const missingConsent = editor.configId === 'stories' && validated.content_status === 'published' &&
        (!validated.consent_confirmed || !validated.consent_note?.trim())
      if (!parsed.success || missingSchedule || missingConsent) {
        setDraftWarning('Add the required details before this draft can be saved.')
        return
      }
      savingDraft = true
      const { data, error } = await supabase.from('content_drafts').upsert({
        user_id: session.user.id,
        draft_key: draftKey,
        table_name: config.table,
        record_id: editor.record ? String(editor.record[config.key]) : null,
        data: validated,
      }, { onConflict: 'user_id,draft_key' }).select('updated_at').single()
      savingDraft = false
      if (error) {
        setDraftWarning(`Draft autosave failed: ${error.message}`)
        return
      }
      setLastSaved(data.updated_at)
      setDraftWarning('')
    }, 20_000)
    return () => window.clearInterval(interval)
  }, [editor, draftKey, session])

  const archiveRecords = ids => {
    const contentRows = ids.map(id => rows.find(row => String(row[activeConfig.key]) === String(id))).filter(Boolean)
    if (!contentRows.length || !activeConfig) return
    setConfirm({ kind: 'archive', items: contentRows })
  }

  const deleteRecord = record => setConfirm({ kind: 'delete', record })

  const doArchive = async records => {
    if (!supabase || !activeConfig) return
    for (const record of records) {
      const patch = { content_status: 'archived' }
      if (activeTab === 'careers') patch.status = 'closed'
      const { error } = await supabase.from(activeConfig.table).update(patch).eq(activeConfig.key, record[activeConfig.key])
      if (error) {
        showToast(`Could not archive "${record.title ?? record.label}": ${error.message}`, 'error')
        void loadRows()
        return
      }
    }
    showToast(records.length === 1 ? 'Item archived.' : `${records.length} items archived.`)
    setRows(current => current.map(row => records.some(record => record[activeConfig.key] === row[activeConfig.key])
      ? { ...row, content_status: 'archived', ...(activeTab === 'careers' ? { status: 'closed' } : {}) }
      : row))
    void loadOverview()
  }

  const doDelete = async record => {
    if (!supabase || !activeConfig || !isAdmin) return
    const { error } = await supabase.from(activeConfig.table).delete().eq(activeConfig.key, record[activeConfig.key])
    if (error) {
      showToast(`Could not permanently delete this item: ${error.message}`, 'error')
      return
    }
    setRows(current => current.filter(row => row[activeConfig.key] !== record[activeConfig.key]))
    showToast('Item permanently deleted.')
    void loadOverview()
  }

  const openRevisions = async record => {
    if (!supabase || !activeConfig) return
    setRevisions({ record, rows: [] })
    setRevisionLoading(true)
    const { data, error } = await supabase.from('content_revisions').select('id, snapshot, user_id, created_at')
      .eq('table_name', activeConfig.table).eq('record_id', String(record[activeConfig.key]))
      .order('created_at', { ascending: false }).limit(50)
    setRevisionLoading(false)
    if (error) {
      showToast(`Could not load version history: ${error.message}`, 'error')
      setRevisions(null)
      return
    }
    setRevisions({ record, rows: data ?? [] })
  }

  const restoreRevision = async revision => {
    if (!supabase || !activeConfig || !revisions) return
    const snapshot = { ...revision.snapshot }
    delete snapshot.id
    delete snapshot.created_at
    delete snapshot.updated_at
    delete snapshot.user_id
    delete snapshot.draft_key
    delete snapshot.data
    const { data, error } = await supabase.from(activeConfig.table).update(snapshot)
      .eq(activeConfig.key, revisions.record[activeConfig.key]).select().single()
    if (error) {
      showToast(`Could not restore this version: ${error.message}`, 'error')
      return
    }
    setRows(current => current.map(row => row[activeConfig.key] === data[activeConfig.key] ? data : row))
    setRevisions(null)
    showToast('Earlier version restored. The previous content is still in history.')
  }

  const submitStoryAction = async (record, nextStatus) => {
    if (!supabase) return
    const { error } = await supabase.from('story_submissions').update({ status: nextStatus }).eq('id', record.id)
    if (error) {
      showToast(`Could not update the submission: ${error.message}`, 'error')
      return
    }
    setRows(current => current.map(row => row.id === record.id ? { ...row, status: nextStatus } : row))
    setSubmission(null)
    showToast(`Submission marked ${nextStatus}.`)
    void loadOverview()
  }

  const openSubmission = async record => {
    if (!supabase) return
    setSubmission({ ...record, loading: true })
    const { data, error } = await supabase.from('story_submissions')
      .select('id, name, anonymous, contact, story_text, consent_given, status, created_at')
      .eq('id', record.id).single()
    if (error) {
      setSubmission(null)
      showToast(`Could not open this submission: ${error.message}`, 'error')
      return
    }
    setSubmission(data)
  }

  const uploadMedia = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !supabase) return
    if (!file.type.startsWith('image/')) {
      setMediaError('Choose an image file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setMediaError('Images must be 10 MB or smaller.')
      return
    }
    setUploadBusy(true)
    setMediaError('')
    const safeName = file.name.normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-|-$/g, '')
    const path = `${crypto.randomUUID()}-${safeName}`
    const { error } = await supabase.storage.from('unity-media').upload(path, file, { contentType: file.type, upsert: false })
    setUploadBusy(false)
    if (error) {
      setMediaError(`Upload failed: ${error.message}`)
      return
    }
    showToast('Image added to the media library.')
    await loadMedia()
  }

  const deleteMedia = item => setConfirm({ kind: 'media-delete', item })

  const doDeleteMedia = async item => {
    if (!supabase || !isAdmin) return
    const { error } = await supabase.storage.from('unity-media').remove([item.name])
    if (error) {
      setMediaError(`Could not delete the image: ${error.message}`)
      return
    }
    setMedia(current => current.filter(mediaItem => mediaItem.name !== item.name))
    showToast('Image permanently deleted.')
  }

  const confirmAction = async () => {
    const pending = confirm
    setConfirm(null)
    if (!pending) return
    if (pending.kind === 'archive') await doArchive(pending.items)
    if (pending.kind === 'delete') await doDelete(pending.record)
    if (pending.kind === 'media-delete') await doDeleteMedia(pending.item)
    if (pending.kind === 'restore') await restoreRevision(pending.revision)
    if (pending.kind === 'discard') {
      setEditor(null)
      setFormValues(null)
    }
    if (pending.kind === 'switch') {
      setEditor(null)
      setFormValues(null)
      setActiveTab(pending.nextTab)
      setRows([])
      setScreenError('')
    }
  }

  const closeEditor = () => {
    if (isDirty) {
      setConfirm({ kind: 'discard' })
      return
    }
    setEditor(null)
    setFormValues(null)
  }

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview' },
    ...contentTabs.map(item => ({ ...item, count: overviewCounts?.[item.id] ?? 0 })),
    { id: 'submissions', label: 'Story submissions', count: overviewCounts?.submissions ?? 0 },
    { id: 'media', label: 'Media' },
    ...(isAdmin ? [{ id: 'activity', label: 'Activity log' }] : []),
  ], [isAdmin, overviewCounts])

  if (authLoading) return <div className="admin-loading" role="status">Checking your sign-in…</div>
  if (!supabaseConfigured || !supabase) return <div className="admin-login">
    <div className="admin-login__card">
      <p className="eyebrow mono">UNITY WITHIN / STAFF</p>
      <h1>Workspace unavailable</h1>
      <p>Staff sign-in is not configured. Add the Supabase URL and public key to the deployment settings.</p>
    </div>
  </div>
  if (!session) return <div className="admin-login">
    <div className="admin-login__card">
      <p className="eyebrow mono">UNITY WITHIN / STAFF</p>
      <h1>Welcome back.</h1>
      <p>Sign in with your staff account to manage website content.</p>
      {authError && <p className="admin-screen-error" role="alert">{authError}</p>}
      <form onSubmit={handleSignIn}>
        <FormField label="Email"><input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" required /></FormField>
        <FormField label="Password"><input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></FormField>
        <button className="button button--fill" type="submit" disabled={loginBusy}>{loginBusy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  </div>
  if (!profile) return <div className="admin-login">
    <div className="admin-login__card">
      <p className="eyebrow mono">UNITY WITHIN / STAFF</p>
      <h1>We could not confirm your access.</h1>
      <p className="admin-screen-error" role="alert">{authError || 'This account is not set up as a staff member.'}</p>
      <button className="button button--line" type="button" onClick={() => void handleSignOut()}>Sign out</button>
    </div>
  </div>

  const contentPanel = <div className="admin-panel-content">
    <div className="admin-content-heading">
      <div><p className="eyebrow mono">WEBSITE CONTENT</p><h1>{configs[activeTab]?.title === 'Impact figure' ? 'Impact' : `${configs[activeTab]?.label[0].toUpperCase()}${configs[activeTab]?.label.slice(1)}`}</h1></div>
      <button className="button button--fill" type="button" onClick={() => void openEditor(activeTab)}>Add {configs[activeTab]?.title.toLowerCase()}</button>
    </div>
    <ScreenMessage loading={loading} error={screenError} onRetry={() => void loadRows()} />
    {!loading && !screenError && <DataTable
      rows={rows}
      columns={configs[activeTab].columns}
      rowKey={configs[activeTab].key}
      onEdit={record => void openEditor(activeTab, record)}
      onArchive={archiveRecords}
      onDelete={deleteRecord}
      onHistory={record => void openRevisions(record)}
      canDelete={isAdmin}
    />}
  </div>

  const submissionColumns = [
    { key: 'name', label: 'Contributor', render: row => row.anonymous ? 'Anonymous' : row.name || 'Name not provided' },
    { key: 'created_at', label: 'Received', render: row => formatDate(row.created_at) },
    { key: 'status', label: 'Status', render: row => <StatusBadge status={row.status} /> },
  ]

  return <div className="admin-workspace">
    <header className="admin-topbar">
      <a className="admin-brand" href={`${import.meta.env.BASE_URL}#/`} aria-label="Unity Within website home"><span>UNITY</span> <strong>WITHIN</strong></a>
      <div className="admin-topbar__account"><span>{profile.display_name || session.user.email}</span><span className="admin-role">{profile.role}</span><button className="button button--line" type="button" onClick={() => void handleSignOut()}>Sign out</button></div>
    </header>
    <div className="admin-workspace__body">
      <section className="admin-welcome">
        <div><p className="eyebrow mono">STAFF WORKSPACE</p><h1>Welcome, {session.user.email}</h1><p>Manage stories, events, opportunities, resources, and verified impact.</p></div>
      </section>
      <Tabs items={tabs} active={activeTab} onChange={setTab} />
      <main id={`admin-panel-${activeTab}`} className="admin-main" role="tabpanel" aria-labelledby={`admin-tab-${activeTab}`} tabIndex="0">
        {activeTab === 'overview' && <section className="admin-panel-content">
          <div className="admin-content-heading"><div><p className="eyebrow mono">YOUR WORKSPACE</p><h2>What would you like to update?</h2></div></div>
          <ScreenMessage loading={loading} error={screenError} onRetry={() => void loadOverview()} />
          {!loading && !screenError && <div className="admin-overview-grid">
            {contentTabs.map(item => <button className="admin-overview-card" type="button" key={item.id} onClick={() => setTab(item.id)}>
              <span>{item.label}</span><strong>{overviewCounts?.[item.id] ?? '—'}</strong><small>Manage {item.label.toLowerCase()}</small>
            </button>)}
            <button className="admin-overview-card" type="button" onClick={() => setTab('submissions')}>
              <span>Story submissions</span><strong>{overviewCounts?.submissions ?? '—'}</strong><small>New submissions to review</small>
            </button>
          </div>}
          <div className="admin-guidance"><h3>Before publishing</h3><p>Check facts, dates, image permissions, and links. Stories are only public when the contributor’s permission is recorded. Do not include private health information without explicit permission.</p></div>
        </section>}
        {activeConfig && contentPanel}
        {activeTab === 'submissions' && <section className="admin-panel-content">
          <div className="admin-content-heading"><div><p className="eyebrow mono">COMMUNITY</p><h1>Story submissions</h1><p>These messages may include sensitive personal information. Handle them with care.</p></div></div>
          <ScreenMessage loading={loading} error={screenError} onRetry={() => void loadSubmissions()} />
          {!loading && !screenError && <DataTable rows={rows} columns={submissionColumns} statusKey="status" onEdit={record => void openSubmission(record)} />}
        </section>}
        {activeTab === 'media' && <section className="admin-panel-content">
          <div className="admin-content-heading"><div><p className="eyebrow mono">IMAGE LIBRARY</p><h1>Media</h1><p>Choose approved images for website content. Please confirm permission before sharing identifiable people.</p></div>
            <label className="button button--fill admin-upload-button">{uploadBusy ? 'Uploading…' : 'Add image'}<input type="file" accept="image/*" disabled={uploadBusy} onChange={uploadMedia} /></label>
          </div>
          {mediaError && <p className="admin-screen-error" role="alert">{mediaError}</p>}
          {mediaLoading ? <div className="admin-screen-message" role="status">Loading images…</div> : !media.length
            ? <EmptyState title="Your media library is empty">Add an approved image to use it in website content.</EmptyState>
            : <div className="admin-media-grid">{media.map(item => <article className="admin-media-card" key={item.name}>
              <img src={item.url} alt="" loading="lazy" />
              <div><strong title={item.name}>{item.name}</strong><a href={item.url} target="_blank" rel="noreferrer">Open image</a></div>
              {isAdmin && <button className="admin-text-danger" type="button" onClick={() => deleteMedia(item)}>Delete image</button>}
            </article>)}</div>}
        </section>}
        {activeTab === 'activity' && isAdmin && <section className="admin-panel-content">
          <div className="admin-content-heading"><div><p className="eyebrow mono">ADMIN ONLY</p><h1>Activity log</h1><p>Recent changes made to website content and submissions.</p></div></div>
          <ScreenMessage loading={loading} error={screenError} onRetry={() => void loadAudit()} />
          {!loading && !screenError && <DataTable rows={rows} statusKey="action" columns={[
            { key: 'action', label: 'Action' },
            { key: 'table_name', label: 'Content type' },
            { key: 'row_id', label: 'Item ID' },
            { key: 'created_at', label: 'When', render: row => formatDate(row.created_at) },
            { key: 'details', label: 'Details', render: row => <button type="button" onClick={() => setAuditDetail(row)}>View changes</button> },
          ]} />}
        </section>}
      </main>
    </div>

    {editor && formValues && <Drawer title={`${editor.record ? 'Edit' : 'Add'} ${configs[editor.configId].title.toLowerCase()}`} onClose={closeEditor}>
      <form className="admin-editor-form" onSubmit={event => { event.preventDefault(); void saveRecord() }}>
        <p className="admin-editor-intro">Changes are not public until you choose a publishing status and save.</p>
        {configs[editor.configId].fields.map(field => <div className="admin-editor-field" key={field.name}>
          <FormControl field={field} value={formValues[field.name]} media={media} error={fieldErrors[field.name]} onChange={value => {
            setFormValues(current => ({ ...current, [field.name]: value }))
            setFieldErrors(current => ({ ...current, [field.name]: undefined }))
          }} />
        </div>)}
        <div className="admin-draft-status" aria-live="polite">
          <span>{lastSaved ? formatLastSaved(lastSaved) : 'Draft autosaves every 20 seconds'}</span>
          {draftWarning && <span className="admin-field__error" role="alert">{draftWarning}</span>}
        </div>
        <footer className="admin-editor-actions">
          <button className="button button--line" type="button" onClick={closeEditor}>Cancel</button>
          <button className="button button--fill" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </footer>
      </form>
    </Drawer>}

    {submission && <Drawer title="Story submission" onClose={() => setSubmission(null)}>
      <div className="admin-submission-detail">
        <p className="admin-sensitive-note">Please handle this message as private. Consent to submit does not mean consent to publish.</p>
        <p><strong>From:</strong> {submission.anonymous ? 'Anonymous' : submission.name || 'Name not provided'}</p>
        <p><strong>Received:</strong> {formatDate(submission.created_at)}</p>
        <StatusBadge status={submission.status} />
        <div className="admin-submission-text">{submission.story_text || <span>Loading message…</span>}</div>
        <p>Read and assess the message respectfully. Ask for separate, informed permission before publishing any story.</p>
        <div className="admin-editor-actions">
          <button className="button button--line" type="button" onClick={() => void submitStoryAction(submission, 'rejected')}>Decline</button>
          <button className="button button--fill" type="button" onClick={() => void submitStoryAction(submission, 'approved')}>Mark for follow-up</button>
        </div>
      </div>
    </Drawer>}

    {revisions && <Drawer title="Earlier versions" onClose={() => setRevisions(null)}>
      {revisionLoading ? <p role="status">Loading version history…</p> : !revisions.rows.length
        ? <EmptyState title="No earlier versions yet">Each saved change will be listed here.</EmptyState>
        : <ol className="admin-revision-list">{revisions.rows.map(revision => <li key={revision.id}>
          <div><strong>{formatDate(revision.created_at)}</strong><small>Saved by {revision.user_id || 'staff member'}</small></div>
          <button className="button button--line" type="button" onClick={() => setConfirm({ kind: 'restore', revision })}>Restore this version</button>
        </li>)}</ol>}
    </Drawer>}

    {auditDetail && <Drawer title="Change details" onClose={() => setAuditDetail(null)}>
      <div className="admin-audit-detail">
        <p><strong>Action:</strong> {auditDetail.action}</p><p><strong>Type:</strong> {auditDetail.table_name}</p>
        <p><strong>Item:</strong> {auditDetail.row_id}</p><p><strong>When:</strong> {formatDate(auditDetail.created_at)}</p>
        <h3>Before</h3><pre>{JSON.stringify(auditDetail.before_data, null, 2) ?? 'No previous version'}</pre>
        <h3>After</h3><pre>{JSON.stringify(auditDetail.after_data, null, 2) ?? 'No saved details'}</pre>
      </div>
    </Drawer>}

    {confirm && <ConfirmDialog
      title={confirm.kind === 'archive' ? 'Archive this content?' : confirm.kind === 'delete' ? 'Permanently delete this item?' : confirm.kind === 'media-delete' ? 'Permanently delete this image?' : confirm.kind === 'restore' ? 'Restore this earlier version?' : 'Leave without saving?'}
      description={confirm.kind === 'archive'
        ? 'Archived content is no longer shown on the website. You can restore it by editing and publishing it again.'
        : confirm.kind === 'delete'
          ? 'This cannot be undone. The item’s revision history will remain for accountability.'
          : confirm.kind === 'media-delete'
            ? 'This image will be removed from the media library. Existing pages using it may show a broken image.'
            : confirm.kind === 'restore'
              ? 'The current content will be saved to version history before this earlier copy is restored.'
              : 'Your unsaved changes will be discarded.'}
      confirmLabel={confirm.kind === 'archive' ? 'Archive' : confirm.kind === 'delete' || confirm.kind === 'media-delete' ? 'Delete permanently' : confirm.kind === 'restore' ? 'Restore version' : 'Leave page'}
      typedText={confirm.kind === 'delete' ? confirm.record.title ?? confirm.record.label : confirm.kind === 'media-delete' ? confirm.item.name : undefined}
      onConfirm={() => void confirmAction()}
      onCancel={() => setConfirm(null)}
    />}
    <Toast message={toast.message} type={toast.type} onDismiss={clearToast} />
  </div>
}
