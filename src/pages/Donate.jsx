import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import { Accordion, Button, Card, DonateButton, EyebrowLabel, Section } from '../components.jsx'
import needs from '../data/needs.json'
import site from '../data/site.json'
import './Donate.css'

const givingFaq = [
  { question: 'How do I request a receipt?', answer: `After confirming payment details with Unity Within, contact ${site.email} or message the team on WhatsApp with your transaction reference. Do not share PINs, passwords, or full financial credentials.` },
  { question: 'Can I give in kind?', answer: 'Yes. Useful contributions may include printed guides, a venue, refreshments, transport, or training materials. Please contact the team first to agree what is needed and how delivery will work.' },
  { question: 'Can my organization support a programme?', answer: 'Yes. Contact the team to discuss a partnership and agree the purpose, scope, and reporting before making a contribution.' },
  { question: 'How do I avoid scams?', answer: 'Confirm all payment details through an official Unity Within channel before sending money. Do not rely on unsolicited requests or details shared by an unverified individual.' },
]

function CopyButton({ value, label }) {
  const [status, setStatus] = useState('')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus(`${label} copied.`)
    } catch {
      setStatus(`Copy was unavailable. Select and copy ${value} manually.`)
    }
  }
  return <div className="donate-copy-control">
    <button className="button button--line" type="button" onClick={copy}>Copy {label.toLowerCase()}</button>
    <p className="donate-copy-status" role="status" aria-live="polite">{status}</p>
  </div>
}

function NeedCard({ need }) {
  const hasTarget = Number.isFinite(need.targetAmount) && need.targetAmount > 0
  const hasRaised = Number.isFinite(need.raisedAmount) && need.raisedAmount >= 0
  const progress = hasTarget && hasRaised ? Math.min(100, Math.round((need.raisedAmount / need.targetAmount) * 100)) : null
  return <Card className="donate-need-card">
    <EyebrowLabel>{need.category}</EyebrowLabel>
    <h3>{need.title}</h3>
    <p>{need.description}</p>
    {progress !== null && <div className="donate-progress">
      <div className="donate-progress__label"><span>Progress</span><span>{progress}%</span></div>
      <progress value={progress} max="100" aria-label={`${need.title} funding progress: ${progress}%`}>{progress}%</progress>
    </div>}
  </Card>
}

export default function Donate() {
  return <>
    <SEO title="Support Us | Unity Within" description="Support Unity Within's youth mental health work. Confirm payment details through an official channel before giving." />
    <header className="page-hero donate-hero">
      <div className="wrap">
        <EyebrowLabel>10 / SUPPORT US</EyebrowLabel>
        <h1>Every contribution powers hope for thousands of young minds.</h1>
        <p className="hero__lede">Your support can help create more welcoming spaces for learning, connection, and community care.</p>
      </div>
    </header>

    <Section className="donate-scam-warning" aria-labelledby="donate-scam-heading">
      <div className="donate-scam-warning__panel">
        <EyebrowLabel>BEFORE YOU GIVE</EyebrowLabel>
        <h2 id="donate-scam-heading">Confirm payment details through an official Unity Within channel to avoid scams.</h2>
        <p>No payment is processed on this website. Contact the team to confirm current details before making a payment.</p>
      </div>
    </Section>

    <Section className="donate-ways">
      <EyebrowLabel>01 / WAYS TO GIVE</EyebrowLabel>
      <h2>Choose a way to support the work.</h2>
      <div className="donate-payment-grid">
        <Card className="donate-payment-card donate-payment-card--mpesa">
          <EyebrowLabel>M-PESA / BUY GOODS</EyebrowLabel>
          <h3>Pay with M-Pesa</h3>
          <p className="donate-payment-card__number">{site.mpesaTill}</p>
          <p><strong>Till number</strong></p>
          <CopyButton value={site.mpesaTill} label="Till number" />
          <p>Confirm the till number through an official Unity Within channel before sending money.</p>
        </Card>
        <Card className="donate-payment-card">
          <EyebrowLabel>BANK PAYMENT</EyebrowLabel>
          <h3>Bank transfer</h3>
          <p className="donate-bank-summary">{site.bank.name}. Business Number {site.bank.businessNumber}. Account Number {site.bank.accountNumber}.</p>
          <dl className="donate-bank-details">
            <div><dt>Business number</dt><dd>{site.bank.businessNumber}</dd></div>
            <div><dt>Account number</dt><dd>{site.bank.accountNumber}</dd></div>
            {site.bank.accountName && <div><dt>Account name</dt><dd>{site.bank.accountName}</dd></div>}
          </dl>
          <CopyButton value={site.bank.accountNumber} label="Account number" />
          <p>Confirm the receiving institution and account details with Unity Within before transferring funds.</p>
        </Card>
        <Card className="donate-payment-card">
          <EyebrowLabel>IN-KIND SUPPORT</EyebrowLabel>
          <h3>Offer practical help</h3>
          <p>Useful contributions may include printed guides, venue, refreshments, transport, and training materials.</p>
          <Button href={`mailto:${site.email}?subject=In-kind%20support`}>Ask about in-kind support</Button>
        </Card>
      </div>
      <div className="donate-receipt-note">
        <h3>Payment proof and receipts</h3>
        <p>After confirming the details, ask for a receipt by emailing <a href={`mailto:${site.email}`}>{site.email}</a> or contacting the team on <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>. Share only the transaction reference; never share a PIN or password.</p>
      </div>
    </Section>

    {needs.needs.length > 0 && <Section className="donate-needs">
      <EyebrowLabel>02 / WHAT YOUR SUPPORT DOES</EyebrowLabel>
      <h2>Practical needs behind the work.</h2>
      <div className="donate-needs-grid">{needs.needs.map(need => <NeedCard key={need.id} need={need} />)}</div>
    </Section>}

    <Section className="donate-transparency">
      <EyebrowLabel>03 / TRANSPARENCY</EyebrowLabel>
      <h2>Support should come with clear information.</h2>
      <div className="donate-transparency__panel">
        <p>Contributions support agreed community activities and documented needs. Contact the team before giving to confirm the intended use and reporting arrangements for your contribution.</p>
        <p>Do not send money until payment details and the purpose of the contribution have been confirmed through an official Unity Within channel.</p>
      </div>
    </Section>

    <Section className="donate-other-ways">
      <EyebrowLabel>04 / OTHER WAYS TO HELP</EyebrowLabel>
      <h2>Support is more than a payment.</h2>
      <div className="donate-other-grid">
        <Card><h3>Volunteer</h3><p>Share time and skills in a role that fits your interests and boundaries.</p><Button to="/volunteer" variant="line">Explore volunteering</Button></Card>
        <Card><h3>Share stories</h3><p>Read and share community stories only when contributors have given permission.</p><Button to="/stories" variant="line">Visit Stories</Button></Card>
        <Card><h3>Spread the word</h3><p>Help others find Unity Within’s learning and community information.</p><Button to="/contact" variant="line">Connect with us</Button></Card>
      </div>
    </Section>

    <Section className="donate-faq">
      <EyebrowLabel>05 / FREQUENTLY ASKED QUESTIONS</EyebrowLabel>
      <Accordion items={givingFaq} />
      <div className="donate-final-cta"><DonateButton>Support Unity Within</DonateButton></div>
    </Section>
  </>
}
