import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import MarkdownEditor from '../../components/MarkdownEditor';
import ImagePicker from '../../components/ImagePicker';
import ConsentPanel from '../../components/ConsentPanel';
import SafetyHelper from '../../components/SafetyHelper';
import { Button, Switch, Tag, Input, Select } from '../../components.jsx';

// Admin Story Editor (full page, two columns)
export default function StoryEditor() {
  const { id } = useParams(); // if editing existing story
  const navigate = useNavigate();
  const isNew = !id;
  const [story, setStory] = useState({
    type: 'story',
    title: '',
    author_name: '',
    author_role: '',
    anonymous: false,
    pull_quote: '',
    body: '',
    content_warning: '',
    tags: [],
    cover_url: '',
    cover_alt: '',
    video_url: '',
    featured: false,
    sort_order: 0,
    schedule: null,
    consent: {
      confirmed: false,
      method: '',
      date: '',
      note: '',
      photo_consent: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Load existing story if editing
  useEffect(() => {
    if (!isNew) {
      supabase.from('stories').select('*').eq('id', id).single().then(({ data, error }) => {
        if (error) console.error(error);
        else setStory({ ...data, anonymous: data.author_anonymous, tags: data.tags || [] });
      });
    }
  }, [id, isNew]);

  // Autosave every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) saveDraft(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [story, loading]);

  const handleChange = (field, value) => {
    setStory(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = (tag) => {
    setStory(prev => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const validateConsent = () => {
    const c = story.consent;
    if (!c.confirmed) return 'Consent must be confirmed.';
    if (!c.method) return 'Consent method required.';
    if (!c.date) return 'Consent date required.';
    if (story.cover_url && !c.photo_consent) return 'Photo consent required for cover image.';
    return null;
  };

  const saveDraft = async (isAuto = false) => {
    setLoading(true);
    const payload = { ...story, tags: story.tags, author_anonymous: story.anonymous };
    const { error } = await supabase.from('stories').upsert(payload, { returning: 'minimal' });
    setLoading(false);
    if (error) {
      console.error(error);
      if (!isAuto) setErrors({ submit: error.message });
    } else if (!isAuto) {
      setAutoSaveMessage('Draft saved');
    }
  };

  const handlePublish = async () => {
    const consentError = validateConsent();
    if (consentError) {
      setErrors({ consent: consentError });
      return;
    }
    const payload = { ...story, status: 'published', published_at: new Date().toISOString() };
    const { error } = await supabase.from('stories').upsert(payload);
    if (error) setErrors({ submit: error.message });
    else navigate('/admin/stories');
  };

  const schedulePublish = async (dateTime) => {
    const payload = { ...story, status: 'scheduled', schedule: dateTime };
    const { error } = await supabase.from('stories').upsert(payload);
    if (error) setErrors({ submit: error.message });
    else navigate('/admin/stories');
  };

  return (
    <div className='admin-editor two-col'>
      {/* LEFT FORM */}
      <div className='form-col'>
        <h2>{isNew ? 'Create Story' : 'Edit Story'}</h2>
        <Select label='Type' value={story.type} onChange={e => handleChange('type', e.target.value)}>
          <option value='story'>Story</option>
          <option value='testimonial'>Testimonial</option>
          <option value='video'>Video</option>
        </Select>
        <Input label='Title' value={story.title} onChange={e => handleChange('title', e.target.value)} required />
        <Switch
          label='Anonymous / First name only'
          checked={story.anonymous}
          onChange={e => handleChange('anonymous', e.target.checked)}
        />
        <Input label='Author display name' value={story.author_name} onChange={e => handleChange('author_name', e.target.value)} disabled={story.anonymous} />
        <Input label='Author role / label' value={story.author_role} onChange={e => handleChange('author_role', e.target.value)} />
        <Input label='Pull quote' value={story.pull_quote} onChange={e => handleChange('pull_quote', e.target.value)} />
        <MarkdownEditor
          label='Story body'
          value={story.body}
          onChange={v => handleChange('body', v)}
        />
        <Input label='Content warning' value={story.content_warning} onChange={e => handleChange('content_warning', e.target.value)} />
        <Tag.Input tags={story.tags} onAdd={handleTagAdd} onRemove={t => setStory(prev => ({ ...prev, tags: prev.tags.filter(x => x !== t) }))} />
        <ImagePicker
          label='Cover image'
          url={story.cover_url}
          altText={story.cover_alt}
          onSelect={(url, alt) => {
            handleChange('cover_url', url);
            handleChange('cover_alt', alt);
          }}
          requireAlt
        />
        <Input label='Video URL (YouTube/Vimeo)'
               value={story.video_url}
               onChange={e => handleChange('video_url', e.target.value)}
               placeholder='https://...'
        />
        <Switch label='Featured' checked={story.featured} onChange={e => handleChange('featured', e.target.checked)} />
        <Input type='number' label='Sort order' value={story.sort_order} onChange={e => handleChange('sort_order', Number(e.target.value))} />
        {/* Schedule controls */}
        <div className='schedule-controls'>
          <Button onClick={() => handlePublish()}>Publish now</Button>
          <Button onClick={() => saveDraft()}>Save as draft</Button>
          <Input type='datetime-local' label='Schedule for' onChange={e => schedulePublish(e.target.value)} />
        </div>
        {/* Consent Panel */}
        <ConsentPanel consent={story.consent} onChange={c => setStory(prev => ({ ...prev, consent: c }))} coverUsed={!!story.cover_url} />
        {/* Safety Helper */}
        <SafetyHelper text={story.body + ' ' + story.title + ' ' + story.pull_quote} />
        {errors.consent && <div className='error'>{errors.consent}</div>}
        {errors.submit && <div className='error'>{errors.submit}</div>}
        {autoSaveMessage && <div className='info'>{autoSaveMessage}</div>}
      </div>
      {/* RIGHT PREVIEW */}
      <div className='preview-col'>
        <h2>Live Preview</h2>
        <iframe
          title='Story preview'
          src={`/preview/story/${story.id || 'new'}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
}

