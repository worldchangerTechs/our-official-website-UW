import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './components/Header.jsx'
import './ButtonRetro.css';
export { Header }
import images from './data/images.json'
import events from './data/events.json'
import stories from './data/stories.json'
import site from './data/site.json'
import { useCountUp, useReveal, useStagger } from './hooks/useAnimations.js'
import './site.css';
import imageSlots from './data/imageSlots.json';

export const navigation = [
  ['Our Story', '/our-story'],
  ['What We Do', '/what-we-do'],
  ['Self-Acceptance Hub', '/self-acceptance-hub'],
  ['Stories', '/stories'],
  ['Impact', '/impact'],
  ['Events', '/events'],
  ['Resources', '/resources'],
  ['Get Support', '/get-support'],
  ['DONATE', '/donate'],
]

const imageFor = name => images.find(image => image.name === name)
const hrefBase = '/unitywithin-application-page/'

export const Button = memo(function Button({ to, href, children, variant = 'fill', type = 'button', ...props }) {
  const className = `button button--${variant} css-button-retro--rose`
  return to
    ? <Link className={className} to={to} {...props}>{children}</Link>
    : href
      ? <a className={className} href={href} {...props}>{children}</a>
      : <button className={className} type={type} {...props}>{children}</button>
})

export function DonateButton({ children = 'Donate', className = '', ...props }) {
  return <Button to="/donate" className={className} {...props}>{children}</Button>
}

export function ContactLinks({ includeSlack = false, includeSocial = false, className = '' }) {
  return <div className={`contact-links ${className}`}>
    <a href={`tel:${site.phone}`}>Call {site.phone}</a>
    <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
    <a href={`mailto:${site.email}`}>{site.email}</a>
    {includeSlack && site.slack && <a className="contact-links__slack" href={site.slack} target="_blank" rel="noreferrer">Join our Slack community</a>}
    {includeSocial && <SocialLinks />}
  </div>
}

export const Section = memo(function Section({ children, className = '', id }) {
  return <section className={`section ${className}`} id={id}><div className="wrap">{children}</div></section>
})

export const EyebrowLabel = memo(function EyebrowLabel({ children }) {
  return <p className="eyebrow mono">{children}</p>
})

export const Card = memo(function Card({ children, className = '' }) {
  return <article className={`card ${className}`}>{children}</article>
})

export const ImageBlock = memo(function ImageBlock({
  slot,
  name,
  alt,
  className = '',
  eager = false,
  sizes = '(max-width: 720px) 100vw, 720px',
  width,
  height,
}) {
  // Slot‑based resolution first
  if (slot) {
    const slotDef = imageSlots.find(s => s.slot === slot);
    if (!slotDef) {
      return <div className={`image-block image-block--missing ${className}`} role="img" aria-label={alt}>{alt}</div>;
    }
    const localBase = `/images/${slot}`; // expects optimizer output
    const unsplashUrl = slotDef.source?.cdnUrl;
    const imageUrl = unsplashUrl || localBase;
    const placeholderColor = slotDef.source?.dominantColor || '#eee';
    const aspect = slotDef.aspectRatio || '16/9';
    const [arW, arH] = aspect.split('/').map(Number);
    const selectedWidth = width ?? arW * 100;
    const selectedHeight = height ?? arH * 100;
    return (
      <picture className={`image-block ${className}`} style={{ '--placeholder': placeholderColor, aspectRatio: `${selectedWidth} / ${selectedHeight}` }}>
        <img
          src={imageUrl}
          width={selectedWidth}
          height={selectedHeight}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={eager ? 'high' : 'auto'}
          style={{ backgroundColor: placeholderColor }}
          onLoad={event => event.currentTarget.classList.add('is‑loaded')}
        />
      </picture>
    );
  }

  // Fallback to legacy name‑based logic
  const image = name ? imageFor(name) : null;
  if (!image) {
    return <div className={`image-block image-block--missing ${className}`} role="img" aria-label={alt}>{alt}</div>;
  }
  const selectedWidth = width ?? image.width;
  const selectedHeight = height ?? image.height;
  const responsive = format => image[format].map(source => `${source.src} ${source.width}w`).join(', ');
  return (
    <picture className={`image-block ${className}`} style={{ '--placeholder': image.dominantColor, aspectRatio: `${selectedWidth} / ${selectedHeight}` }}>
      <source type="image/avif" srcSet={responsive('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={responsive('webp')} sizes={sizes} />
      <img
        src={image.jpeg.at(-1).src}
        srcSet={responsive('jpeg')}
        sizes={sizes}
        width={selectedWidth}
        height={selectedHeight}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : 'auto'}
        style={{ backgroundColor: image.dominantColor, backgroundImage: `url("${image.placeholder}")` }}
        onLoad={event => event.currentTarget.classList.add('is-loaded')}
      />
    </picture>
  );
});




export const Accordion = memo(function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return <div className="accordion">{items.map((item, index) => {
    const expanded = open === index
    const panelId = `accordion-${index}`
    return (
      <article className={`accordion__item${expanded ? ' is-open' : ''}`} key={item.question}>
        <h3><button className="accordion__trigger" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpen(expanded ? -1 : index)}>
          {item.question}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button></h3>
        <div className="accordion__panel" id={panelId} hidden={!expanded}><p>{item.answer}</p></div>
      </article>
    )
  })}</div>
})

