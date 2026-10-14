import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import DataTable from '../../components/DataTable';
import BulkActionBar from '../../components/BulkActionBar';
import { Button, Tag } from '../../components.jsx';
import useUrgentFlag from '../../hooks/useUrgentFlag';

// Admin Submissions Inbox (staff only)
export default function SubmissionsList() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '' });

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('submissions')
      .select(`id, status, received_at, anonymous, content, contact_email, contact_phone`);
    if (error) console.error(error);
    else setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Apply urgent flag detection
  const flagged = useUrgentFlag(submissions.map(s => s.content).join(' '));

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      if (search && !s.content.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.status && s.status !== filters.status) return false;
      return true;
    });
  }, [submissions, search, filters]);

  const columns = [
    { header: 'Status', accessor: 'status' },
    { header: 'Received', accessor: 'received_at', render: d => new Date(d).toLocaleString() },
    { header: 'Anonymous', accessor: 'anonymous', render: a => a ? <Tag color='gray'>Anonymous</Tag> : null },
    { header: 'Urgent', accessor: 'content', render: (_, row) => flagged.includes(row.id) ? <Tag color='red'>Urgent</Tag> : null },
    { header: 'Actions', render: row => (
        <div className='row-actions'>
          <Button onClick={() => navigate(`/admin/submissions/${row.id}`)}>View</Button>
        </div>
      ) }
  ];

  return (
    <div className='admin-section'>
      <h1>Submissions Inbox</h1>
      <div className='toolbar'>
        <input type='text' placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)} />
        <select onChange={e => setFilters({ ...filters, status: e.target.value })} defaultValue=''>
          <option value=''>All Statuses</option>
          <option value='new'>New</option>
          <option value='in_review'>In Review</option>
          <option value='needs_follow_up'>Needs Follow‑up</option>
          <option value='approved'>Approved</option>
          <option value='rejected'>Rejected</option>
        </select>
      </div>
      <BulkActionBar selectedCount={selected.length} onAction={() => {}} />
      <DataTable columns={columns} data={filtered} loading={loading} selected={selected} setSelected={setSelected} />
    </div>
  );
}

