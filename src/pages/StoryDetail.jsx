import { Section, EyebrowLabel, Button, Card } from '../components.jsx';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import SEO from '../components/SEO.jsx';
import storiesData from '../data/stories.json';
import './StoryDetail.css';

export default function StoryDetail() {
  const { id } = useParams(); // expecting /stories/:id
  const story = storiesData.stories.find(s => s.id === id && s.consent);
  const [showVideo, setShowVideo] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const shareStory = async () => {
    const shareData = { title: story.title, text: story.quote, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus('Story shared.');
      } catch (error) {
        if (error.name !== 'AbortError') setShareStatus('Sharing did not complete. You can copy this page URL to share it.');
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setShareStatus('Story link copied.');
    } catch {
      setShareStatus(`Copy is unavailable. You can copy this page URL to share it: ${shareData.url}`);
    }
  };

  if (!story) {
    return (
      <>
        <SEO title="Story unavailable | Unity Within" description="This story is not available to view." />
        <Section className="story-unavailable">
          <EyebrowLabel>STORIES</EyebrowLabel>
          <h1>This story is not available.</h1>
          <p>Stories are shared only with the contributor’s permission. This story may have been removed or is not available to view.</p>
          <Button to="/stories" variant="line">Back to Stories</Button>
        </Section>
      </>
    );
  }

  const base = import.meta.env.BASE_URL || '/';
  const imageUrl = `${base}images/${story.image}`; // images in public/images

  // Pull out a few other stories for the "more stories" row
  const moreStories = storiesData.stories
    .filter(s => s.id !== story.id && s.type === 'story' && s.consent)
    .slice(0, 3);

  return (
    <>
      <SEO title={`${story.title} – Unity Within`} description={story.quote} />

      {/* Hero with large image */}
      <header className="detail-hero" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="overlay">
          <EyebrowLabel>{story.type.toUpperCase()}</EyebrowLabel>
          <h1>{story.title}</h1>
          <p className="author-line">{story.author_display_name} – {story.role} – {story.date}</p>
        </div>
      </header>

      <Section className="story-body">
        {/* Quote as pull‑quote */}
        <blockquote className="pull-quote">{story.quote}</blockquote>
        {story.body && story.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}

        {/* Video handling */}
        {story.type === 'video' && (
          <div className="video-wrapper">
            {!showVideo ? (
              <img src={imageUrl} alt={story.title} className="video-poster" loading="lazy" />
            ) : (
              <iframe
                src={story.video_url}
                title={story.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            <Button onClick={() => setShowVideo(!showVideo)} variant="line">
              {showVideo ? 'Hide video' : 'Play video'}
            </Button>
          </div>
        )}
      </Section>

      {/* More stories */}
      <Section className="more-stories">
        <EyebrowLabel>More stories</EyebrowLabel>
        <div className="more-grid">
          {moreStories.map(s => (
            <Card key={s.id} className="more-card">
              <Link to={`/stories/${s.id}`}>
                <img src={`${base}images/${s.image}`} alt={s.title} loading="lazy" />
                <h3>{s.title}</h3>
                <p className="quote">{s.quote}</p>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* Share button */}
      <Section className="share-section">
        <Button variant="fill" onClick={shareStory}>
          Share this story
        </Button>
        <p className="share-status" role="status" aria-live="polite">{shareStatus}</p>
      </Section>
    </>
  );
}
