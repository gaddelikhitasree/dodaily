import { memo } from 'react';

const ICONS = {
  tasks: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  reminders: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

const EmptyState = memo(function EmptyState({ type = 'tasks', title, hint }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-icon">{ICONS[type]}</span>
      <p>{title}</p>
      <span className="empty-hint">{hint}</span>
    </div>
  );
});

export default EmptyState;
