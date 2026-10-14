import { Button, EyebrowLabel, Section } from '../components.jsx'
import SEO from '../components/SEO.jsx'

export default function NotFound() {
  return <>
    <SEO title="Page not found | Unity Within" description="The page you are looking for is not available. Return to the Unity Within home page." />
    <Section className="not-found">
      <EyebrowLabel>404 / NOT FOUND</EyebrowLabel>
      <h1>We couldn't find that page.</h1>
      <p>Let's help you find your way back to support and community.</p>
      <Button to="/">Back to home</Button>
    </Section>
  </>
}
