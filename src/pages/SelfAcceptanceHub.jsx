import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { animate } from 'animejs'
import SEO from '../components/SEO.jsx'
import { Accordion, Button, Card, EyebrowLabel, Section } from '../components.jsx'
import site from '../data/site.json'
import hub from '../data/hub.json'
import './SelfAcceptanceHub.css'

const tags = [
  'identity',
  'confidence',
  'belonging',
  'academic pressure',
  'relationships',
  'stigma',
]
const types = ['article', 'story', 'prompt', 'resource']

function HubArticle({ item }) {
  return <>
    <SEO title={`${item.title} – Self-Acceptance Hub | Unity Within`} description={item.summary} />
    <header className="hub-hero">
      <div className="wrap">
        <EyebrowLabel>04 / SELF-ACCEPTANCE HUB</EyebrowLabel>
        <p className="hub-article__type">{item.type}</p>
        <h1>{item.title}</h1>
        <p className="hero__lede">{item.summary}</p>
        <p className="hub-article__meta">{item.readMinutes} min read</p>
      </div>
    </header>
    <Section className="hub-article">
      <article aria-label={item.title}>
        {item.body.map((paragraph, index) => <p key={`${item.slug}-${index}`}>{paragraph}</p>)}
        <p className="hub-gentle-note">This content is for support and education, not medical advice.</p>
        <Button to="/self-acceptance-hub" variant="line">Back to the Hub</Button>
      </article>
    </Section>
  </>
}

