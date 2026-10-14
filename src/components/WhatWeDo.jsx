import React from 'react';
import Card from '@/components/Card';
import Section from '@/components/Section';
import EyebrowLabel from '@/components/EyebrowLabel';
import './WhatWeDo.css';

const pillars = [
  { icon: 'awareness', title: 'Mental‑health awareness', link: '/what-we-do#awareness' },
  { icon: 'peerSupport', title: 'Peer support', link: '/what-we-do#support' },
  { icon: 'mentorship', title: 'Mentorship', link: '/what-we-do#mentorship' },
  { icon: 'selfAcceptance', title: 'Self‑acceptance', link: '/what-we-do#self' },
  { icon: 'referrals', title: 'Community connection & referrals', link: '/what-we-do#community' },
];

const iconPaths = {
  awareness: <><path d="M4 5.5h16v13H4z" /><path d="M8 9h8M8 12h8M8 15h5" /></>,
  peerSupport: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2.5 19c.4-3 2.3-4.5 5.5-4.5s5.1 1.5 5.5 4.5M14 15c3.8-.7 6.3.8 7 3.5" /></>,
  mentorship: <><path d="M12 3 4 7v5c0 4.5 3.2 7.5 8 9 4.8-1.5 8-4.5 8-9V7l-8-4Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
  selfAcceptance: <><path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 8.8 1.7Z" /><path d="M7.5 11.5h2l1-2 2 4 1-2h3" /></>,
  referrals: <><circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="m9 11 6-4M9 13l6 4" /></>,
};

function PillarIcon({ name }) {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

export default function WhatWeDo() {
  return (
    <Section className="what-we-do">
      <EyebrowLabel>WHAT WE DO</EyebrowLabel>
      <h2 className="section-title">Our pillars</h2>
      <div className="pillars-grid">
        {pillars.map((p) => (
          <Card key={p.title} className="pillar-card">
            <div className="icon"><PillarIcon name={p.icon} /></div>
            <h3>{p.title}</h3>
            <a href={p.link} className="learn-more">Learn more →</a>
          </Card>
        ))}
      </div>
    </Section>
  );
}
