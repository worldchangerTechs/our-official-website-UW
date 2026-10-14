import { useEffect, useRef } from 'react'
import SEO from '../components/SEO.jsx'
import { Accordion, Button, Card, EyebrowLabel, Section } from '../components.jsx'
import site from '../data/site.json'
import './Volunteer.css'

const volunteerRoles = [
  {
    title: 'Peer Supporter',
    description: 'Offer a listening ear and help fellow students find appropriate next steps.',
    checklist: ['Practise listening without judgement', 'Respect privacy and personal boundaries', 'Refer concerns beyond your role'],
  },
  {
    title: 'Chapter Lead',
    description: 'Help a local chapter bring students together around care, learning, and belonging.',
    checklist: ['Coordinate with a local team', 'Help plan welcoming activities', 'Build connections with campus services'],
  },
  {
    title: 'Event Volunteer',
    description: 'Help make workshops, conversations, and community gatherings feel welcoming.',
    checklist: ['Support event set-up and hosting', 'Help participants feel included', 'Follow event and safeguarding guidance'],
  },
  {
    title: 'Trainer / Guide',
    description: 'Contribute relevant experience to safe, practical peer-support learning.',
    checklist: ['Share relevant experience or skills', 'Support clear boundaries in training', 'Work alongside the Unity Within team'],
  },
  {
    title: 'Creative / Media Volunteer',
    description: 'Help share stigma-free messages through thoughtful creative work.',
    checklist: ['Create accessible, respectful content', 'Get consent before sharing identifiable stories or images', 'Follow brand and editorial guidance'],
  },
]

const applicationSteps = [
  { number: '01', title: 'Apply', description: 'Tell us which volunteer role interests you and what you would like to contribute.' },
  { number: '02', title: 'Conversation', description: 'If applications are open, the team can discuss the role, expectations, and questions with you.' },
  { number: '03', title: 'Training', description: 'Relevant volunteers receive role-appropriate preparation before taking on activities.' },
  { number: '04', title: 'Start supporting', description: 'Begin with the team, within your agreed role and the support arrangements confirmed with you.' },
]

const conductItems = [
  {
    title: 'Confidentiality',
    description: 'Treat personal information with care. Explain the limits of confidentiality and follow the organization’s safeguarding and reporting procedures.',
  },
  {
    title: 'No diagnosing or treatment',
    description: 'Do not diagnose, prescribe, provide therapy, or present peer support as professional care.',
  },
  {
    title: 'Refer when in doubt',
    description: 'Ask the designated supervisor for guidance and connect someone to appropriate campus or professional support when a concern is beyond your role.',
  },
  {
    title: 'Respect and inclusion',
    description: 'Treat people with dignity, use respectful language, and welcome differences in identity, background, and experience.',
  },
  {
    title: 'Healthy boundaries',
    description: 'Be clear about your role, availability, and limits. Do not promise outcomes or take responsibility for another person’s decisions.',
  },
  {
    title: 'Safeguarding',
    description: 'Follow the organization’s safeguarding guidance, raise concerns through the agreed channels, and seek immediate qualified help in an emergency.',
  },
]

const volunteerFaq = [
  {
    question: 'Do I need previous experience?',
    answer: 'Role requirements and preparation depend on the opportunity. Ask the team about the specific role before committing.',
  },
  {
    question: 'How much time will volunteering take?',
    answer: 'Time commitments vary by role. Ask the team about the expected schedule before applying.',
  },
  {
    question: 'Will I receive training and supervision?',
    answer: 'Before starting, volunteers should agree their role limits, preparation, supervision, and escalation contacts with the team.',
  },
  {
    question: 'Can I volunteer remotely?',
    answer: 'Available locations and formats depend on the role. Ask the team what is currently available.',
  },
  {
    question: 'Does a peer supporter provide therapy?',
    answer: 'No. Peer support is not therapy, diagnosis, treatment, or emergency care. Volunteers listen within their role and refer concerns they are not equipped to support.',
  },
  {
    question: 'Is the application form active?',
    answer: 'Use the application link for your role or email the team to discuss another way to contribute.',
  },
]

