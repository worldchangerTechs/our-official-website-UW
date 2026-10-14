import SEO from '../components/SEO.jsx'
import { Button, Card, DonateButton, EyebrowLabel, Section } from '../components.jsx'
import site from '../data/site.json'
import './OurStory.css'

const beliefs = [
  { title: 'Listening heals', description: 'Being heard with care can make a hard moment feel less lonely.' },
  { title: 'You belong as you are', description: 'You deserve connection without hiding who you are.' },
  { title: 'Asking for help is strength', description: 'Reaching out is a meaningful step, and support can take many forms.' },
]

export default function OurStory() {
  return <>
    <SEO title="Our Story | Unity Within" description="Why Unity Within exists: a place to be heard, because most people just need someone who listens." />
    <header className="page-hero our-story-hero">
      <div className="wrap">
        <EyebrowLabel>01 / OUR STORY</EyebrowLabel>
        <h1>Why Unity Within <em>exists</em>.</h1>
        <p className="hero__lede">A place to be heard, because most people just need someone who listens.</p>
      </div>
    </header>

    <Section className="founder-story">
      <EyebrowLabel>01 / FOUNDER STORY</EyebrowLabel>
      <div className="founder-story__layout">
        <div className="founder-story__portrait" aria-hidden="true"><span>TM</span></div>
        <div className="founder-story__copy">
          <p>I have lost friends. Some to suicide, some to drugs, and some are still fighting addiction. For a long time I smiled on the outside while feeling lonely on the inside, even when I was surrounded by people.</p>
          <p>Many times I wanted to open up to someone. The answer was always 'it will get better,' or a shocked 'waaah.' Nobody stayed with me in it.</p>
          <p>That is why I started Unity Within. I wanted it to be a sanctuary: a place for anyone who feels unseen, anyone who needs to be heard, anyone who is feeling low, anyone who just wants to feel chosen.</p>
          <p>Not every hard moment needs therapy. Many can be eased by talking it out with someone who knows how to listen and how to respond. That is what we train, and that is what we offer.</p>
          <blockquote className="founder-story__pullquote">You don't have to smile through it here.</blockquote>
          <p className="founder-story__signature"><strong>{site.founder}</strong><span>Founder</span></p>
        </div>
      </div>
      <p className="founder-story__support-note">If this brings up something heavy for you, you are not alone. Visit our <Button to="/get-support" variant="text">Get Support page</Button>.</p>
    </Section>

    <Section className="our-beliefs">
      <EyebrowLabel>02 / WHAT WE BELIEVE</EyebrowLabel>
      <h2>Care starts with how we see one another.</h2>
      <div className="our-beliefs__grid">
        {beliefs.map((belief, index) => <Card key={belief.title}>
          <EyebrowLabel>{String(index + 1).padStart(2, '0')} / BELIEF</EyebrowLabel>
          <h3>{belief.title}</h3>
          <p>{belief.description}</p>
        </Card>)}
      </div>
    </Section>

    <Section className="our-story-next">
      <EyebrowLabel>03 / WHAT WE DO ABOUT IT</EyebrowLabel>
      <h2>We make space for awareness, peer support, self-acceptance, and connection.</h2>
      <p>Through our programmes, young people can listen, learn, and find professional support when they need it.</p>
      <div className="our-story-next__actions">
        <Button to="/get-support" variant="line">Get Support</Button>
        <DonateButton>Donate</DonateButton>
      </div>
      <p className="our-story-next__more">Learn more about <Button to="/what-we-do" variant="text">What We Do</Button>.</p>
    </Section>
  </>
}
