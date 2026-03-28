import { useState, useCallback } from 'react';
import axios from 'axios';
import { FiBell } from 'react-icons/fi';
import './AddReminder.css';

const REPEAT_OPTIONS = [
  { value: 'none', label: 'No repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const COLORS = [
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#ec4899', name: 'Pink' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#06b6d4', name: 'Cyan' },
];

export default function AddReminder({ onAdd }) {
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [datetime, setDatetime] = useState('');
  const [repeat, setRepeat] = useState('none');
  const [color, setColor] = useState(COLORS[0].hex);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const trimmed = title.trim();

      if (!trimmed || !datetime || !email) return;

      try {
        await axios.post('http://localhost:5000/api/reminders', {
          title: trimmed,
          email,
          reminderTime: datetime,
        });

        onAdd({
          id: crypto.randomUUID(),
          title: trimmed,
          email,
          datetime,
          repeat,
          color,
          completed: false,
          createdAt: new Date().toISOString(),
        });

        alert('Reminder saved successfully');

        setTitle('');
        setEmail('');
        setDatetime('');
        setRepeat('none');
        setColor(COLORS[0].hex);
      } catch (error) {
        console.log(error);
        alert('Failed to save reminder');
      }
    },
    [title, email, datetime, repeat, color, onAdd]
  );

  const canSubmit = title.trim() && datetime && email;

  return (
    <form className="add-reminder" onSubmit={handleSubmit}>
      <h3 className="add-reminder-title">
        <FiBell size={16} /> New Reminder
      </h3>

      <div className="reminder-form-grid">
        <div className="form-field span-2">
          <label htmlFor="reminder-title">Title</label>
          <input
            id="reminder-title"
            type="text"
            placeholder="Remind me to..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="reminder-input"
          />
        </div>

        <div className="form-field span-2">
          <label htmlFor="reminder-email">Email</label>
          <input
            id="reminder-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="reminder-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="reminder-datetime">Date & Time</label>
          <input
            id="reminder-datetime"
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="reminder-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="reminder-repeat">Repeat</label>
          <select
            id="reminder-repeat"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="reminder-input"
          >
            {REPEAT_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field span-2">
          <label>Color</label>
          <div className="color-picks" role="group" aria-label="Select reminder color">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                className={`color-dot ${color === c.hex ? 'selected' : ''}`}
                style={{ background: c.hex }}
                onClick={() => setColor(c.hex)}
                aria-label={c.name}
                aria-pressed={color === c.hex}
              />
            ))}
          </div>
        </div>
      </div>

      <button type="submit" className="add-reminder-btn" disabled={!canSubmit}>
        <FiBell size={15} />
        Set Reminder
      </button>
    </form>
  );
}