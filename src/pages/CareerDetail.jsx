import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, EyebrowLabel, Section } from '../components.jsx'
import SEO from '../components/SEO.jsx'
import careers from '../data/careers.json'
import './CareerDetail.css'

export default function CareerDetail() {
  const { slug } = useParams()
  const role = careers.find(item => item.slug === slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  if (!role) {
    return (
      <>
        <SEO title="Role not found | Unity Within" description="This opportunity is not available right now." />
        <Section className="career-detail-empty">
          <EyebrowLabel>CAREERS</EyebrowLabel>
          <h1>This role is no longer available.</h1>
          <p>Check back for new opportunities or explore the current roles open to join Unity Within.</p>
          <Button to="/careers" variant="line">Back to careers</Button>
        </Section>
      </>
    )
  }

  const applyHref = role.applyUrl || (role.applyEmail ? `mailto:${role.applyEmail}?subject=${encodeURIComponent(`Application: ${role.title}`)}` : null)

  return (
    <>
      <SEO title={`${role.title} | Unity Within`} description={role.summary} />
      <header className="page-hero career-detail-hero">
        <div className="wrap">
          <EyebrowLabel>{role.status === 'open' ? 'CURRENT OPPORTUNITY' : 'OPPORTUNITY'}</EyebrowLabel>
          <h1>{role.title}</h1>
          <p className="hero__lede">{role.summary}</p>
        </div>
      </header>

      <Section className="career-detail">
        <div className="career-detail__summary">
          <Card className="career-detail__card">
            <EyebrowLabel>ROLE</EyebrowLabel>
            <ul className="career-detail__meta">
              <li><strong>Type:</strong> {role.type}</li>
              <li><strong>Status:</strong> {role.status}</li>
            </ul>
          </Card>
        </div>

        <div className="career-detail__content">
          <Card className="career-detail__panel">
            <EyebrowLabel>RESPONSIBILITIES</EyebrowLabel>
            <ul className="career-detail__list">
              {role.responsibilities.map(item => <li key={item}>{item}</li>)}
            </ul>
          </Card>

          <Card className="career-detail__panel">
            <EyebrowLabel>WE'RE LOOKING FOR</EyebrowLabel>
            <ul className="career-detail__list">
              {role.lookingFor.map(item => <li key={item}>{item}</li>)}
            </ul>
          </Card>
        </div>

        <div className="career-detail__actions">
          <Link className="button button--line" to="/careers">Back to roles</Link>
          {applyHref && (
            <Button href={applyHref} target={role.applyUrl ? '_blank' : undefined} rel={role.applyUrl ? 'noreferrer' : undefined}>
              {role.applyUrl ? 'Apply now' : 'Email us'}
            </Button>
          )}
        </div>
      </Section>
    </>
  )
}
