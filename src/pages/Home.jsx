import { Button, Card, DonateButton, EyebrowLabel, ImageBlock, Section } from '../components.jsx'
import Hero from '../components/Hero.jsx'
import SEO from '../components/SEO.jsx'
import impact from '../data/impact.json'
import sdgAlignment from '../data/sdg.json'
import storiesData from '../data/stories.json'
import './Home.css'

const mainWork = [
  ['01', 'Mental health awareness', 'We share clear facts and personal stories, with consent, so people can talk without shame.', 'In simple words: We help people understand mental health.'],
  ['02', 'Peer support', 'Young people listen to other young people and help them find their next step.', 'In simple words: We listen and support each other.'],
  ['03', 'Self-acceptance', 'We share tools and stories that help young people feel more at ease with who they are.', 'In simple words: You can be yourself.'],
  ['04', 'Connection to professional help', 'We help young people find counsellors and other trained professionals.', 'In simple words: We help you find more help when you need it.'],
]

const additionalWork = [
  ['Mentorship', 'A trusted guide can help a young person learn and grow.'],
  ['Early pregnancy awareness', 'We share clear information and help people find a health service.'],
  ['GBV awareness', 'We talk about safety and help people find support.'],
]

const foundations = [
  ['01', 'Empathy', 'We listen and try to understand.'],
  ['02', 'Acceptance', 'We respect people as they are.'],
  ['03', 'Confidentiality and safety', 'We care for privacy and follow safety guidance.'],
  ['04', 'Community', 'We help people feel part of a group.'],
  ['05', 'Courage', 'We make room for honest conversations.'],
]

const vision = [
  'Mental health support in every community',
  'More ways to find support',
  'Better mental health services for young people',
]

const consentedStories = storiesData.stories.filter(item => item.consent === true)
const qualifyingMetrics = Number.isFinite(impact.value) && impact.value >= 20 ? [impact] : []

function WorkCard({ item }) {
  const [number, title, text, simple] = item
  return <Card className="home-work-card">
    <EyebrowLabel>{number} / OUR WORK</EyebrowLabel>
    <h3>{title}</h3>
    <p>{text}</p>
    <p className="home-simple"><strong>In simple words:</strong> {simple.replace('In simple words: ', '')}</p>
  </Card>
}

