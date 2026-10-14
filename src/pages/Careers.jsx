import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, EyebrowLabel, Section } from '../components.jsx'
import SEO from '../components/SEO.jsx'
import careers from '../data/careers.json'
import './Careers.css'

export default function Careers() {
  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const openRoles = careers.filter(role => role.status === 'open')

  return (
    <>
      <SEO title="Careers & Opportunities | Unity Within" description="Join Unity Within as a volunteer, leader, researcher or collaborator to help young people feel heard and supported." />
      <header className="page-hero careers-hero">
        <div className="wrap">
          <EyebrowLabel>13 / CAREERS &amp; OPPORTUNITIES</EyebrowLabel>
          <h1>Help young people feel <em>heard</em>.</h1>
          <p>Unity Within is a youth‑led mental health organization. Join us to listen, support and connect.</p>
        </div>
      </header>
      <Section className="careers-grid">
        {openRoles.map(role => (
          <Card key={role.slug} className="career-card">
            <h3>{role.title}</h3>
            <p>{role.summary}</p>
            <Button to={`/careers/${role.slug}`} variant="line">See role details</Button>
          </Card>
        ))}
      </Section>
    </>
  )
}

