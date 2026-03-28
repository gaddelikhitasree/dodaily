import { useState, useMemo, useCallback } from 'react';
import ReminderItem from './ReminderItem';
import AddReminder from './AddReminder';
import EmptyState from './EmptyState';
import './ReminderList.css';

const FILTERS = ['upcoming', 'all', 'overdue', 'completed'];

export default function ReminderList({ reminders, setReminders }) {
  const [filter, setFilter] = useState('upcoming');

  const handleAdd = useCallback(
    (reminder) => setReminders((prev) => [reminder, ...prev]),
    [setReminders]
  );

  const handleToggle = useCallback(
    (id) => setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    ),
    [setReminders]
  );

  const handleDelete = useCallback(
    (id) => setReminders((prev) => prev.filter((r) => r.id !== id)),
    [setReminders]
  );

  const filteredReminders = useMemo(() => {
    const now = new Date();
    let result = [...reminders];

    switch (filter) {
      case 'upcoming':
        result = result.filter((r) => !r.completed && new Date(r.datetime) >= now);
        break;
      case 'overdue':
        result = result.filter((r) => !r.completed && new Date(r.datetime) < now);
        break;
      case 'completed':
        result = result.filter((r) => r.completed);
        break;
    }

    result.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    return result;
  }, [reminders, filter]);

  const { upcomingCount, overdueCount } = useMemo(() => {
    const now = new Date();
    return {
      upcomingCount: reminders.filter((r) => !r.completed && new Date(r.datetime) >= now).length,
      overdueCount: reminders.filter((r) => !r.completed && new Date(r.datetime) < now).length,
    };
  }, [reminders]);

  return (
    <div className="reminder-list-container">
      <div className="section-header">
        <h2>Reminders</h2>
        <div className="section-counts">
          <span className="count-badge active-badge">{upcomingCount} upcoming</span>
          {overdueCount > 0 && (
            <span className="count-badge overdue-badge">{overdueCount} overdue</span>
          )}
        </div>
      </div>

      <AddReminder onAdd={handleAdd} />

      <div className="reminder-filters" role="group" aria-label="Filter reminders">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`reminder-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {f}
            {f === 'overdue' && overdueCount > 0 && (
              <span className="filter-count">{overdueCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="reminder-list">
        {filteredReminders.length === 0 ? (
          <EmptyState
            type="reminders"
            title="No reminders found"
            hint="Set up a new reminder above!"
          />
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
