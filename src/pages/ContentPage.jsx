import { Button, Card, EyebrowLabel, ImageBlock, Section } from '../components.jsx'
import SEO from '../components/SEO.jsx'
import content from '../data/content.json'
import events from '../data/events.json'
import site from '../data/site.json'

const pageTitles = {
  story: 'Our Story',
  events: 'Events',
  training: 'Peer-to-Peer Support Training',
}

const trainingModules = [
  ['01', 'Listen with care', 'Make space for someone to share without rushing to fix things.'],
  ['02', 'Respect boundaries', 'Understand what peer supporters can and cannot offer.'],
  ['03', 'Protect privacy', 'Handle personal information with care and follow safeguarding guidance.'],
  ['04', 'Connect to more help', 'Recognize when a concern needs qualified professional support.'],
]

function EventList() {
  if (!events.length) return <p className="note">There are no upcoming events to share right now. Check back for future activities.</p>
  return <div className="event-gallery">{events.map(event => <Card key={event.id} className="event-tile">
    {/* CONFIRM CONSENT */}
    <ImageBlock name={event.image} alt={event.description} />
    <span><strong>{event.title}</strong><small>{event.date}</small><p>{event.description}</p></span>
  </Card>)}</div>
}

export function ContentPage({ type }) {
  const page = content[type]
  if (!page) return null
  const title = pageTitles[type] ?? page.eyebrow
  return <>
    <SEO title={`${title} | Unity Within`} description={page.intro} />
    <header className="page-hero">
      <div className="wrap"><EyebrowLabel>{page.eyebrow}</EyebrowLabel><h1>{page.title}</h1><p className="hero__lede">{page.intro}</p></div>
    </header>
    {page.image && <Section className="page-image-section"><div className="page-image-wrap">
      {/* CONFIRM CONSENT */}
      <ImageBlock name={page.image} alt={page.imageAlt} sizes="(max-width: 720px) 100vw, 920px" />
    </div></Section>}
    {type === 'story' && <Section className="page-content">
      <EyebrowLabel>01 / OUR PURPOSE</EyebrowLabel>
      <h2>Unity begins with how we show up for one another.</h2>
      <p>We are a youth-led mental health organization built around listening, peer connection, self-acceptance, and pathways to professional care.</p>
      <p>Our work is grounded in respect, inclusion, privacy, and clear boundaries. Peer support offers connection; it is not therapy or emergency care.</p>
      <Card className="founder-card"><EyebrowLabel>FOUNDER</EyebrowLabel><h3>{site.founder}</h3></Card>
      <Button to="/what-we-do">Explore what we do</Button>
    </Section>}
    {type === 'events' && <Section className="page-content">
      <EyebrowLabel>01 / UPCOMING ACTIVITIES</EyebrowLabel>
      <h2>Make space to connect and learn.</h2>
      <EventList />
      <Button to="/contact" variant="line">Ask about activities</Button>
    </Section>}
    {type === 'training' && <Section className="page-content">
      <EyebrowLabel>01 / ONE PROGRAMME WITHIN UNITY WITHIN</EyebrowLabel>
      <h2>Learn the skills and boundaries of peer support.</h2>
      <p className="section-intro">Peer-to-Peer Support Training is one programme within Unity Within. It focuses on listening, role boundaries, privacy, and connecting someone with further support. It is not clinical training.</p>
      <div className="module-grid">{trainingModules.map(([number, heading, description]) => <Card key={number}><EyebrowLabel>{number} / LEARNING AREA</EyebrowLabel><h3>{heading}</h3><p>{description}</p></Card>)}</div>
      <Button to="/volunteer">Explore volunteering</Button>
    </Section>}
  </>
}
