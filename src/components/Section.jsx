import React, { forwardRef } from 'react';

// Forward the ref so parent components can attach animations/parallax directly
const Section = forwardRef(function Section({ children, className = '' }, ref) {
  return (
    <section
      ref={ref}
      className={`max-w-container-lg mx-auto px-4 py-8 ${className}`}
    >
      {children}
    </section>
  );
});

export default Section;

