import { useEffect, useRef } from 'react';
import { Card, EyebrowLabel } from '../components.jsx';
import { useReveal } from '../hooks/useAnimations.js';
import { Link } from 'react-router-dom';
import '../pages/Stories.css';

export default function StoryCard({ story }) {
  const reveal = useReveal();
  const isVideo = story.type === 'video';
  const base = import.meta.env.BASE_URL || '/';
  const imageUrl = `${base}images/${story.image}`; // images in public/images

  return (
    <Card className="story-card" ref={reveal} data-reveal>
      <Link to={`/stories/${story.id}`}> {/* Using id as slug for simplicity */}
        <div className="image-wrapper">
          <img src={imageUrl} alt={story.title} loading="lazy" />
          {/* Large fuchsia quote mark */}
          <div className="quote-mark">❝</div>
        </div>
        <div className="author-portrait">
          <img src={imageUrl} alt={story.author_display_name} loading="lazy" />
        </div>
        <EyebrowLabel>{story.type.toUpperCase()}</EyebrowLabel>
        <h3 className="story-title">{story.title}</h3>
        <p className="story-quote">{story.quote}</p>
      </Link>
    </Card>
  );
}

