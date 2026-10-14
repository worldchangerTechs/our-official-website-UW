import React, { useEffect, useRef } from 'react';
import Section from '@/components/Section';
import EyebrowLabel from '@/components/EyebrowLabel';
import './CoreValues.css';
import anime from 'animejs';

const values = [
  { icon: 'empathy', title: 'Empathy', description: 'Listening without judgement' },
  { icon: 'acceptance', title: 'Acceptance', description: 'Welcoming every story' },
  { icon: 'safety', title: 'Confidentiality & Safety', description: 'Secure, anonymous space' },
  { icon: 'community', title: 'Community', description: 'Together we grow' },
  { icon: 'courage', title: 'Courage', description: 'Speaking up for yourself' },
];

const iconPaths = {
  empathy: <><path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 8.8 1.7Z" /><path d="M7.5 11.5h2l1-2 2 4 1-2h3" /></>,
  acceptance: <><circle cx="12" cy="12" r="9" /><path d="m7.5 12 3 3 6-6" /></>,
  safety: <><path d="M12 3 4 6v5c0 5 3.4 8.2 8 10 4.6-1.8 8-5 8-10V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  community: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2.5 19c.4-3 2.3-4.5 5.5-4.5s5.1 1.5 5.5 4.5M14 15c3.8-.7 6.3.8 7 3.5" /></>,
  courage: <><path d="M12 3 4 7v5c0 4.5 3.2 7.5 8 9 4.8-1.5 8-4.5 8-9V7l-8-4Z" /><path d="M12 8v8M9 12h6" /></>,
};

function ValueIcon({ name }) {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

export default function CoreValues() {
  const containerRef = useRef();

  useEffect(() => {
    const items = containerRef.current.querySelectorAll('.value-item');
    anime({
      targets: items,
      opacity: [0, 1],
      translateY: ['1rem', 0],
      delay: anime.stagger(150),
      easing: 'easeOutQuad',
    });
  }, []);

  return (
    <Section className="core-values" ref={containerRef}>
      <EyebrowLabel>OUR CORE VALUES</EyebrowLabel>
      <h2 className="section-title">What we stand for</h2>
      <div className="values-grid">
        {values.map((v) => (
          <div key={v.title} className="value-item card p-4 text-center">
            <div className="icon mb-2"><ValueIcon name={v.icon} /></div>
            <h3 className="text-lg font-medium mb-1">{v.title}</h3>
            <p className="text-sm text-gray-600">{v.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
