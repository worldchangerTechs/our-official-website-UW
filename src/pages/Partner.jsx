import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import { Button, Card, EyebrowLabel, Section } from '../components.jsx'
import partners from '../data/partners.json'
import site from '../data/site.json'
import './Partner.css'

const partnerTypes = [
  {
    name: 'Campus departments',
    offer: 'Student-led awareness activities, peer connection, and opportunities to coordinate campus support pathways.',
    ask: 'A point of contact, guidance on campus procedures, and help identifying verified referral options.',
  },
  {
    name: 'Counsellors',
    offer: 'A community partner to help students understand appropriate support options and referral boundaries.',
    ask: 'Advice on signposting, role boundaries, and how volunteers can escalate concerns safely.',
  },
  {
    name: 'Student leadership',
    offer: 'Collaborative wellbeing events, peer-led awareness, and more ways for students to feel included.',
    ask: 'Help reaching student communities, coordinating activities, and sharing verified information.',
  },
  {
    name: 'NGOs',
    offer: 'A local youth-community connection and opportunities to coordinate learning and outreach.',
    ask: 'Relevant expertise, resources, or connections that complement existing community work.',
  },
  {
    name: 'Mental-health professionals',
    offer: 'A route to share professional perspectives that strengthen boundaries and referral awareness.',
    ask: 'Guidance, training input, or consultation within an agreed and appropriate scope.',
  },
  {
    name: 'Businesses',
    offer: 'A practical way to support youth wellbeing initiatives and responsible campus activities.',
    ask: 'Resources, venue support, staff expertise, or other contributions agreed in advance.',
  },
  {
    name: 'Donors',
    offer: 'A chance to support clearly scoped community activities and receive updates on agreed use of support.',
    ask: 'Flexible or in-kind support, with expectations and reporting discussed transparently.',
  },
]

const collaborationWays = [
  { title: 'Referral partnerships', description: 'Clarify appropriate routes to campus counselling and qualified professional support.' },
  { title: 'Training facilitation', description: 'Contribute relevant experience to listening, boundaries, safeguarding, and referral learning.' },
  { title: 'Event hosting', description: 'Co-host a workshop, seminar, or awareness activity with clear roles and shared preparation.' },
  { title: 'Venue and resource support', description: 'Help make a welcoming space or practical materials available for community activities.' },
  { title: 'Research and evaluation', description: 'Collaborate on ethical, consent-aware ways to learn from activities and improve the work.' },
  { title: 'Sponsorship', description: 'Support an agreed programme or event through a transparent financial or in-kind contribution.' },
]

const sponsorshipTiers = [
  {
    title: 'Supporter',
    amount: '',
    description: 'A starting contribution toward an agreed community activity.',
    benefits: ['Acknowledgement as agreed', 'A summary of the supported activity', 'Clear information about intended use'],
  },
  {
    title: 'Champion',
    amount: '',
    description: 'Help strengthen a defined workshop, learning series, or outreach activity.',
    benefits: ['Recognition appropriate to the contribution', 'Updates on agreed activity milestones', 'A post-activity summary'],
  },
  {
    title: 'Anchor Partner',
    amount: '',
    description: 'Work with the team on sustained support for an agreed programme or community need.',
    benefits: ['A named partnership contact', 'Agreed reporting and review points', 'Recognition and collaboration plan by agreement'],
  },
]

const inKindNeeds = [
  'Printed guides',
  'Venue',
  'Refreshments',
  'Transport',
  'Facilitator costs',
]

const partnerExpectations = [
  {
    title: 'Transparency',
    description: 'Agree the purpose, scope, roles, and use of contributions before work begins.',
  },
  {
    title: 'Reporting',
    description: 'Share updates and summaries appropriate to the work, using verified activity information.',
  },
  {
    title: 'Safeguarding standards',
    description: 'Clarify safeguarding responsibilities, referral boundaries, and points of contact in advance.',
  },
  {
    title: 'Recognition',
    description: 'Discuss any recognition or logo use first; no name or mark is published without permission.',
  },
]

