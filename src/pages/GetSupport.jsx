import SEO from '../components/SEO.jsx'
import { Accordion, Button, Card, EyebrowLabel, Section } from '../components.jsx'
import site from '../data/site.json'
import './GetSupport.css'

const supportOptions = [
  { title: 'Call', detail: site.phone, href: `tel:${site.phone}`, action: 'Call Unity Within' },
  { title: 'WhatsApp', detail: 'Message the Unity Within team', href: site.whatsapp, action: 'Open WhatsApp' },
  { title: 'Email', detail: site.email, href: `mailto:${site.email}`, action: 'Send an email' },
]

const faqItems = [
  { question: 'What kind of support does Unity Within offer?', answer: 'Unity Within offers community connection, peer listening, mental health information, and referrals to qualified support. Peer support is not therapy, diagnosis, or treatment.' },
  { question: 'Is Unity Within an emergency service?', answer: 'No. We are not an emergency service and cannot provide crisis response. If someone is in immediate danger, contact local emergency services or go to the nearest hospital.' },
  { question: 'Can I share private health information through these contact options?', answer: 'Please avoid sending sensitive health or identifying information. Email, phone, and messaging services may process information under their own privacy terms.' },
  { question: 'How quickly will I get a response?', answer: 'Response times vary. If you need urgent help, do not wait for a reply from Unity Within; contact a qualified professional or local emergency service.' },
]

export default function GetSupport() {
  return <>
    <SEO title="Get Support | Unity Within" description="Find community support and ways to connect with Unity Within. We are not a clinical or emergency service." />
    <header className="page-hero">
      <div className="wrap">
        <EyebrowLabel>GET SUPPORT</EyebrowLabel>
        <h1>You deserve to be <em>heard</em>.</h1>
        <p className="hero__lede">You can reach the Unity Within team for community connection and help finding an appropriate next step.</p>
      </div>
    </header>
    <Section className="crisis-box">
      <EyebrowLabel>URGENT HELP</EyebrowLabel>
      <h2>If you or someone else is in immediate danger, contact local emergency services or go to the nearest hospital.</h2>
      <p>Unity Within is not an emergency service. We do not provide therapy, diagnosis, or medical treatment.</p>
    </Section>
    <Section className="support-options-section">
      <EyebrowLabel>01 / CONTACT OUR TEAM</EyebrowLabel>
      <h2>Choose a way to connect.</h2>
      <div className="contact-options support-contact-options">
        {supportOptions.map(option => <Card key={option.title}>
          <EyebrowLabel>{option.title.toUpperCase()}</EyebrowLabel>
          <h3>{option.title}</h3>
          <p>{option.detail}</p>
          <Button href={option.href} target={option.title === 'WhatsApp' ? '_blank' : undefined} rel={option.title === 'WhatsApp' ? 'noreferrer' : undefined}>{option.action}</Button>
        </Card>)}
      </div>
    </Section>
    <Section className="support-boundaries">
      <EyebrowLabel>02 / WHAT TO EXPECT</EyebrowLabel>
      <div className="card-grid">
        <Card><h3>We can</h3><ul><li>Listen without judgment</li><li>Share mental health information</li><li>Help you explore appropriate professional support</li></ul></Card>
        <Card><h3>We cannot</h3><ul><li>Diagnose or provide therapy</li><li>Replace a qualified health professional</li><li>Respond to emergencies</li></ul></Card>
      </div>
    </Section>
    <Section className="faq-section">
      <EyebrowLabel>03 / FREQUENTLY ASKED QUESTIONS</EyebrowLabel>
      <Accordion items={faqItems} />
    </Section>
  </>
}
