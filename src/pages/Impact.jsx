import SEO from '../components/SEO.jsx'
import { Button, Card, EyebrowLabel, ImageBlock, Section, TestimonialCarousel } from '../components.jsx'
import impact from '../data/impact.json'
import partners from '../data/partners.json'
import sdgAlignment from '../data/sdg.json'
import storiesData from '../data/stories.json'
import { useCountUp } from '../hooks/useAnimations.js'
import './Impact.css'

const stories = storiesData.stories.filter(story => story.consent === true)
const metricIsReportable = Number.isFinite(impact.value) && impact.value >= 20
const metrics = metricIsReportable ? [impact] : []
const quarterlyGrowth = (impact.quarterlyGrowth ?? []).filter(row => Number.isFinite(row.value) && row.value >= 0)
const partnerList = partners.filter(partner => partner.name && partner.logo)
function ImpactCounter({ metric }) {
  const validValue = Number.isFinite(metric.value) && metric.value >= 0
  const count = useCountUp(validValue ? metric.value : Number.NaN, metric.suffix ?? '')
  return <Card className="impact-stat">
    <span className="impact-stat__value" ref={validValue && metric.value > 0 ? count : undefined}>{validValue ? metric.value === 0 ? '0 for now' : `${metric.value}${metric.suffix ?? ''}` : 'Not reported yet'}</span>
    <span className="impact-stat__label">{metric.label}</span>
    {metric.value === 0 && <small>We’re just getting started.</small>}
    {metric.goalText && <p>{metric.goalText}</p>}
  </Card>
}

function SdgAlignment() {
  return <div className="impact-sdg-grid">
    {sdgAlignment.map(goal => <Card className="impact-sdg-card" key={goal.number}>
      <img className="impact-sdg-card__icon" src={`${import.meta.env.BASE_URL}sdg/E_SDG_Icons-${goal.assetNumber}.jpg`} width="250" height="250" loading="lazy" decoding="async" alt={`United Nations Sustainable Development Goal ${goal.number}: ${goal.title}`} />
      <div className="impact-sdg-card__copy"><EyebrowLabel>SDG {goal.number}</EyebrowLabel><h3>{goal.title}</h3><p>{goal.alignment}</p></div>
    </Card>)}
  </div>
}

export default function Impact() {
  return <>
    <SEO title="Our Impact | Unity Within" description="How Unity Within records and shares verified information about its mental health work." />
    <header className="page-hero impact-hero">
      <div className="wrap">
        <EyebrowLabel>06 / OUR IMPACT</EyebrowLabel>
        <h1>Small steps, <em>real</em> change.</h1>
        <p className="hero__lede">We share what we can check and keep learning with our community.</p>
      </div>
    </header>

    {metrics.length > 0 && <section className="impact-metrics-section" aria-labelledby="impact-metrics-heading">
      <div className="impact-metrics-band">
        {/* CONFIRM CONSENT */}
        <div className="impact-metrics-band__parallax" aria-hidden="true">
          <ImageBlock name="oscar-omondi-pLWciVWwGVQ-unsplash.jpg" alt="" className="impact-metrics-band__photo" sizes="100vw" width={1600} height={1200} />
        </div>
        <div className="impact-metrics-band__shade" />
        <div className="wrap impact-metrics-band__content">
          <EyebrowLabel>01 / OUR WORK IN NUMBERS</EyebrowLabel>
          <h2 id="impact-metrics-heading">Progress begins with showing up.</h2>
          <div className="impact-stats-grid">
            {metrics.map(metric => <ImpactCounter key={metric.key} metric={metric} />)}
          </div>
        </div>
      </div>
    </section>}

    <Section className="impact-methodology">
      <EyebrowLabel>02 / HOW WE COUNT</EyebrowLabel>
      <h2>Clear methods matter.</h2>
      <div className="impact-method-grid">
        <Card className="impact-method-card"><h3>People trained</h3><p>Reported totals will count unique participants who complete the defined training activities. Attendance records will be used to remove duplicates.</p></Card>
        <Card className="impact-method-card"><h3>Conversations</h3><p>Reported totals will count completed peer-support conversations without recording private story details or identifying information.</p></Card>
        <Card className="impact-method-card"><h3>Events and referrals</h3><p>Reported totals will count delivered activities and referrals using organization records. A referral is not counted as a clinical outcome.</p></Card>
      </div>
      {(impact.sources ?? []).length > 0 && <div className="impact-sources"><h3>Sources</h3><ul>{impact.sources.map(source => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul></div>}
    </Section>

    {quarterlyGrowth.length > 0 && <Section className="impact-chart-section">
      <EyebrowLabel>03 / GROWTH OVER TIME</EyebrowLabel>
      <h2>Quarterly activity.</h2>
      <div className="impact-chart impact-chart__table-wrap"><table>
        <caption>Verified activity by quarter</caption>
        <thead><tr><th scope="col">Quarter</th><th scope="col">Students trained</th></tr></thead>
        <tbody>{quarterlyGrowth.map(row => <tr key={row.quarter}><th scope="row">{row.quarter}</th><td>{row.value}</td></tr>)}</tbody>
      </table></div>
    </Section>}

    <Section className="impact-sdg-section">
      <EyebrowLabel>04 / SDG ALIGNMENT</EyebrowLabel>
      <h2>Our work connects to shared goals.</h2>
      <SdgAlignment />
    </Section>

    <Section className="impact-stories-section">
      <EyebrowLabel>05 / STORIES SHARED WITH PERMISSION</EyebrowLabel>
      <h2>People’s experiences belong to them.</h2>
      <TestimonialCarousel items={stories} />
    </Section>

    {partnerList.length > 0 && <Section className="impact-partners-section">
      <EyebrowLabel>06 / PARTNERS AND SUPPORTERS</EyebrowLabel>
      <div className="impact-partner-grid">{partnerList.map(partner => <div className="impact-partner-placeholder" key={partner.id}><img src={partner.logo} alt={`${partner.name} logo`} loading="lazy" decoding="async" /><span>{partner.name}</span></div>)}</div>
    </Section>}

    <Section className="impact-cta">
      <EyebrowLabel>07 / GROW WITH US</EyebrowLabel>
      <h2>Good work grows through connection.</h2>
      <div className="impact-cta__actions"><Button to="/partner">Partner With Us</Button><Button to="/donate" variant="line">Donate</Button></div>
    </Section>
  </>
}