function AffirmationCard() {
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const affirmationRef = useRef(null)
  const animationRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      animationRef.current?.revert()
    }
  }, [])

  const nextAffirmation = async () => {
    if (animating || !affirmationRef.current) return
    setAnimating(true)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reduceData = navigator.connection?.saveData === true
    if (reduceMotion || reduceData) {
      setIndex(current => (current + 1) % hub.affirmations.length)
      setAnimating(false)
      return
    }

    const outgoing = animate(affirmationRef.current, {
      opacity: [1, 0],
      scale: [1, 0.98],
      duration: 160,
      ease: 'inQuad',
    })
    animationRef.current = outgoing
    await outgoing
    if (!mountedRef.current) return

    setIndex(current => (current + 1) % hub.affirmations.length)
    const incoming = animate(affirmationRef.current, {
      opacity: [0, 1],
      scale: [0.98, 1],
      duration: 220,
      ease: 'outQuad',
    })
    animationRef.current = incoming
    await incoming
    if (mountedRef.current) {
      animationRef.current = null
      setAnimating(false)
    }
  }

  return (
    <Card className="hub-affirmation">
      <p className="hub-affirmation__text" ref={affirmationRef} aria-live="polite" aria-atomic="true">
        {hub.affirmations[index]}
      </p>
      <Button type="button" variant="line" onClick={nextAffirmation} disabled={animating}>
        Give me another
      </Button>
      <span className="hub-affirmation__count" aria-hidden="true">{index + 1} / {hub.affirmations.length}</span>
    </Card>
  )
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="hub-filter-group" role="group" aria-label={label}>
      <span className="hub-filter-label">{label}</span>
      <div className="hub-filter-options">
        <button
          type="button"
          className={`button ${value === 'all' ? 'button--fill' : 'button--line'}`}
          aria-pressed={value === 'all'}
          onClick={() => onChange('all')}
        >
          All
        </button>
        {options.map(option => (
          <button
            type="button"
            className={`button ${value === option ? 'button--fill' : 'button--line'}`}
            key={option}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function ContentLibrary() {
  const [activeTag, setActiveTag] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const filtered = hub.content.filter(item =>
    (activeTag === 'all' || item.tags.includes(activeTag)) &&
    (activeType === 'all' || item.type === activeType),
  )

  return (
    <>
      <div className="hub-filter-bar" aria-label="Filter Hub content">
        <FilterGroup label="Filter by topic" options={tags} value={activeTag} onChange={setActiveTag} />
        <FilterGroup label="Filter by content type" options={types} value={activeType} onChange={setActiveType} />
      </div>
      <div className="hub-results" aria-live="polite" aria-atomic="true">
        <p className="hub-results__count">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</p>
        <div className="hub-content-grid">
          {filtered.map(item => (
            <Card className="hub-content-card" key={item.slug}>
              <div className="hub-content-card__meta">
                <span className="hub-type-badge">{item.type}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="hub-content-card__summary">{item.summary}</p>
              <div className="hub-content-card__footer">
                <span>{item.readMinutes} min read</span>
                {item.type === 'article' && (
                  <Link className="hub-read-link" to={`/hub/${item.slug}`}>Read article</Link>
                )}
              </div>
            </Card>
          ))}
        </div>
        {!filtered.length && <p className="hub-empty">New articles, stories, and resources are being prepared. Try another filter or check back soon.</p>}
      </div>
    </>
  )
}

function HubIndex() {
  return <>
    <SEO
      title="Self-Acceptance Hub – Unity Within"
      description="Gentle prompts, stories and resources for self-acceptance, belonging and wellbeing."
    />
    <header className="page-hero hub-hero">
      <div className="wrap">
        <EyebrowLabel>04 / SELF-ACCEPTANCE HUB</EyebrowLabel>
        <h1>Be who you are, without <em>fear</em>.</h1>
        <p className="hero__lede">A gentle space for self-reflection, shared learning, and feeling more at home in yourself.</p>
      </div>
    </header>

    <Section className="hub-affirmation-section">
      <EyebrowLabel>01 / DAILY AFFIRMATION</EyebrowLabel>
      <h2>A kind reminder for today.</h2>
      <AffirmationCard />
    </Section>

    <Section className="hub-library-section">
      <EyebrowLabel>02 / EXPLORE THE LIBRARY</EyebrowLabel>
      <h2>Find a starting point that feels right.</h2>
      <p className="section-intro">Explore reflections and learning resources at your own pace.</p>
      <ContentLibrary />
    </Section>

    <Section className="hub-prompts-section">
      <EyebrowLabel>03 / LISTENING CIRCLE PROMPTS</EyebrowLabel>
      <h2>Make room for a thoughtful conversation.</h2>
      <p className="section-intro">Take turns, listen without rushing to fix, and let anyone pass on a prompt.</p>
      <Accordion items={hub.discussionPrompts.map(prompt => ({ question: prompt.title, answer: prompt.prompt }))} />
    </Section>

    <Section className="hub-submit-section">
      <EyebrowLabel>04 / CONTRIBUTE</EyebrowLabel>
      <h2>Your perspective can help someone feel less alone.</h2>
      <p className="section-intro">Use the form to prepare an email to the Unity Within team. Review the draft before sending. Nothing is published without separate permission.</p>
      <form
        className="hub-submit-form"
        onSubmit={event => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const body = [...formData.entries()].map(([key, value]) => `${key}: ${value}`).join('\n')
          const subject = encodeURIComponent('Self-Acceptance Hub contribution')
          event.currentTarget.querySelector('[role="status"]').textContent = 'Your email app should open with your draft. Review it before sending.'
          window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(body)}`
        }}
      >
        <input type="hidden" name="_subject" value="Self-Acceptance Hub contribution" />
        <label>
          What are you sharing?
          <select name="content_type" required defaultValue="">
            <option value="" disabled>Select one</option>
            <option value="story">A story</option>
            <option value="article">An article</option>
          </select>
        </label>
        <label>
          Title
          <input type="text" name="title" autoComplete="off" required maxLength={120} />
        </label>
        <label>
          Your contribution
          <textarea name="content" rows={7} required maxLength={12000} aria-describedby="hub-submit-note" />
        </label>
        <label className="hub-consent">
          <input type="checkbox" name="publication_consent" value="confirmed" required />
          <span>I confirm this is my contribution or I have permission to share it for review. I understand it will not be published without separate confirmation.</span>
        </label>
        <p id="hub-submit-note" className="hub-form-note">Please do not include private medical information or identifying details about anyone else. The draft stays in your email app unless you choose to send it.</p>
        <button className="button button--fill" type="submit">Prepare email for review</button>
        <p className="hub-form-status" role="status" aria-live="polite" />
      </form>
    </Section>

    <Section className="hub-note-section">
      <p className="hub-gentle-note">This content is for support and education, not medical advice.</p>
    </Section>
  </>
}

export default function SelfAcceptanceHub() {
  const { slug } = useParams()
  if (slug) {
    const article = hub.content.find(item => item.slug === slug && item.type === 'article')
    if (article) return <HubArticle item={article} />
    return (
      <Section className="hub-not-found">
        <EyebrowLabel>04 / SELF-ACCEPTANCE HUB</EyebrowLabel>
        <h1>This article isn’t available.</h1>
        <p>It may have moved, or it may not be an article entry.</p>
        <Button to="/self-acceptance-hub" variant="line">Back to the Hub</Button>
      </Section>
    )
  }
  return <HubIndex />
}
