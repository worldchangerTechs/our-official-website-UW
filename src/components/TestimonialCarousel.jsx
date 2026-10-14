import { useRef, useEffect } from 'react';
import { Card, Button } from '../components.jsx';
import '../pages/Stories.css';

export default function TestimonialCarousel({ items }) {
  const containerRef = useRef(null);

  // Keyboard navigation
  const handleKey = e => {
    if (!containerRef.current) return;
    if (e.key === 'ArrowRight') containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    if (e.key === 'ArrowLeft') containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener('keydown', handleKey);
    return () => {
      if (el) el.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="testimonial-carousel" ref={containerRef} tabIndex={0} aria-roledescription="carousel" aria-label="Testimonials">
      <div className="carousel-track">
        {items.map(item => (
          <Card key={item.id} className="testimonial-card">
            <div className="portrait-wrapper">
              <img src={`/images/${item.image}`} alt={item.author_display_name} loading="lazy" />
            </div>
            <p className="testimonial-quote">{item.quote}</p>
            <p className="author-name">{item.author_display_name}</p>
            <p className="author-role">{item.role}</p>
          </Card>
        ))}
      </div>
      {/* Dots */}
      <div className="carousel-dots" role="group" aria-label="testimonial navigation dots">
        {items.map((_, i) => (
          <button key={i} className="dot" aria-label={`Go to testimonial ${i + 1}`} onClick={() => {
            const track = containerRef.current?.querySelector('.carousel-track');
            if (track) track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
          }} />
        ))}
      </div>
    </div>
  );
}

