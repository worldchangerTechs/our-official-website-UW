import { Button, Section, EyebrowLabel, StoryCard } from '../components.jsx'
import SEO from '../components/SEO.jsx'
import storiesData from '../data/stories.json'
import site from '../data/site.json'
import { toPublicStory, usePublicView } from '../lib/publicCms.js'
import './Stories.css'

export default function Stories() {
  const { data, loading, error } = usePublicView('public_stories', storiesData.stories.filter(story => story.consent === true))
  const stories = data.map(story => story.author_display_name !== undefined ? toPublicStory(story) : story)
  return <>
    <SEO title="Stories | Unity Within" description="Personal stories shared with permission by the Unity Within community." />
    <header className="stories-hero">
      <div className="wrap"><EyebrowLabel>05 / STORIES</EyebrowLabel><h1>Stories belong to the people who share them.</h1></div>
    </header>
    <Section className="stories-grid">
      {loading ? <p role="status">Loading stories…</p>
        : error ? <p role="alert">{error}</p>
        : stories.length
        ? stories.map(story => <StoryCard key={story.id} story={story} />)
        : <p>Stories will appear here only when people choose to share them and give permission to publish.</p>}
      {!error && <Button href={`mailto:${site.email}?subject=Sharing%20a%20story`} variant="line">Ask about sharing a story</Button>}
    </Section>
  </>
}
