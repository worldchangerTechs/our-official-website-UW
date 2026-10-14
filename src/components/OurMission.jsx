import React from 'react';
import Section from '@/components/Section';
import EyebrowLabel from '@/components/EyebrowLabel';
import './OurMission.css';

export default function OurMission() {
  return (
    <Section className="our-mission">
      <EyebrowLabel>OUR MISSION</EyebrowLabel>
      <h2 className="section-title">Our mission</h2>
      <p className="section-body">
        To create a safe, supportive space where every young person feels heard, accepted, and empowered to prioritize mental well‑being.
      </p>
      <blockquote className="highlight-quote">
        "It's okay to not be okay, and asking for help is a sign of strength."
      </blockquote>
    </Section>
  );
}

