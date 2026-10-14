import SEO from '../components/SEO.jsx'
import { Button, Card, EyebrowLabel, Section } from '../components.jsx'
import site from '../data/site.json'
import './Contact.css'

const contactOptions = [
  { title: 'Email', detail: site.email, href: `mailto:${site.email}`, action: 'Send an email' },
  { title: 'Call', detail: site.phone, href: `tel:${site.phone}`, action: 'Call Unity Within' },
  { title: 'WhatsApp', detail: 'Message Unity Within on WhatsApp', href: site.whatsapp, action: 'Open WhatsApp', external: true },
]

export default function Contact() {
  return <>
    <SEO title="Contact | Unity Within" description="Contact Unity Within about mental health, partnerships, volunteering, or community activities." />
    <header className="page-hero contact-hero">
      <div className="wrap">
        <EyebrowLabel>12 / CONTACT</EyebrowLabel>
        <h1>We’d love to hear from <em>you</em>.</h1>
        <p className="hero__lede">Choose an official contact option to reach the Unity Within team.</p>
      </div>
    </header>
    <Section className="contact-options-section">
      <EyebrowLabel>01 / CONTACT THE TEAM</EyebrowLabel>
      <h2>Start a conversation.</h2>
      <div className="contact-card-grid">
        {contactOptions.map(option => <Card className="contact-card" key={option.title}>
          <EyebrowLabel>{option.title.toUpperCase()}</EyebrowLabel>
          <h3>{option.title}</h3>
          <p>{option.detail}</p>
          <Button href={option.href} target={option.external ? '_blank' : undefined} rel={option.external ? 'noreferrer' : undefined}>
            {option.action}
          </Button>
        </Card>)}
      </div>
    </Section>
    <Section className="contact-note-section">
      <EyebrowLabel>02 / IMPORTANT</EyebrowLabel>
      <Card className="contact-note">
        <h2>Need urgent support?</h2>
        <p>For urgent support, see our Get Support page. Unity Within is not an emergency service.</p>
        <Button to="/get-support" variant="line">Get Support</Button>
      </Card>
    </Section>
  </>
}
