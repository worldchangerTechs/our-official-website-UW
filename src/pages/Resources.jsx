import { useEffect, useMemo, useRef, useState } from 'react'
import { animate } from 'animejs'
import SEO from '../components/SEO.jsx'
import { Card, EyebrowLabel, Section } from '../components.jsx'
import './Resources.css'

const categories = ['All', 'Guides', 'Helplines', 'Self-care tools', 'Campus counselling', 'Referral contacts']
const tools = [
  {
    category: 'Self-care tools',
    title: 'A short breathing pause',
    description: 'Let your breathing stay comfortable. Try a gentle four-count in, a four-count out, and repeat at a pace that feels okay. You can stop at any time.',
  },
  {
    category: 'Self-care tools',
    title: 'Notice what is around you',
    description: 'Pause and name a few things you can see, hear, and feel. Take your time, and skip anything that does not feel comfortable.',
  },
]

function BreathingGuide() {
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState('Ready when you are')
  const orbRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!running) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reducedData = navigator.connection?.saveData === true
    if (reducedMotion || reducedData) {
      setPhase('Follow the steps below at your own pace')
      return undefined
    }

    let cancelled = false
    let timer
    const wait = duration => new Promise(resolve => { timer = window.setTimeout(resolve, duration) })
    const guide = async () => {
      while (!cancelled && orbRef.current) {
        setPhase('Breathe in gently for four counts')
        animationRef.current = animate(orbRef.current, { scale: [1, 1.18], duration: 4000, ease: 'inOutSine' })
        await animationRef.current
        if (cancelled) break
        setPhase('Pause for four counts, if comfortable')
        await wait(4000)
        if (cancelled) break
        setPhase('Breathe out gently for four counts')
        animationRef.current = animate(orbRef.current, { scale: [1.18, 1], duration: 4000, ease: 'inOutSine' })
        await animationRef.current
      }
    }
    guide()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      animationRef.current?.revert()
      animationRef.current = null
    }
  }, [running])

  return <Card className="resource-card breathing-guide">
    <EyebrowLabel>SELF-CARE TOOL</EyebrowLabel>
    <h3>A short breathing pause</h3>
    <div className="breathing-orb" ref={orbRef} aria-hidden="true" />
    <p className="breathing-phase" role="status" aria-live="polite">{phase}</p>
    <button className="button button--line" type="button" onClick={() => setRunning(value => !value)}>{running ? 'Pause guide' : 'Start guide'}</button>
    <ol className="breathing-steps">
      <li>Breathe in gently for four counts.</li>
      <li>Pause for four counts, if comfortable.</li>
      <li>Breathe out gently for four counts.</li>
    </ol>
    <p>If focusing on breathing feels uncomfortable, stop and choose another activity. You can also simply notice things around you.</p>
  </Card>
}

export default function Resources() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const results = useMemo(() => tools.filter(item =>
    (category === 'All' || item.category === category) &&
    `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [category, query])

  return <>
    <SEO title="Resources | Unity Within" description="Explore mental health information, self-care tools, and ways to find professional support." />
    <header className="page-hero resources-hero">
      <div className="wrap">
        <EyebrowLabel>11 / RESOURCES</EyebrowLabel>
        <h1>Small steps toward the support you <em>need</em>.</h1>
        <p className="hero__lede">A few gentle tools to explore at your own pace. You can stop or skip any activity.</p>
      </div>
    </header>
    <Section className="resources-library">
      <EyebrowLabel>01 / EXPLORE RESOURCES</EyebrowLabel>
      <h2>Find a starting point.</h2>
      <label className="resources-search">
        <span>Search resources</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <div className="resources-filters" role="group" aria-label="Filter resources by category">
        {categories.map(item => <button type="button" className={`button ${category === item ? 'button--fill' : 'button--line'}`} aria-pressed={category === item} key={item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="resources-results" aria-live="polite">
        {category === 'All' || category === 'Self-care tools'
          ? <>
            {results.map(item => item.title === 'A short breathing pause'
              ? <BreathingGuide key={item.title} />
              : <Card key={item.title} className="resource-card"><EyebrowLabel>{item.category}</EyebrowLabel><h3>{item.title}</h3><p>{item.description}</p></Card>)}
          </>
          : null}
        {!results.length && <p className="resources-empty">There are no resources in this category yet. Check back later or contact the team for help finding an appropriate service.</p>}
      </div>
    </Section>
    <Section className="resources-help">
      <EyebrowLabel>02 / PROFESSIONAL SUPPORT</EyebrowLabel>
      <Card className="resources-help-card">
        <h2>Looking for professional care?</h2>
        <p>Contact a qualified mental health professional or use an official health-service directory to find current local services. We do not publish unverified helpline numbers or contact details.</p>
        <a href="#/get-support">See Get Support options</a>
      </Card>
      <p className="resources-disclaimer">These resources support, but do not replace, professional care.</p>
    </Section>
  </>
}
