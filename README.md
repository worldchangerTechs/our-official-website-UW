# Unity Within

A fast, responsive peer-support website for the student-led Unity Within movement at Kisii University, Kenya. Built with React 18, Vite, hash-based routing, anime.js, and static HTML prerendering for free GitHub Pages hosting.

## Install and run locally

Install [Node.js 20 or later](https://nodejs.org/) (npm is included), then open a terminal in this project folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Add and optimize photos

1. Add JPG, JPEG, PNG, or WebP originals directly to `images/`. Photos of people need appropriate consent before publication.
2. Run `npm run images`.
3. The optimizer creates responsive AVIF, WebP, and JPEG variants in `public/images/optimized/` and saves dimensions, dominant colors, and tiny blur placeholders in `src/data/images.json`.
4. The home-page hero uses `oscar-omondi-pLWciVWwGVQ-unsplash.jpg`. Change its filename and descriptive alt text in `src/pages/Home.jsx` when you choose another hero image. Change `index.html`'s image preload to match. Update `src/data/content.json` and `src/data/events.json` when you update their photos and alt text.
5. Commit both the new generated files and their source originals.

The optimizer auto-rotates from EXIF, strips metadata (including GPS), preserves proportions, never enlarges, and creates the 480, 800, 1200, and 1600 pixel widths supported by each source.

## Add content safely

- **Pages and shared sections:** page copy, FAQs, steps, and pillars live in `src/data/content.json`. Routes are React Router hash routes such as `/#/our-story`, and every page has a prerendered static HTML version.
- **Events and resources:** add or update entries in `src/data/events.json` and `src/data/resources.json`.
- **Stories and testimonials:** add entries to `src/data/stories.json` using `id`, `quote`, `title`, and other required details. A story is displayed only when `consent` is explicitly set to `true`. Obtain and record the contributor's informed permission for the actual publication, quote, image, and any identifying details before opting in. Never publish mental-health details without permission. Visitor opt-in is also required before stories are shown.
- **Impact:** update `src/data/impact.json` only with measured, verifiable figures and their appropriate context. The initial zeroes are labelled placeholders, not Unity Within outcomes.
- **Forms:** contact and story forms in `src/pages/ContentPage.jsx` are intentionally disconnected. Replace `REPLACE_WITH_YOUR_FORM_ID` with your verified Formspree form ID before accepting form submissions.
- **Page content:** individual page entry files in `src/pages/` select content from the JSON data and shared components in `src/components.jsx`.

## Build and preview

```sh
npm run build
npm run preview
```

The build optimizes original photos, produces the Vite production bundle, prerenders every public route into static HTML, and creates the story 404 page. Route chunks, React, CSS, and image references are ready for deployment in `dist/`.

## Free GitHub Pages deployment

1. The configured GitHub Pages repository slug is `unitywithin-application-page`. The site uses `/#/page` hash routes, a static `404.html`, and prerendered HTML so content is readable before client-side JavaScript runs.
2. Push to the repository's `main` branch. The workflow at `.github/workflows/deploy.yml` installs dependencies, builds and prerenders the site, and deploys `dist/` to GitHub Pages.
3. If GitHub Pages is not already enabled, open the repository's **Settings → Pages** and set **Source** to **GitHub Actions**.
4. When using a differently named repository, update `base` in `vite.config.js`, the base path in `scripts/optimize-images.js`, and the documented base paths in `index.html` and `public/404.html`.

## Launch placeholders checklist

- [ ] **Emergency contacts and helplines:** add only currently verified local emergency services, qualified Kisii University support/counselling contacts, hours, availability, and any vetted helpline details to `src/pages/ContentPage.jsx` (`SupportContent`). Do not publish unverified numbers. Peer support is not emergency treatment.
- [ ] **Founder contact and social links:** add approved email, phone number, and verified social accounts to the footer in `src/components.jsx`.
- [ ] **M-Pesa and donations:** obtain official, independently verified Paybill/Till, account/reference, recipient, and receipt process before publishing donation instructions in `src/pages/ContentPage.jsx` (`ExtraContent`).
- [ ] **Jotform:** verify the peer supporter and trainer URLs in `src/pages/ContentPage.jsx` (`ExtraContent`).
- [ ] **Formspree:** create/configure each form endpoint and replace `REPLACE_WITH_YOUR_FORM_ID`. Confirm delivery, spam controls, privacy notice, and retention before collecting submissions.
- [ ] **Photos and consent:** review each of the three Unsplash source files in `images/` and every alt description. Confirm publication permission and campus appropriateness for each identifiable person. Replace stock/event photos with approved Unity Within photos when available. Regenerate variants with `npm run images` and update the hero preload when changing the hero.
- [ ] **Impact figures and mental-health statistics:** replace the clearly marked zero-valued placeholder metrics in `src/data/impact.json` with measured, dated, attributable outcomes. Verify the `4/10` statistic's original source and date before presenting it as a Kenyan figure.
- [ ] **Events:** replace draft event descriptions and “Dates to be announced” entries in `src/data/events.json` with confirmed details.
- [ ] **UN Sustainable Development Goal icons:** add the official, unmodified `sdg-3.png`, `sdg-4.png`, `sdg-10.png`, and `sdg-17.png` files in `public/sdg/` before displaying SDG tiles. Do not recreate or recolor the official icons.
- [ ] **Stories and testimonials:** obtain specific, informed written contributor permission before adding any identifiable details, portrait, quote, or mental-health story; only display entries with `consent: true`.
- [ ] **GitHub Pages:** confirm the repository slug matches `unitywithin-application-page`, the default branch is `main`, and Pages is enabled with **GitHub Actions**.

## Lighthouse launch checklist

Run Lighthouse against the deployed URL at mobile screen size after a production build:

- [ ] Verify mobile performance, accessibility, best-practices, and SEO scores; optimize until performance approaches 95+.
- [ ] Verify the hero image and its AVIF preload load immediately; below-the-fold images are lazy-loaded.
- [ ] Inspect LCP, layout shift, and image/network waterfalls on a throttled 4G profile; target LCP under 1.5 seconds.
- [ ] Check initial JavaScript bundle size, including compressed transfer size; keep initial JS under 80 KB gzip where practical.
- [ ] Test keyboard navigation, visible focus, mobile navigation, FAQ accordion, event dialog, responsive image alt text, color contrast, and `prefers-reduced-motion` behavior.
- [ ] Test a cold load and subsequent offline/revisit behavior for the PWA service worker. Verify there are no missing-image, missing-route, console, or failed form-endpoint errors.
