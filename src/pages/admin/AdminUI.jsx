import { cloneElement, isValidElement, useEffect, useId, useMemo, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true, async: false })

export function StatusBadge({ status }) {
  const label = ({ draft: 'Draft', scheduled: 'Scheduled', published: 'Published', archived: 'Archived', open: 'Open', closed: 'Closed', new: 'New', approved: 'Approved', rejected: 'Rejected' })[status] ?? status
  return <span className={`admin-status admin-status--${status}`}>{label || 'Not set'}</span>
}

export function EmptyState({ title, children, action }) {
  return <div className="admin-empty-state">
    <span className="admin-empty-state__mark" aria-hidden="true">♡</span>
    <h3>{title}</h3>
    {children && <p>{children}</p>}
    {action}
  </div>
}

export function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    if (!message) return undefined
    const timeout = window.setTimeout(onDismiss, 4500)
    return () => window.clearTimeout(timeout)
  }, [message, onDismiss])
  if (!message) return null
  return <div className={`admin-toast admin-toast--${type}`} role={type === 'error' ? 'alert' : 'status'} aria-live={type === 'error' ? 'assertive' : 'polite'}>
    <span>{message}</span>
    <button type="button" aria-label="Dismiss notification" onClick={onDismiss}>×</button>
  </div>
}

export function Tabs({ items, active, onChange }) {
  const tabRefs = useRef([])
  const onKeyDown = event => {
    const index = items.findIndex(item => item.id === active)
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    onChange(items[next].id)
    tabRefs.current[next]?.focus()
  }
  return <div className="admin-tabs" role="tablist" aria-label="Workspace sections" onKeyDown={onKeyDown}>
    {items.map((item, index) => <button
      key={item.id}
      ref={node => { tabRefs.current[index] = node }}
      id={`admin-tab-${item.id}`}
      className={`admin-tab${active === item.id ? ' is-active' : ''}`}
      type="button"
      role="tab"
      aria-selected={active === item.id}
      aria-controls={`admin-panel-${item.id}`}
      tabIndex={active === item.id ? 0 : -1}
      onClick={() => onChange(item.id)}
    >{item.label}{item.count > 0 && <span className="admin-tab__count">{item.count}</span>}</button>)}
  </div>
}

export function FormField({ label, hint, error, required, children, className = '' }) {
  const id = useId()
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  const props = { id, 'aria-describedby': describedBy, 'aria-invalid': error ? 'true' : undefined }
  return <div className={`admin-field ${className}`}>
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    {typeof children === 'function' ? children({ ...props, describedBy, invalid: Boolean(error) })
      : isValidElement(children) ? cloneElement(children, props) : children}
    {hint && <small id={`${id}-hint`} className="admin-field__hint">{hint}</small>}
    {error && <small id={`${id}-error`} className="admin-field__error" role="alert">{error}</small>}
  </div>
}

export function SlugField({ value, onChange, error }) {
  return <FormField label="Page link" hint="Use lowercase letters, numbers, and dashes." error={error}>
    {props => <input {...props} type="text" value={value ?? ''} onChange={event => onChange(event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))} />}
  </FormField>
}

export function TagInput({ value = [], onChange, label = 'Tags' }) {
  const [draft, setDraft] = useState('')
  const add = token => {
    const clean = token.trim()
    if (clean && !value.includes(clean)) onChange([...value, clean])
    setDraft('')
  }
  return <div className="admin-tag-input">
    <label>{label}</label>
    <div className="admin-tag-input__list" aria-label={label}>
      {value.map(tag => <span className="admin-tag" key={tag}>{tag}<button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter(item => item !== tag))}>×</button></span>)}
      <input
        value={draft}
        aria-label={`Add ${label.toLowerCase()}`}
        onChange={event => setDraft(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault()
            add(draft.replace(/,$/, ''))
          } else if (event.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
        }}
        onBlur={() => draft.trim() && add(draft)}
      />
    </div>
    <small>Type a tag and press Enter.</small>
  </div>
}

const nairobiOffset = date => {
  const zoneName = new Intl.DateTimeFormat('en', { timeZone: 'Africa/Nairobi', timeZoneName: 'longOffset' })
    .formatToParts(date).find(part => part.type === 'timeZoneName')?.value ?? 'GMT+03:00'
  const match = zoneName.match(/GMT([+-])(\d{2}):?(\d{2})/)
  return match ? (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3])) : 180
}