const collaborationOptions = [
  'Referral partnerships',
  'Training facilitation',
  'Event hosting',
  'Venue and resource support',
  'Research and evaluation',
  'Sponsorship',
  'Other',
]

function PartnerLogoGrid() {
  const approvedPartners = partners.filter(partner => partner.logo && partner.name)
  if (!approvedPartners.length) return null
  return (
    <div className="partner-logo-grid">
      {approvedPartners.map(partner => (
        <div className="partner-logo-placeholder" key={partner.id}>
          <img src={partner.logo} alt={`${partner.name} logo`} loading="lazy" decoding="async" />
          <span className="partner-logo-placeholder__name">{partner.name}</span>
        </div>
      ))}
    </div>
  )
}

export default function Partner() {
  const [partnerType, setPartnerType] = useState('')
  const [formStatus, setFormStatus] = useState('')

  const choosePartnerType = type => {
    setPartnerType(type)
    setFormStatus('')
    const form = document.getElementById('partner-enquiry')
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    form?.scrollIntoView({ behavior, block: 'start' })
    window.setTimeout(() => document.getElementById('partner-organization')?.focus({ preventScroll: true }), 300)
  }

  return (
    <>
      <SEO
        title="Partner With Us – Unity Within"
        description="Explore collaboration and sponsorship opportunities with Unity Within, a youth-led wellbeing and self-acceptance community."
      />
      <header className="page-hero partner-hero">
        <div className="wrap">
          <EyebrowLabel>09 / PARTNER WITH US</EyebrowLabel>
          <h1>Together, we rise <em>stronger</em>.</h1>
          <p className="hero__lede">We work with people and organizations who want young people to find connection, learn about mental health, and reach appropriate support.</p>
        </div>
      </header>

      <Section className="partner-audiences">
        <EyebrowLabel>01 / WHO WE WORK WITH</EyebrowLabel>
        <h2>Good work grows through thoughtful partnerships.</h2>
        <p className="section-intro">Here is how collaboration could work. Scope, availability, and partner arrangements are agreed together before anything begins.</p>
        <div className="partner-audience-grid">
          {partnerTypes.map((partner, index) => (
            <Card className="partner-audience-card" key={partner.name}>
              <EyebrowLabel>{String(index + 1).padStart(2, '0')} / PARTNER</EyebrowLabel>
              <h3>{partner.name}</h3>
              <div className="partner-audience-card__details">
                <div><h4>What we offer</h4><p>{partner.offer}</p></div>
                <div><h4>What we ask</h4><p>{partner.ask}</p></div>
              </div>
              <Button type="button" variant="line" onClick={() => choosePartnerType(partner.name)}>Enquire as {partner.name}</Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="partner-collaboration">
        <EyebrowLabel>02 / WAYS TO COLLABORATE</EyebrowLabel>
        <h2>Start with a shared purpose.</h2>
        <div className="partner-collaboration-grid">
          {collaborationWays.map((way, index) => (
            <Card className="partner-collaboration-card" key={way.title}>
              <EyebrowLabel>{String(index + 1).padStart(2, '0')} / APPROACH</EyebrowLabel>
              <h3>{way.title}</h3>
              <p>{way.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="partner-sponsorship">
        <EyebrowLabel>03 / SPONSORSHIP NEEDS</EyebrowLabel>
        <h2>Support that is clear and useful.</h2>
        <p className="section-intro">The scope, contribution, and recognition for each partnership are agreed together before work begins.</p>
        <div className="partner-sponsorship-grid">
          {sponsorshipTiers.map((tier, index) => (
            <Card className="partner-sponsorship-card" key={tier.title}>
              <EyebrowLabel>{String(index + 1).padStart(2, '0')} / TIER</EyebrowLabel>
              <h3>{tier.title}</h3>
              {tier.amount && <p className="partner-sponsorship-card__amount">{tier.amount}</p>}
              <p>{tier.description}</p>
              <ul>{tier.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
              <Button type="button" variant="line" onClick={() => choosePartnerType(`Sponsorship — ${tier.title}`)}>Discuss this tier</Button>
            </Card>
          ))}
        </div>
        <div className="partner-in-kind">
          <EyebrowLabel>IN-KIND SUPPORT</EyebrowLabel>
          <h3>Practical contributions are valuable too.</h3>
          <ul>{inKindNeeds.map(need => <li key={need}>{need}</li>)}</ul>
        </div>
      </Section>

      <Section className="partner-expectations">
        <EyebrowLabel>04 / WHAT PARTNERS CAN EXPECT</EyebrowLabel>
        <h2>Good partnerships are built on trust.</h2>
        <div className="partner-expectations-grid">
          {partnerExpectations.map((expectation, index) => (
            <Card className="partner-expectation-card" key={expectation.title}>
              <EyebrowLabel>{String(index + 1).padStart(2, '0')} / PRINCIPLE</EyebrowLabel>
              <h3>{expectation.title}</h3>
              <p>{expectation.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {partners.some(partner => partner.logo && partner.name) && <Section className="partner-current">
        <EyebrowLabel>05 / PARTNERS AND SUPPORTERS</EyebrowLabel>
        <h2>Those who help us grow.</h2>
        <PartnerLogoGrid />
      </Section>}

      <Section className="partner-enquiry" id="partner-enquiry">
        <EyebrowLabel>06 / PARTNERSHIP ENQUIRY</EyebrowLabel>
        <h2>Tell us what you have in mind.</h2>
        <p className="section-intro">Complete the details below to prepare an email to the Unity Within team. Review the message in your email app before sending it.</p>
        <form
          className="partner-enquiry-form"
          onSubmit={event => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const fields = [...formData.entries()].filter(([key]) => key !== '_subject')
            const body = fields.map(([key, value]) => `${key}: ${value}`).join('\n')
            const subject = encodeURIComponent('Unity Within partnership enquiry')
            window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(body)}`
            setFormStatus('Your email app should open with the enquiry details. Review and send the message there.')
          }}
        >
          <input type="hidden" name="_subject" value="Unity Within partnership enquiry" />
          <label htmlFor="partner-organization">Organization</label>
          <input id="partner-organization" name="organization" type="text" required minLength={2} maxLength={160} autoComplete="organization" />

          <label htmlFor="partner-contact">Contact person</label>
          <input id="partner-contact" name="contact_person" type="text" required minLength={2} maxLength={120} autoComplete="name" />

          <label htmlFor="partner-email">Contact email</label>
          <input id="partner-email" name="email" type="email" required maxLength={254} autoComplete="email" />

          <label htmlFor="partner-type">Partner type</label>
          <select id="partner-type" name="partner_type" required value={partnerType} onChange={event => setPartnerType(event.target.value)}>
            <option value="" disabled>Select a partner type</option>
            {partnerTypes.map(partner => <option key={partner.name} value={partner.name}>{partner.name}</option>)}
            {partnerType.startsWith('Sponsorship — ') && <option value={partnerType}>{partnerType}</option>}
            <option value="Other">Other</option>
          </select>

          <label htmlFor="partner-collaboration">Preferred collaboration</label>
          <select id="partner-collaboration" name="preferred_collaboration" required defaultValue="">
            <option value="" disabled>Select a collaboration</option>
            {collaborationOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>

          <label htmlFor="partner-message">Message</label>
          <textarea id="partner-message" name="message" rows={6} required minLength={20} maxLength={3000} />

          <p className="partner-enquiry-form__notice">Please do not include sensitive personal or health information. The details will be placed in an email draft on your device.</p>
          <button className="button button--fill" type="submit">Prepare email enquiry</button>
          <p className="partner-enquiry-form__status" role="status" aria-live="polite">{formStatus}</p>
        </form>
      </Section>
    </>
  )
}
