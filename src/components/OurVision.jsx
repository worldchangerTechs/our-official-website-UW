import React from 'react';
import Section from '@/components/Section';
import EyebrowLabel from '@/components/EyebrowLabel';
import './OurVision.css';

const cards = [
  { icon: 'chapters', title: 'Expanding our reach', description: 'Chapters across the globe' },
  { icon: 'digital', title: 'Digital platforms', description: 'Support anytime, anywhere' },
  { icon: 'advocacy', title: 'Advocacy', description: 'Systemic change for mental health' },
];

const iconPaths = {
  chapters: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  digital: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4M7 8h10M7 11h6" /></>,
  advocacy: <><path d="M4 20h16M6 20V9l6-5 6 5v11M9 20v-6h6v6" /><path d="M9 9h.01M15 9h.01" /></>,
};

function VisionIcon({ name }) {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

export default function OurVision() {
  return (
    <Section className="our-vision">
      <EyebrowLabel>OUR VISION</EyebrowLabel>
      <h2 className="section-title">Where we’re headed</h2>
      <div className="vision-cards">
        {cards.map((c) => (
          <div key={c.title} className="vision-card">
            <div className="icon"><VisionIcon name={c.icon} /></div>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