const toNairobiInput = value => {
  if (!value) return ''
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(value))
  const part = type => parts.find(item => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`
}

export function DateTimePicker({ value, onChange, label = 'Publish date and time' }) {
  const localValue = toNairobiInput(value)
  return <FormField label={label} hint="Times use East Africa Time (Nairobi).">
    {props => <input {...props} type="datetime-local" value={localValue} onChange={event => {
      if (!event.target.value) return onChange('')
      const [datePart, timePart] = event.target.value.split('T')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hour, minute] = timePart.split(':').map(Number)
      const localAsUtc = Date.UTC(year, month - 1, day, hour, minute)
      const offset = nairobiOffset(new Date(localAsUtc))
      onChange(new Date(localAsUtc - offset * 60_000).toISOString())
    }} />}
  </FormField>
}

export function MarkdownEditor({ value = '', onChange, label = 'Page text in Markdown', describedBy, invalid = false }) {
  const [preview, setPreview] = useState(false)
  const previewHtml = useMemo(() => DOMPurify.sanitize(marked.parse(value, { async: false }), {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  }), [value])
  return <div className="admin-markdown">
    <div className="admin-markdown__toolbar" role="toolbar" aria-label="Text formatting">
      <button type="button" aria-label="Bold" onClick={() => onChange(`${value}**bold text**`)}>B</button>
      <button type="button" aria-label="Italic" onClick={() => onChange(`${value}*italic text*`)}><em>I</em></button>
      <button type="button" aria-label="Add heading" onClick={() => onChange(`${value}\n\n## Heading`)}>H2</button>
      <button type="button" aria-label="Add link" onClick={() => onChange(`${value}[link text](https://)`)}>↗</button>
      <button type="button" className="admin-markdown__preview-toggle" aria-pressed={preview} onClick={() => setPreview(value => !value)}>{preview ? 'Edit text' : 'Preview'}</button>
    </div>
    {preview
      ? <div className="admin-markdown__preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
      : <textarea value={value} onChange={event => onChange(event.target.value)} rows={10} aria-label={label} aria-describedby={describedBy} aria-invalid={invalid} />}
  </div>
}

export function ImagePicker({ value, media, onChange }) {
  const selectId = useId()
  const inputId = useId()
  return <div className="admin-image-picker">
    <label htmlFor={selectId}>Image</label>
    {value && <img src={value} alt="Selected image preview" />}
    <select id={selectId} aria-label="Choose from media library" value={value ?? ''} onChange={event => onChange(event.target.value)}>
      <option value="">Choose an image</option>
      {media.map(item => <option key={item.name} value={item.url}>{item.name}</option>)}
    </select>
    <label htmlFor={inputId} className="sr-only">Image URL or file path</label>
    <input id={inputId} type="text" value={value ?? ''} onChange={event => onChange(event.target.value)} placeholder="Or paste an image URL" />
  </div>
}

function DialogFrame({ title, children, onClose, className = '' }) {
  const frame = useRef(null)
  useEffect(() => {
    frame.current?.focus()
    const closeOnEscape = event => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !frame.current) return
      const focusable = [...frame.current.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]')]
      if (!focusable.length) return
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault()
        focusable.at(-1).focus()
      } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
        event.preventDefault()
        focusable[0].focus()
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])
  return <div className="admin-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className={`admin-dialog ${className}`} role="dialog" aria-modal="true" aria-label={title} tabIndex="-1" ref={frame}>
      <header className="admin-dialog__header"><h2>{title}</h2><button type="button" aria-label="Close" onClick={onClose}>×</button></header>
      {children}
    </section>
  </div>
}

export function Drawer({ title, children, onClose, className = '' }) {
  return <DialogFrame title={title} onClose={onClose} className={`admin-drawer ${className}`}>{children}</DialogFrame>
}

