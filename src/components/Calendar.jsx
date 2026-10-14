import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Button, Tag } from './components.jsx';

// Very lightweight month calendar – no external heavy lib
export default function CalendarView({ events }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group events by date string (YYYY-MM-DD)
  const eventsByDate = {};
  events.forEach(ev => {
    const dateKey = format(new Date(ev.start_at), 'yyyy-MM-dd');
    eventsByDate[dateKey] = eventsByDate[dateKey] || [];
    eventsByDate[dateKey].push(ev);
  });

  return (
    <div className='calendar-view'>
      <div className='calendar-grid'>
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDate[key] || [];
          return (
            <div key={key} className={`calendar-cell ${isToday(day) ? 'today' : ''}`}> 
              <div className='date-number'>{format(day, 'd')}</div>
              {dayEvents.map(ev => (
                <Tag key={ev.id} color='blue' className='event-tag'>
                  {ev.title}
                </Tag>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