export const Counter = memo(function Counter({ value, suffix, label }) {
  const count = useCountUp(value, suffix)
  return <Card className="metric"><span ref={count} className="metric__number">{value}{suffix}</span><span className="metric__label">{label}</span></Card>
})

export const StoryCard = memo(function StoryCard({ story }) {
  if (!story.consent) return null
  return <Card className="story-card">
    <div className="story-card__image">{story.imageUrl
      ? <img src={story.imageUrl} alt={story.imageAlt || ''} loading="lazy" decoding="async" />
      : <ImageBlock name={story.image} alt={story.imageAlt} />}</div>
    <span className="story-card__quote" aria-hidden="true">“</span>
    <blockquote>{story.quote}</blockquote>
    <p className="story-card__author">{story.author || 'Shared with permission'}</p>
  </Card>
})

export const TestimonialCarousel = memo(function TestimonialCarousel({ items = stories.filter(story => story.consent) }) {
  const [active, setActive] = useState(0)
  if (!items.length) return <p className="note">Stories and testimonials will appear here only after a contributor gives explicit permission to publish.</p>
  const move = delta => setActive(current => (current + delta + items.length) % items.length)
  const story = items[active]
  return <div className="testimonials" aria-roledescription="carousel" aria-label="Stories shared with permission">
    <div className="testimonials__track" tabIndex={0} onKeyDown={event => {
      if (event.key === 'ArrowRight') move(1)
      if (event.key === 'ArrowLeft') move(-1)
    }}>
      <blockquote>“{story.quote}”</blockquote>
      <p>{story.author || 'Shared with permission'}</p>
    </div>
    <div className="carousel-controls">
      <button aria-label="Previous story" onClick={() => move(-1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m0 0 7-7m-7 7 7 7" /></svg></button>
      {items.map((item, index) => <button key={item.id} className={`carousel-dot${index === active ? ' is-active' : ''}`} aria-label={`Show story ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)} />)}
      <button aria-label="Next story" onClick={() => move(1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m0 0-7-7m7 7-7 7" /></svg></button>
    </div>
  </div>
})

export const Lightbox = memo(function Lightbox({ event, onClose }) {
  const dialog = useRef(null)
  const close = useCallback(async () => {
    const element = dialog.current
    if (!element?.open) return
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !navigator.connection?.saveData) {
      const { animate } = await import('animejs')
      if (!element.open) return
      const animation = animate(element, { opacity: [1, 0], scale: [1, 0.96], duration: 150, ease: 'inQuad' })
      await animation.then()
      animation.revert()
    }
    if (element.open) element.close()
  }, [])
  useEffect(() => {
    const element = dialog.current
    if (!element) return undefined
    if (!element.open) element.showModal()
    let animation
    let mounted = true
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !navigator.connection?.saveData) {
      import('animejs').then(({ animate }) => {
        if (mounted && element.open) animation = animate(element, { opacity: [0, 1], scale: [0.96, 1], duration: 200, ease: 'outQuad' })
      })
    }
    const onCloseDialog = () => onClose()
    element.addEventListener('close', onCloseDialog)
    return () => {
      mounted = false
      animation?.revert()
      element.removeEventListener('close', onCloseDialog)
      if (element.open) element.close()
    }
  }, [onClose])
  return <dialog className="lightbox" ref={dialog} aria-label={event.title} onClick={eventClick => {
    if (eventClick.target === dialog.current) void close()
  }}>
    <button className="lightbox__close" aria-label="Close photo" onClick={() => void close()}>
      <svg className="menu-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    </button>
    {/* CONFIRM CONSENT before publishing this photo of people. */}
    <ImageBlock name={event.image} alt={event.description} sizes="min(90vw, 1000px)" />
    <div className="lightbox__caption"><strong>{event.title}</strong><span>{event.date}</span></div>
  </dialog>
})

export function EventGallery() {
  const [selected, setSelected] = useState(null)
  const clearSelected = useCallback(() => setSelected(null), [])
  const reveal = useStagger()
  return <>
    {events.length
      ? <div className="event-gallery" ref={reveal}>
        {events.map(event => <button key={event.id} className="event-tile" data-stagger onClick={() => setSelected(event)} aria-label={`View ${event.title}`}>
          {/* CONFIRM CONSENT before publishing this photo of people. */}
          <ImageBlock name={event.image} alt={event.description} sizes="(max-width: 700px) 75vw, 400px" />
          <span><strong>{event.title}</strong><small>{event.date}</small></span>
        </button>)}
      </div>
      : <p>No upcoming events are listed right now. Check back for future activities.</p>}
    {selected && <Lightbox event={selected} onClose={clearSelected} />}
  </>
}

const routeLoaders = {
  '/': () => import('./pages/Home.jsx'),
  '/our-story': () => import('./pages/OurStory.jsx'),
  '/what-we-do': () => import('./pages/WhatWeDo.jsx'),
  '/peer-training': () => import('./pages/PeerTraining.jsx'),
  '/get-support': () => import('./pages/GetSupport.jsx'),
  '/self-acceptance-hub': () => import('./pages/SelfAcceptanceHub.jsx'),
  '/stories': () => import('./pages/Stories.jsx'),
  '/stories/consent-required': () => import('./pages/StoryDetail.jsx'),
  '/impact': () => import('./pages/Impact.jsx'),
  '/events': () => import('./pages/Events.jsx'),
  '/careers': () => import('./pages/Careers.jsx'),
  '/volunteer': () => import('./pages/Volunteer.jsx'),
  '/partner': () => import('./pages/Partner.jsx'),
  '/donate': () => import('./pages/Donate.jsx'),
  '/resources': () => import('./pages/Resources.jsx'),
  '/contact': () => import('./pages/Contact.jsx'),
}

const routePromises = new Map()
export function prefetchRoute(pathname) {
  const loader = routeLoaders[pathname] ?? (pathname.startsWith('/stories/') ? routeLoaders['/stories/consent-required'] : undefined)
  if (loader && !routePromises.has(pathname)) routePromises.set(pathname, loader())
  return routePromises.get(pathname) ?? Promise.resolve()
}

export function routeFromPath(pathname) {
  return routeLoaders[pathname] ? pathname : '/not-found'
}

function Brand() {
  return <Link className="brand" to="/" aria-label="Unity Within home"><span>UNITY</span> <strong>WITHIN</strong></Link>
}

export function Footer() {
  return <footer className="site-footer">
    <div className="wrap">
      <div className="footer-cta">
        {/* CONFIRM CONSENT before publishing this photo of people. */}
        <ImageBlock slot="donate-banner" alt="Community members standing together outdoors" />
        <div className="footer-cta__copy">
  <EyebrowLabel>SUPPORT YOUTH MENTAL HEALTH & WELL-BEING</EyebrowLabel>
  <h2>Empowerment begins with support.</h2>
  <p>By contributing today, you fund essential mental health advocacy, foster safe peer‑to‑peer connection networks, and bridge the gap to professional clinical resources for youth in need.</p>
  <p>Join us in creating a safer, healthier tomorrow.</p>
  <DonateButton>Make a Donation</DonateButton>
</div>
      </div>
      <div className="footer-grid">
        <div><Brand /><p className="footer-description">A youth-led mental health community. We listen, support, and connect young people to professional help.</p></div>
        <div><h2>Explore</h2><ul>{navigation.map(([label, to]) => <li key={to}><Link to={to}>{label === 'DONATE' ? 'Donate' : label}</Link></li>)}</ul></div>
        <div><h2>More</h2><ul>{[
          ['Peer-to-Peer Training', '/peer-training'],
          ['Volunteer', '/volunteer'],
          ['Partner With Us', '/partner'],
          ['Contact', '/contact'],
          ['Careers', '/careers'],
        ].map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)} </ul>
        </div>
        <div><h2>Contact</h2><ContactLinks includeSlack={false} includeSocial={false} /><DonateButton className="footer-donate" /></div>
      </div>
      <p className="disclaimer">Unity Within is a peer-support organization. We are not a replacement for a doctor, counsellor, or emergency services. If you are in immediate danger, contact local emergency services or go to the nearest hospital.</p>
      <div className="footer-bottom"><span>© Unity Within</span><span>Youth mental health organization</span></div>
    </div>
  </footer>
}

export function RevealSection({ children, className = '' }) {
  const ref = useReveal()
  return <div className={className} ref={ref}>{children}</div>
}

export const availableEvents = events
export const websiteBase = hrefBase
