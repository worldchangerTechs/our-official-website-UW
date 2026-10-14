import { useEffect, useRef } from 'react'
import { animate, onScroll, stagger } from 'animejs'
import { Button, Card, EyebrowLabel, ImageBlock } from '../components.jsx'
import SEO from '../components/SEO.jsx'
import './WhatWeDo.css'

const pillars = [
  {
    number: '01',
    id: 'awareness',
    icon: 'awareness',
    title: 'Mental-health awareness',
    description: 'We use personal stories and educational content to change the narrative around mental health and challenge stigma.',
    examples: ['Personal stories shared with permission', 'Clear, approachable educational content', 'Campaigns that challenge stigma'],
    link: '/resources',
    linkLabel: 'Explore our resources',
    image: 'oscar-omondi-pLWciVWwGVQ-unsplash.jpg',
    imageAlt: 'A crowd gathered together at a public rally',
    imagePosition: 'center 55%',
  },
  {
    number: '02',
    id: 'peer-support',
    icon: 'connection',
    title: 'Peer support',
    description: 'Peer networks connect young people with others who have similar experiences. It isn’t about fixing anyone; it’s about being there for each other.',
    examples: ['Making time to listen without judgement', 'Sharing connection with people who understand', 'Knowing when to help someone find more support'],
    link: '/get-support',
    linkLabel: 'Learn about getting support',
    image: 'hassan-kibwana-fmXLB_uHIh4-unsplash.jpg',
    imageAlt: 'People seated together at a community gathering',
    imagePosition: 'center 48%',
  },
  {
    number: '03',
    id: 'mentorship',
    icon: 'mentorship',
    title: 'Mentorship',
    description: 'Guidance from trained peers and experienced partners helps young people learn, reflect, and find their next step.',
    examples: ['Guidance from trained peers', 'Learning alongside experienced partners', 'Encouragement to grow at your own pace'],
    link: '/partner',
    linkLabel: 'Explore partnership',
    image: 'justin-porter-hZCsLN3Y49c-unsplash.jpg',
    imageAlt: 'A community group gathered outdoors',
    imagePosition: 'center 47%',
  },
  {
    number: '04',
    id: 'self-acceptance',
    icon: 'selfAcceptance',
    title: 'Self-acceptance',
    description: 'We bring together tools, stories, and resources that encourage people to embrace who they are.',
    examples: ['Gentle prompts for reflection', 'Stories that make space for different experiences', 'Resources for practising self-kindness'],
    link: '/self-acceptance-hub',
    linkLabel: 'Visit the Self-Acceptance Hub',
    image: 'oscar-omondi-pLWciVWwGVQ-unsplash.jpg',
    imageAlt: 'Young people standing together in a crowd',
    imagePosition: 'center 42%',
  },
  {
    number: '05',
    id: 'community-referrals',
    icon: 'referrals',
    title: 'Community connection and referrals',
    description: 'We help people find connection and link them with campus counselling and qualified professional support when it is needed.',
    examples: ['Finding the right campus support contact', 'Connecting with qualified professionals', 'Making space for trusted community relationships'],
    link: '/get-support',
    linkLabel: 'Find support information',
    image: 'hassan-kibwana-fmXLB_uHIh4-unsplash.jpg',
    imageAlt: 'People listening together at a community gathering',
    imagePosition: 'center 40%',
  },
]

const waysOfWorking = [
  {
    number: '01',
    icon: 'chapters',
    title: 'Community Chapters',
    description: 'Local chapters led by passionate team leaders who understand and grow with their communities.',
  },
  {
    number: '02',
    icon: 'workshops',
    title: 'Workshops & Seminars',
    description: 'Welcoming learning spaces exploring coping with anxiety, mindfulness, and understanding mental health.',
  },
  {
    number: '03',
    icon: 'connection',
    title: 'Peer Support Networks',
    description: 'Connections that make it easier to listen, share, and be alongside one another.',
  },
  {
    number: '04',
    icon: 'awareness',
    title: 'Awareness Campaigns',
    description: 'Personal stories and educational content that invite more open, stigma-free conversations.',
  },
]

const iconPaths = {
  awareness: <><path d="M4 5.5h16v13H4z" /><path d="M8 9h8M8 12h8M8 15h5" /></>,
  connection: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2.5 19c.4-3 2.3-4.5 5.5-4.5s5.1 1.5 5.5 4.5M14 15c3.8-.7 6.3.8 7 3.5" /></>,
  mentorship: <><path d="M12 3 4 7v5c0 4.5 3.2 7.5 8 9 4.8-1.5 8-4.5 8-9V7l-8-4Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
  selfAcceptance: <><path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 8.8 1.7Z" /><path d="M7.5 11.5h2l1-2 2 4 1-2h3" /></>,
  referrals: <><circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="m9 11 6-4M9 13l6 4" /></>,
  chapters: <><path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" /></>,
  workshops: <><path d="M4 5h16v11H4zM8 20h8M12 16v4" /><path d="M8 9h8M8 12h5" /></>,
}