function ApplicationProcess() {
  const processRef = useRef(null)

  useEffect(() => {
    const root = processRef.current
    const line = root?.querySelector('.volunteer-process__line-fill')
    if (!root || !line) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData === true) return undefined

    let animation
    let mounted = true
    const observer = new IntersectionObserver(async entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      line.style.transform = 'scaleX(0)'
      const { animate } = await import('animejs')
      if (!mounted) return
      animation = animate(line, {
        scaleX: [0, 1],
        duration: 850,
        ease: 'outExpo',
      })
    }, { threshold: 0.2 })
    observer.observe(root)

    return () => {
      mounted = false
      observer.disconnect()
      animation?.revert()
      line.style.transform = ''
    }
  }, [])

  return (
    <div className="volunteer-process" ref={processRef}>
      <div className="volunteer-process__line" aria-hidden="true">
        <span className="volunteer-process__line-fill" />
      </div>
      <ol className="volunteer-process__steps">
        {applicationSteps.map(step => (
          <li className="volunteer-process__step" key={step.number}>
            <span className="volunteer-process__number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Volunteer() {
  const applicationHref = role => {
    if (role === 'Peer Supporter') return site.jotform.peerSupporter
    if (role === 'Trainer / Guide') return site.jotform.trainer
    return `mailto:${site.email}?subject=${encodeURIComponent(`Volunteer interest: ${role}`)}`
  }

  return (
    <>
      <SEO
        title="Volunteer – Get Involved | Unity Within"
        description="Explore ways to volunteer with Unity Within, understand role expectations, and review the code of conduct."
      />
      <header className="page-hero volunteer-hero">
        <div className="wrap">
          <EyebrowLabel>08 / GET INVOLVED</EyebrowLabel>
          <h1>Be someone's reason to feel <em>heard</em>.</h1>
          <p className="hero__lede">Help build a more connected youth community through peer support, events, learning, creative work, and local chapters.</p>
          <p className="volunteer-hero__note">Ask the team about role scope and time commitments before deciding whether to apply.</p>
        </div>
      </header>

      <Section className="volunteer-roles">
        <EyebrowLabel>01 / WAYS TO VOLUNTEER</EyebrowLabel>
        <h2>Find a role that feels right for you.</h2>
        <p className="section-intro">Choose a role to apply through its form or contact the team about other ways to contribute.</p>
        <div className="volunteer-role-grid">
          {volunteerRoles.map((role, index) => (
            <Card className="volunteer-role-card" key={role.title}>
              <EyebrowLabel>{String(index + 1).padStart(2, '0')} / ROLE</EyebrowLabel>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <ul className="volunteer-checklist">
                {role.checklist.map(item => <li key={item}>{item}</li>)}
              </ul>
              <Button href={applicationHref(role.title)} target={role.title === 'Peer Supporter' || role.title === 'Trainer / Guide' ? '_blank' : undefined} rel={role.title === 'Peer Supporter' || role.title === 'Trainer / Guide' ? 'noreferrer' : undefined} variant="line">Apply for this role</Button>
            </Card>
          ))}
        </div>
        <p className="volunteer-links-note">For roles without a dedicated application form, the button opens an email draft to the Unity Within team.</p>
      </Section>

      <Section className="volunteer-process-section">
        <EyebrowLabel>02 / APPLICATION PROCESS</EyebrowLabel>
        <h2>What happens next.</h2>
        <p className="section-intro">The steps and preparation for each role are discussed with applicants before they begin.</p>
        <ApplicationProcess />
      </Section>

      <Section className="volunteer-expectations">
        <EyebrowLabel>03 / EXPECTATIONS AND TIME</EyebrowLabel>
        <h2>Clear expectations help everyone.</h2>
        <div className="volunteer-facts" aria-label="Volunteer expectations">
          {[
            ['Time commitment', 'Agreed for each role'],
            ['Preparation', 'Discussed before starting'],
            ['Boundaries', 'Clear and role-specific'],
            ['Support', 'Agree who to contact'],
          ].map(([label, value]) => (
            <div className="volunteer-fact" key={label}><span>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
      </Section>

      <Section className="volunteer-training">
        <EyebrowLabel>04 / TRAINING SCHEDULE</EyebrowLabel>
        <h2>Preparation before participation.</h2>
        <p className="section-intro">Training details are shared with applicants for each opportunity. Peer-support activities should not begin before volunteers understand their role, boundaries, and how to get guidance.</p>
      </Section>

      <Section className="volunteer-supervision">
        <EyebrowLabel>05 / SUPERVISION AND SUPPORT</EyebrowLabel>
        <h2>Volunteers should not have to figure it out alone.</h2>
        <div className="volunteer-support-panel">
          <p>Before volunteering, agree who to contact for guidance, how concerns are escalated, and what support is available for the role.</p>
          <ul><li>Stay within the role agreed with the team.</li><li>Ask for guidance when a situation is beyond your experience.</li><li>Know the agreed safeguarding and referral process before supporting others.</li></ul>
          <p>Do not take on a situation beyond your role. In an emergency, use local emergency services or qualified professional support; Unity Within is not an emergency service.</p>
        </div>
      </Section>

      <Section className="volunteer-conduct">
        <EyebrowLabel>06 / CODE OF CONDUCT</EyebrowLabel>
        <h2>Care, respect, and clear boundaries.</h2>
        <div className="volunteer-conduct-grid">
          {conductItems.map((item, index) => (
            <Card className="volunteer-conduct-card" key={item.title}>
              <EyebrowLabel>{String(index + 1).padStart(2, '0')} / COMMITMENT</EyebrowLabel>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="volunteer-faq">
        <EyebrowLabel>07 / FREQUENTLY ASKED QUESTIONS</EyebrowLabel>
        <h2>Before you apply.</h2>
        <Accordion items={volunteerFaq} />
      </Section>

    </>
  )
}
