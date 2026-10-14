import React, { useEffect, useState } from 'react';
import Counter from '@/components/Counter';
import Section from '@/components/Section';
import EyebrowLabel from '@/components/EyebrowLabel';
import './SocialImpact.css';
import useParallax from '@/hooks/useParallax';

export default function SocialImpact() {
  const [data, setData] = useState({ users: 0, events: 0, stories: 0, volunteers: 0, date: '' });
  const bgRef = useParallax(0.2);

  useEffect(() => {
    fetch('/src/data/impact.json')
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => console.warn('Impact data not found'));
  }, []);

  return (
    <Section className="social-impact" ref={bgRef} style={{ backgroundImage: 'url(/images/impact-bg.jpg)' }}>
      <EyebrowLabel>SOCIAL IMPACT</EyebrowLabel>
      <h2 className="section-title">Our impact as of {data.date || '—'}</h2>
      <div className="counters grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="counter-item text-center">
          <Counter to={data.users} />
          <p>Users</p>
        </div>
        <div className="counter-item text-center">
          <Counter to={data.events} />
          <p>Events</p>
        </div>
        <div className="counter-item text-center">
          <Counter to={data.stories} />
          <p>Stories shared</p>
        </div>
        <div className="counter-item text-center">
          <Counter to={data.volunteers} />
          <p>Volunteers</p>
        </div>
      </div>
    </Section>
  );
}