function Icon({ name }) {
  return <svg className="what-we-do__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

function PillarRow({ pillar, index }) {
  return (
    <article className="what-we-do__pillar" id={pillar.id} data-pillar-row={index}>
      <div className="what-we-do__media" data-pillar-image style={{ '--image-position': pillar.imagePosition }}>
        {/* CONFIRM CONSENT before publishing this photo of people. */}
        <ImageBlock
          name={pillar.image}
          alt={pillar.imageAlt}
          className="what-we-do__photo"
          sizes="(max-width: 760px) 100vw, 50vw"
        />
        <span className="what-we-do__photo-number" aria-hidden="true">{pillar.number}</span>
      </div>
      <div className="what-we-do__copy" data-pillar-copy>
        <EyebrowLabel>{pillar.number} / OUR PILLARS</EyebrowLabel>
        <div className="what-we-do__pillar-title">
          <span className="what-we-do__pillar-icon"><Icon name={pillar.icon} /></span>
          <h3>{pillar.title}</h3>
        </div>
        <p className="what-we-do__description">{pillar.description}</p>
        <div className="what-we-do__examples">
          <h4>What this can look like</h4>
          <ul>{pillar.examples.map(example => <li key={example}>{example}</li>)}</ul>
        </div>
        <Button to={pillar.link} variant="line">{pillar.linkLabel}</Button>
      </div>
    </article>
  )
}

export default function WhatWeDo() {
  const rowsRef = useRef(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reduceData = navigator.connection?.saveData === true
    if (!rowsRef.current || reduceMotion || reduceData) return undefined

    const observers = []
    const animations = []
    const rows = rowsRef.current.querySelectorAll('[data-pillar-row]')

    rows.forEach((row, index) => {
      const image = row.querySelector('[data-pillar-image]')
      const text = row.querySelectorAll('[data-pillar-copy] > *')
      const wipeFrom = index % 2 === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'

      image.style.clipPath = wipeFrom
      text.forEach(element => {
        element.style.opacity = '0'
        element.style.transform = 'translateY(16px)'
      })

      let played = false
      observers.push(onScroll({
        target: row,
        enter: 'bottom 84%',
        onEnter: () => {
          if (played) return
          played = true
          animations.push(animate(image, {
            clipPath: [wipeFrom, 'inset(0 0 0 0)'],
            duration: 720,
            ease: 'outQuart',
          }))
          animations.push(animate(text, {
            opacity: [0, 1],
            translateY: [16, 0],
            delay: stagger(75, { start: 90 }),
            duration: 540,
            ease: 'outQuad',
          }))
        },
      }))
    })

    return () => {
      observers.forEach(observer => observer.revert())
      animations.forEach(animation => animation.revert())
      rows.forEach(row => {
        const image = row.querySelector('[data-pillar-image]')
        image.style.clipPath = ''
        row.querySelectorAll('[data-pillar-copy] > *').forEach(element => {
          element.style.opacity = ''
          element.style.transform = ''
        })
      })
    }
  }, [])

  return (
    <>
      <SEO title="What We Do | Unity Within" description="Learn how Unity Within builds mental-health awareness, peer connection, mentorship, self-acceptance, and referrals." />
    <div className="what-we-do">
      <header className="page-hero">
        <div className="wrap">
          <EyebrowLabel>02 / WHAT WE DO</EyebrowLabel>
          <h1>We don’t just talk about mental health. We make it a <em>priority.</em></h1>
          <p className="hero__lede">Unity Within is a youth-led community for wellbeing, self-acceptance, and belonging. Here are the ways we bring that purpose to life.</p>
        </div>
      </header>

      <section className="what-we-do__pillars wrap" aria-labelledby="what-we-do-pillars-title" ref={rowsRef}>
        <div className="what-we-do__section-heading">
          <EyebrowLabel>01 / FIVE PILLARS</EyebrowLabel>
          <h2 id="what-we-do-pillars-title">Care takes many forms.</h2>
          <p>Each pillar is part of a wider community—connecting people with understanding, resources, and one another.</p>
        </div>
        <div className="what-we-do__pillar-list">
          {pillars.map((pillar, index) => <PillarRow key={pillar.id} pillar={pillar} index={index} />)}
        </div>
      </section>

      <section className="what-we-do__how section" aria-labelledby="what-we-do-how-title">
        <div className="wrap">
          <EyebrowLabel>02 / HOW WE WORK</EyebrowLabel>
          <h2 id="what-we-do-how-title">A community built together.</h2>
          <p className="what-we-do__section-intro">From local leadership to shared learning, we create welcoming ways for people to connect and grow.</p>
          <div className="what-we-do__ways">
            {waysOfWorking.map(item => (
              <Card className="what-we-do__way" key={item.number}>
                <span className="what-we-do__way-number">{item.number}</span>
                <span className="what-we-do__way-icon"><Icon name={item.icon} /></span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="what-we-do__spotlight section" aria-labelledby="what-we-do-spotlight-title">
        <div className="wrap">
          <EyebrowLabel>03 / PROGRAMME SPOTLIGHT</EyebrowLabel>
          <Card className="what-we-do__programme">
            <div className="what-we-do__programme-mark" aria-hidden="true"><Icon name="connection" /></div>
            <div>
              <p className="what-we-do__programme-label">ONE PROGRAMME WITHIN UNITY WITHIN</p>
              <h2 id="what-we-do-spotlight-title">Peer-to-Peer Support Training</h2>
              <p>Practical learning in listening, understanding boundaries, and connecting someone with more support when needed. Peer support is not therapy or emergency care.</p>
              <Button to="/peer-training">Explore the programme</Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="what-we-do__cta section" aria-labelledby="what-we-do-cta-title">
        <div className="wrap">
          <EyebrowLabel>04 / TAKE A NEXT STEP</EyebrowLabel>
          <h2 id="what-we-do-cta-title">There’s a place for you here.</h2>
          <div className="what-we-do__cta-actions">
            <Button to="/get-support">Get Support</Button>
            <Button to="/contact" variant="line">Get Involved</Button>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