export function ConfirmDialog({ title, description, confirmLabel = 'Confirm', typedText, onConfirm, onCancel }) {
  const [typed, setTyped] = useState('')
  return <DialogFrame title={title} onClose={onCancel} className="admin-confirm">
    <p>{description}</p>
    {typedText && <FormField label={`Type ${typedText} to confirm`}>
      {props => <input {...props} autoComplete="off" value={typed} onChange={event => setTyped(event.target.value)} />}
    </FormField>}
    <div className="admin-dialog__actions">
      <button className="button button--line" type="button" onClick={onCancel}>Cancel</button>
      <button className="button button--fill admin-danger-button" type="button" disabled={Boolean(typedText && typed !== typedText)} onClick={onConfirm}>{confirmLabel}</button>
    </div>
  </DialogFrame>
}

export function DataTable({ rows, columns, rowKey = 'id', statusKey = 'content_status', onEdit, onArchive, onDelete, onHistory, canDelete }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState({ key: columns[0]?.key ?? rowKey, direction: 'asc' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const pageSize = 10
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter(row => (status === 'all' || row[statusKey] === status) &&
      (!needle || columns.some(column => String(row[column.key] ?? '').toLowerCase().includes(needle))))
      .sort((a, b) => {
        const left = a[sort.key] ?? ''
        const right = b[sort.key] ?? ''
        const compared = typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' })
        return compared * (sort.direction === 'asc' ? 1 : -1)
      })
  }, [rows, query, status, statusKey, columns, sort])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)
  const visibleIds = pageRows.map(row => row[rowKey])
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selected.includes(id))
  const toggleSort = key => setSort(current => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))
  const archiveSelected = () => onArchive?.(selected.filter(id => rows.some(row => row[rowKey] === id)))

  useEffect(() => setPage(1), [query, status])

  return <div className="admin-table-wrap">
    <div className="admin-table-tools">
      <label className="admin-search"><span className="sr-only">Search items</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search…" /></label>
      <label className="admin-status-filter"><span className="sr-only">Filter by status</span><select value={status} onChange={event => setStatus(event.target.value)}>
        <option value="all">All statuses</option>
        {['draft', 'scheduled', 'published', 'archived', 'new', 'approved', 'rejected'].map(item => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
      </select></label>
    </div>
    {selected.length > 0 && <div className="admin-bulk-actions" role="status">
      <span>{selected.length} selected</span>
      <button className="button button--line" type="button" onClick={archiveSelected}>Archive selected</button>
      <button type="button" onClick={() => setSelected([])}>Clear selection</button>
    </div>}
    {!filtered.length
      ? <EmptyState title={rows.length ? 'No matching items' : 'Nothing here yet'}>{rows.length ? 'Try another search or status filter.' : 'When you add content, it will appear here.'}</EmptyState>
      : <table className="admin-table">
        <thead><tr>
          <th scope="col"><input type="checkbox" aria-label="Select all items on this page" checked={allVisibleSelected} onChange={event => setSelected(event.target.checked ? [...new Set([...selected, ...visibleIds])] : selected.filter(id => !visibleIds.includes(id)))} /></th>
          {columns.map(column => <th scope="col" key={column.key}><button className="admin-sort-button" type="button" onClick={() => toggleSort(column.key)}>{column.label}{sort.key === column.key ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}</button></th>)}
          <th scope="col">Actions</th>
        </tr></thead>
        <tbody>{pageRows.map(row => <tr key={row[rowKey]}>
          <td><input type="checkbox" aria-label={`Select ${row[columns[0]?.key] ?? 'item'}`} checked={selected.includes(row[rowKey])} onChange={event => setSelected(event.target.checked ? [...selected, row[rowKey]] : selected.filter(id => id !== row[rowKey]))} /></td>
          {columns.map(column => <td key={column.key}>{column.render ? column.render(row) : row[column.key] || '—'}</td>)}
          <td className="admin-table__actions">
            {onEdit && <button type="button" onClick={() => onEdit(row)}>Edit</button>}
            {onHistory && <button type="button" onClick={() => onHistory(row)}>History</button>}
            {onArchive && row[statusKey] !== 'archived' && <button type="button" onClick={() => onArchive([row[rowKey]])}>Archive</button>}
            {canDelete && onDelete && <button className="admin-text-danger" type="button" onClick={() => onDelete(row)}>Delete</button>}
          </td>
        </tr>)}</tbody>
      </table>}
    <div className="admin-pagination">
      <span>{filtered.length ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}` : '0 items'}</span>
      <div><button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => setPage(value => value + 1)}>Next</button></div>
    </div>
  </div>
}
