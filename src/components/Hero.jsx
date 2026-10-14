import { useHeroAnimation } from '../hooks/useAnimations.js'
import { EyebrowLabel, ImageBlock } from '../components.jsx'

export default function Hero() {
  const hero = useHeroAnimation()

  return (
    <header className="hero wrap" ref={hero}>
      <div className="hero__copy">
        <EyebrowLabel>UNITY WITHIN // YOUTH MENTAL HEALTH ORGANIZATION</EyebrowLabel>
        <h1><span data-hero-text>Mental health matters.</span><br /><em data-hero-text>You</em> are not alone.</h1>
        <p className="hero__lede" data-hero-text>Unity Within is a youth-led mental health organization. We listen, support, and connect young people to professional help.</p>
        <div className="hero__meta" data-hero-text>
          <span><small>OUR COMMUNITY</small>Youth-led</span><span><small>OUR FOCUS</small>Mental health</span>
          <span><small>OUR APPROACH</small>We listen</span><span><small>OUR SUPPORT</small>Professional referrals</span>
        </div>
      </div>
      <div className="hero__art">
        <div className="hero__blob">
          <svg className="blob-outline" viewBox="0 0 520 560" aria-hidden="true"><path d="M269 15c93-16 194 38 223 122 31 91-7 157-21 241-14 82-55 156-148 169-96 13-222-9-285-90C-25 377 3 275 24 186 44 101 84 39 161 25c35-6 71-5 108-10Z" /></svg>
          {/* CONFIRM CONSENT before publishing this photo of people. */}
          <ImageBlock name="oscar-omondi-pLWciVWwGVQ-unsplash.jpg" alt="Young people gathered together at a rally" className="hero__main-photo" eager sizes="(max-width: 760px) 90vw, 48vw" />
        </div>
        {/* CONFIRM CONSENT before publishing this photo of people. */}
        <div className="hero__polaroid hero__polaroid--one" data-hero-photo><ImageBlock name="justin-porter-hZCsLN3Y49c-unsplash.jpg" alt="People gathered outdoors in a community" sizes="200px" /></div>
        {/* CONFIRM CONSENT before publishing this photo of people. */}
        <div className="hero__polaroid hero__polaroid--two" data-hero-photo><ImageBlock name="hassan-kibwana-fmXLB_uHIh4-unsplash.jpg" alt="People seated together at a gathering" sizes="160px" /></div>
        <div className="hero__chip hero__chip--care" data-float>Youth-led</div>
        <div className="hero__chip hero__chip--training" data-float>Mental health first</div>
      </div>
    </header>
  );
}
