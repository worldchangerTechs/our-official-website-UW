import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import BulkActionBar from '../../components/BulkActionBar';
import { Button, Tag } from '../../components.jsx';

// Admin Stories List
export default function StoriesList() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ type: '', status: '', consent: '', tags: '' });
  const [search, setSearch] = useState('');

  const fetchStories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stories')
      .select(`id, cover_url, title, type, author_name, status, consent_confirmed, featured, published_at, updated_at, tags`);
    if (error) console.error(error);
    else setStories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter(s => {
      if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.type && s.type !== filters.type) return false;
      if (filters.status && s.status !== filters.status) return false;
      if (filters.consent && !!s.consent_confirmed !== (filters.consent === 'confirmed')) return false;
      if (filters.tags && !(s.tags && s.tags.includes(filters.tags))) return false;
      return true;
    });
  }, [stories, search, filters]);

  const columns = [
    { header: 'Cover', accessor: 'cover_url', render: url => <img src={url} alt='' className='thumb' /> },
    { header: 'Title', accessor: 'title' },
    { header: 'Type', accessor: 'type' },
    { header: 'Author', accessor: 'author_name' },
    { header: 'Status', accessor: 'status' },
    { header: 'Consent', accessor: 'consent_confirmed', render: c => c ? <Tag color='green'>Consent confirmed</Tag> : <Tag color='red'>Consent needed</Tag> },
    { header: 'Featured', accessor: 'featured', render: f => f ? '★' : '' },
    { header: 'Published', accessor: 'published_at', render: d => d ? new Date(d).toLocaleDateString() : '' },
    { header: 'Updated', accessor: 'updated_at', render: d => d ? new Date(d).toLocaleDateString() : '' },
    { header: 'Actions', render: row => (
        <div className='row-actions'>
          <Button onClick={() => navigate(`/admin/stories/edit/${row.id}`)}>Edit</Button>
          <Button onClick={() => navigate(`/stories/${row.id}`)}>Preview</Button>
          <Button onClick={() => duplicate(row.id)}>Duplicate</Button>
          <Button onClick={() => viewHistory(row.id)}>History</Button>
          <Button onClick={() => archive(row.id)}>Archive</Button>
        </div>
      ) }
  ];

  const handleBulk = async (action) => {
    if (!selected.length) return;
    const updates = selected.map(id => ({ id }));
    // Simple switch – real implementation would call a RPC or batch update
    switch(action) {
      case 'publish':
        await supabase.from('stories').update({ status: 'published' }).in('id', selected);
        break;
      case 'unpublish':
        await supabase.from('stories').update({ status: 'draft' }).in('id', selected);
        break;
      case 'archive':
        await supabase.from('stories').update({ status: 'archived' }).in('id', selected);
        break;
      case 'feature':
        await supabase.from('stories').update({ featured: true }).in('id', selected);
        break;
      case 'addTag':
        // placeholder – in real code we'd merge tags array
        break;
      default:
        break;
    }
    fetchStories();
    setSelected([]);
  };

  const duplicate = async (id) => {
    const { data, error } = await supabase.from('stories').select('*').eq('id', id).single();
    if (error) return console.error(error);
    const { id: _, ...rest } = data;
    await supabase.from('stories').insert({ ...rest, title: rest.title + ' (copy)', status: 'draft' });
    fetchStories();
  };

  const viewHistory = (id) => navigate(`/admin/stories/history/${id}`);
  const archive = async (id) => {
    await supabase.from('stories').update({ status: 'archived' }).eq('id', id);
    fetchStories();
  };

  return (
    <div className='admin-section'>
      <h1>Stories</h1>
      <div className='toolbar'>
        <input type='text' placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)} />
        {/* Filters UI – simplified */}
        <select onChange={e => setFilters({ ...filters, type: e.target.value })} defaultValue=''>
          <option value=''>All Types</option>
          <option value='story'>Story</option>
          <option value='testimonial'>Testimonial</option>
          <option value='video'>Video</option>
        </select>
        <select onChange={e => setFilters({ ...filters, status: e.target.value })} defaultValue=''>
          <option value=''>All Statuses</option>
          <option value='draft'>Draft</option>
          <option value='scheduled'>Scheduled</option>
          <option value='published'>Published</option>
          <option value='archived'>Archived</option>
        </select>
        {/* Add more filters as needed */}
      </div>
      <BulkActionBar selectedCount={selected.length} onAction={handleBulk} />
      <DataTable columns={columns} data={filteredStories} loading={loading} selected={selected} setSelected={setSelected} />
    </div>
  );
}

