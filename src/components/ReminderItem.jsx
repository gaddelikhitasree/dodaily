import { memo } from 'react';
import { FiTrash2, FiCheck, FiRepeat, FiClock } from 'react-icons/fi';
import { format, isPast, formatDistanceToNow } from 'date-fns';
import './ReminderItem.css';

const ReminderItem = memo(function ReminderItem({ reminder, onToggle, onDelete }) {
  const reminderDate = new Date(reminder.datetime);
  const isOverdue = isPast(reminderDate) && !reminder.completed;

  return (
    <div
      className={`reminder-item ${reminder.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
    >
      <div className="reminder-color-bar" style={{ background: reminder.color }} />

      <div className="reminder-body">
        <div className="reminder-top">
          <div className="reminder-title-wrap">
            <span className="reminder-title">{reminder.title}</span>
            {isOverdue && <span className="overdue-tag">Overdue</span>}
          </div>
          <div className="reminder-actions">
            <button
              className={`reminder-check-btn ${reminder.completed ? 'checked' : ''}`}
              onClick={() => onToggle(reminder.id)}
              aria-label={reminder.completed ? 'Mark active' : 'Mark complete'}
            >
              <FiCheck size={13} />
            </button>
            <button
              className="reminder-delete-btn"
              onClick={() => onDelete(reminder.id)}
              aria-label="Delete reminder"
            >
              <FiTrash2 size={13} />
            </button>
          </div>
        </div>

        <div className="reminder-details">
          <span className="reminder-time">
            <FiClock size={12} />
            {format(reminderDate, 'MMM dd, yyyy · h:mm a')}
          </span>
          {!reminder.completed && (
            <span className={`reminder-relative ${isOverdue ? 'text-red' : ''}`}>
              {formatDistanceToNow(reminderDate, { addSuffix: true })}
            </span>
          )}
          {reminder.repeat !== 'none' && (
            <span className="reminder-repeat">
              <FiRepeat size={12} />
              {reminder.repeat}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ReminderItem;
