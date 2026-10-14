import React from 'react';
import { Input, Select, Switch, Button } from './components.jsx';

// ConsentPanel expects a consent object and onChange handler
export default function ConsentPanel({ consent, onChange, coverUsed }) {
  const handle = (field, value) => {
    onChange({ ...consent, [field]: value });
  };

  return (
    <fieldset className='consent-panel'>
      <legend>Consent required before publishing</legend>
      <Switch
        label='Consent confirmed'
        checked={consent.confirmed}
        onChange={e => handle('confirmed', e.target.checked)}
      />
      <Select
        label='Method'
        value={consent.method}
        onChange={e => handle('method', e.target.value)}
        disabled={!consent.confirmed}
      >
        <option value=''>Select method</option>
        <option value='written'>Written</option>
        <option value='verbal'>Verbal</option>
        <option value='digital'>Digital</option>
      </Select>
      <Input
        type='date'
        label='Consent date'
        value={consent.date}
        onChange={e => handle('date', e.target.value)}
        disabled={!consent.confirmed}
      />
      <Input
        label='Consent note'
        value={consent.note}
        onChange={e => handle('note', e.target.value)}
        disabled={!consent.confirmed}
        placeholder='Who gave consent and how?'
      />
      {coverUsed && (
        <Switch
          label='Photo of a person consent confirmed'
          checked={consent.photo_consent}
          onChange={e => handle('photo_consent', e.target.checked)}
          disabled={!consent.confirmed}
        />
      )}
    </fieldset>
  );
}

