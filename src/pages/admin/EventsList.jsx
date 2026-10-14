import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import DataTable from '../../components/DataTable';
import BulkActionBar from '../../components/BulkActionBar';
import CalendarView from '../../components/Calendar';
import { Button, Tag, Input, Select, Switch } from '../../components.jsx';

// Admin Events List – supports table & calendar toggle
export default function EventsList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '', month: '' });

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select(`id, image_url, title, type, start_at, end_at, location, status, registration_link, updated_at`);
    if (error) console.error(error);
    else setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.type && ev.type !== filters.type) return false;
      if (filters.status && ev.status !== filters.status) return false;
      if (filters.month) {
        const evMonth = new Date(ev.start_at).toLocaleString('default', { month: 'numeric' });
        if (evMonth !== filters.month) return false;
      }
      return true;
    });
  }, [events, search, filters]);

  const columns = [
    { header: 'Image', accessor: 'image_url', render: url => url ? <img src={url} alt='' className='thumb' /> : null },
    { header: 'Title', accessor: 'title' },
    { header: 'Type', accessor: 'type' },
    {
      header: 'When',
      accessor: 'start_at',
      render: (_, row) => {
        const start = new Date(row.start_at);
        const end = new Date(row.end_at);
        const sameDay = start.toDateString() === end.toDateString();
        return sameDay ? `${start.toLocaleDateString()} ${start.toLocaleTimeString()} – ${end.toLocaleTimeString()}`
          : `${start.toLocaleString()} – ${end.toLocaleString()}`;
      },
    },
    { header: 'Location', accessor: 'location' },
    { header: 'Status', accessor: 'status' },
    { header: 'Reg?', accessor: 'registration_link', render: link => link ? <Tag color='green'>Yes</Tag> : <Tag color='gray'>No</Tag> },
    { header: 'Updated', accessor: 'updated_at', render: d => new Date(d).toLocaleDateString() },
    {
      header: 'Actions',
      render: row => (
        <div className='row-actions'>
          <Button onClick={() => navigate(`/admin/events/edit/${row.id}`)}>Edit</Button>
          <Button onClick={() => duplicate(row.id)}>Duplicate</Button>
          <Button onClick={() => viewHistory(row.id)}>History</Button>
        </div>
      ),
    },
  ];

  const handleBulk = async (action) => {
    if (!selected.length) return;
    switch (action) {
      case 'duplicate':
        await Promise.all(selected.map(id => duplicate(id)));
        break;
      // add more bulk actions as needed
      default: break;
    }
    fetchEvents();
    setSelected([]);
  };

  const duplicate = async (id) => {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) return console.error(error);
    const { id: _, ...rest } = data;
    await supabase.from('events').insert({ ...rest, title: rest.title + ' (copy)' });
  };

  const viewHistory = (id) => navigate(`/admin/events/history/${id}`);

  return (
    <div className='admin-section'>
      <h1>Events</h1>

      <div className='toolbar'>
        <Input placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)} />
        <Select onChange={e => setFilters({ ...filters, type: e.target.value })} defaultValue=''>
          <option value=''>All Types</option>
          <option value='campus_dialogue'>Campus Dialogue</option>
          <option value='awareness_week'>Awareness Week</option>
          <option value='listening_circle'>Listening Circle</option>
          <option value='workshop'>Workshop</option>
          <option value='wmh_day'>World Mental Health Day</option>
          <option value='graduation'>Graduation</option>
          <option value='training'>Training</option>
          <option value='other'>Other</option>
        </Select>
        <Select onChange={e => setFilters({ ...filters, status: e.target.value })} defaultValue=''>
          <option value=''>All Statuses</option>
          <option value='upcoming'>Upcoming</option>
          <option value='past'>Past</option>
          <option value='draft'>Draft</option>
          <option value='scheduled'>Scheduled</option>
          <option value='cancelled'>Cancelled</option>
          <option value='archived'>Archived</option>
        </Select>
        <Select onChange={e => setFilters({ ...filters, month: e.target.value })} defaultValue=''>
          <option value=''>All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i+1} value={(i+1).toString().padStart(2, '0')}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </Select>
        <Button onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}>
          {viewMode === 'table' ? 'Show Calendar' : 'Show Table'}
        </Button>
      </div>

      <BulkActionBar selectedCount={selected.length} onAction={handleBulk} />

      {viewMode === 'table' ? (
        <DataTable columns={columns} data={filteredEvents} loading={loading} selected={selected} setSelected={setSelected} />
      ) : (
        <CalendarView events={filteredEvents} />
      )}
    </div>
  );
}

