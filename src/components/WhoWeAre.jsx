import React from 'react';
import './WhoWeAre.css';
import EyebrowLabel from '@/components/EyebrowLabel';
import Section from '@/components/Section';

export default function WhoWeAre() {
  return (
    <Section className="who-we-are">
      <EyebrowLabel>WHO WE ARE</EyebrowLabel>
      <h2 className="section-title">Mental health isn’t just a "student issue" – it affects us all.</h2>
      <p className="section-body">
        Unity Within is a community where young people from all walks of life talk openly, support one another, and prioritize well‑being without fear of judgment or shame.
      </p>
      <div className="collage">
        <div className="shape arch" />
        <div className="shape circle" />
        <div className="shape pill" />
      </div>
    </Section>
  );
}