export default function Home() {
  return <>
    <SEO title="Home | Unity Within" description="Unity Within is a youth-led mental health organization. We listen, support, and connect young people to professional help." />
    <Hero />

    <Section className="home-mental-health">
      <EyebrowLabel>01 / MENTAL HEALTH IN 30 SECONDS</EyebrowLabel>
      <h2>Mental health is part of everyday life.</h2>
      <div className="home-intro-grid">
        {[
          ['What is mental health?', 'It is how we think, feel, and cope each day.'],
          ['Who is it for?', 'Everyone. We all have hard days sometimes.'],
          ['Why does it matter?', 'Talking and getting help early can make it easier to cope.'],
        ].map(([title, text]) => <Card key={title}><h3>{title}</h3><p>{text}</p></Card>)}
      </div>
    </Section>

    <Section className="home-who">
      <div className="section-grid">
        <div>
          <EyebrowLabel>02 / WHO WE ARE</EyebrowLabel>
          <h2>A place to talk, listen, and find help.</h2>
          <p>Unity Within is a youth-led mental health organization. We listen, support, and connect young people to professional help.</p>
          <Button to="/our-story" variant="line">Our story</Button>
        </div>
        <Card className="home-belief-card">
          <EyebrowLabel>OUR BELIEF</EyebrowLabel>
          <p>Connection and listening matter. No one should have to face a hard day alone.</p>
          <strong>UNITY starts from WITHIN.</strong>
        </Card>
      </div>
    </Section>

    <Section className="home-main-work">
      <EyebrowLabel>03 / WHAT WE DO</EyebrowLabel>
      <h2>Mental health support in simple ways.</h2>
      <p className="section-intro">We listen, support each other, and help young people find professional help.</p>
      <div className="home-work-grid">{mainWork.map(item => <WorkCard key={item[1]} item={item} />)}</div>
      <div className="home-also-work">
        <EyebrowLabel>ALSO PART OF OUR WORK</EyebrowLabel>
        <div>{additionalWork.map(([title, text]) => <Card key={title}><h3>{title}</h3><p>{text}</p><p><strong>In simple words:</strong> We share information and help people find support.</p></Card>)}</div>
      </div>
      <Card className="home-research">
        <EyebrowLabel>RESEARCH</EyebrowLabel>
        <div><h3>AI, new technology, and mental health</h3><p>We are researching how AI and new technology affect mental health. Findings will be shared when they are ready and checked.</p></div>
        <Button to="/partner" variant="line">Work with us</Button>
      </Card>
      <Button to="/what-we-do">Explore our work</Button>
    </Section>

    <Section className="home-mission">
      <EyebrowLabel>04 / OUR MISSION</EyebrowLabel>
      <h2>Help young people feel heard and find the support they need.</h2>
      <p>We want every young person to feel heard, supported, and able to find the help that is right for them.</p>
    </Section>

    <Section className="home-vision">
      <EyebrowLabel>05 / OUR VISION</EyebrowLabel>
      <h2>A future where young people can find mental health support.</h2>
      <div className="home-vision-grid">{vision.map((item, index) => <Card key={item}><EyebrowLabel>{String(index + 1).padStart(2, '0')} / VISION</EyebrowLabel><h3>{item}</h3></Card>)}</div>
    </Section>

    {qualifyingMetrics.length > 0 && <Section className="home-impact">
      <EyebrowLabel>06 / OUR IMPACT</EyebrowLabel>
      <h2>We share what we can check.</h2>
      <div className="home-impact-grid">{qualifyingMetrics.map(metric => <Card key={metric.key}><strong>{metric.value}</strong><span>{metric.label}</span></Card>)}</div>
      <Button to="/impact" variant="line">See our impact</Button>
    </Section>}

    <Section className="home-values">
      <EyebrowLabel>07 / OUR VALUES</EyebrowLabel>
      <h2>How we treat each other matters.</h2>
      <div className="home-values-grid">{foundations.map(([number, title, text]) => <Card key={number}><EyebrowLabel>{number} / VALUE</EyebrowLabel><h3>{title}</h3><p>{text}</p></Card>)}</div>
    </Section>

    <Section className="home-sdgs">
      <EyebrowLabel>08 / GOALS WE SUPPORT</EyebrowLabel>
      <h2>Part of a wider effort for young people.</h2>
      <div className="home-sdg-grid">{sdgAlignment.map(goal => <Card key={goal.number}><img src={`${import.meta.env.BASE_URL}sdg/E_SDG_Icons-${goal.assetNumber}.jpg`} alt={`United Nations Sustainable Development Goal ${goal.number}: ${goal.title}`} width="250" height="250" loading="lazy" decoding="async" /><div><EyebrowLabel>SDG {goal.number}</EyebrowLabel><h3>{goal.title}</h3><p>{goal.alignment}</p></div></Card>)}</div>
    </Section>

    <Section className="home-stories">
      <EyebrowLabel>09 / STORIES</EyebrowLabel>
      <h2>Real stories belong to the people who share them.</h2>
      {consentedStories.length
        ? <div className="home-story-list">{consentedStories.map(item => <Card key={item.id}><h3>{item.title}</h3><p>{item.quote}</p></Card>)}</div>
        : <p>We’ll share stories only when someone chooses to share theirs. Would you like to tell us your story?</p>}
      <Button to="/stories" variant="line">Visit Stories</Button>
    </Section>

    <Section className="home-donate-banner">
      {/* CONFIRM CONSENT */}
      <ImageBlock slot="donate-banner" alt="" sizes="100vw" />
      <div><EyebrowLabel>HELP YOUNG PEOPLE FIND SUPPORT</EyebrowLabel><h2>Help a young person get the support they need.</h2><DonateButton /></div>
    </Section>
  </>
}
