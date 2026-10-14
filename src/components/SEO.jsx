import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import site from '../data/site.json';

// Base description used when page‑specific description is not provided
const organizationDescription = 'Unity Within is a youth‑led mental health organization. We listen, support, and connect young people to professional help.';

/**
 * SEO component – sets page <title>, meta description, Open Graph tags, canonical URL,
 * hreflang, and structured data (JSON‑LD) for better discoverability by search engines
 * and AI models. It also includes geo‑location data for local SEO.
 */
export default function SEO({ title, description, openGraph = {} }) {
  const { pathname } = useLocation();

  // Clean up title (remove any trailing branding) and add the brand suffix
  const pageTitle = title
    ? `${title.replace(/\s*[|–-]\s*Unity Within.*$/i, '')} | Unity Within, Youth Mental Health Organization`
    : 'Unity Within | Youth Mental Health Organization';

  // Build description – keep supplied one if it already mentions mental health
  const pageDescription = description?.toLowerCase().includes('mental health')
    ? description
    : `${description ?? organizationDescription} Learn more about mental health support from Unity Within.`;

  const canonicalPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const canonical = site.url
    ? `${site.url.replace(/\/$/, '')}${canonicalPath === '/' ? '' : canonicalPath}`
    : `${import.meta.env.BASE_URL}${canonicalPath.replace(/^\/+/, '')}`;

  // Only include organization details supplied in the site's verified configuration.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    description: organizationDescription,
    ...(site.url ? { url: site.url } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    sameAs: Object.values(site.social ?? {}).filter(Boolean),
    slogan: 'UNITY starts from WITHIN.',
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph – improves sharing on social platforms and AI previews */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={openGraph.title ?? pageTitle} />
      <meta property="og:description" content={openGraph.description ?? pageDescription} />
      <meta property="og:url" content={canonical} />
      {openGraph.image && <meta property="og:image" content={openGraph.image} />}
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={site.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={openGraph.title ?? pageTitle} />
      <meta name="twitter:description" content={openGraph.description ?? pageDescription} />
      {openGraph.image && <meta name="twitter:image" content={openGraph.image} />}

      {/* hreflang – even if we have only one language, explicit declaration helps crawlers */}
      <link rel="alternate" hrefLang="en" href={canonical} />

      {/* Structured data for SEO & AI */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
