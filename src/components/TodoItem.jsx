import { useState, memo, useCallback } from 'react';
import { FiTrash2, FiEdit3, FiCheck, FiX } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import './TodoItem.css';

const PRIORITY_COLORS = {
  low: 'var(--green)',
  medium: 'var(--amber)',
  high: 'var(--red)',
};

const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = useCallback(() => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      onEdit(todo.id, trimmed);
    }
    setEditing(false);
  }, [editTitle, todo.id, todo.title, onEdit]);

  const handleCancel = useCallback(() => {
    setEditTitle(todo.title);
    setEditing(false);
  }, [todo.title]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      style={{ '--priority-color': PRIORITY_COLORS[todo.priority] }}
    >
      <button
        className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && <FiCheck size={13} />}
      </button>

      <div className="todo-content">
        {editing ? (
          <input
            className="todo-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            aria-label="Edit task title"
            autoFocus
          />
        ) : (
          <>
            <span className="todo-title">{todo.title}</span>
            <div className="todo-meta">
              <span className="todo-priority" data-level={todo.priority}>{todo.priority}</span>
              <span className="todo-category">{todo.category}</span>
              <span className="todo-time">
                {formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true })}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="todo-actions">
        {editing ? (
          <>
            <button className="action-btn save" onClick={handleSave} aria-label="Save">
              <FiCheck size={15} />
            </button>
            <button className="action-btn cancel" onClick={handleCancel} aria-label="Cancel">
              <FiX size={15} />
            </button>
          </>
        ) : (
          <>
            <button className="action-btn edit" onClick={() => setEditing(true)} aria-label="Edit">
              <FiEdit3 size={15} />
            </button>
            <button className="action-btn delete" onClick={() => onDelete(todo.id)} aria-label="Delete">
              <FiTrash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default TodoItem;
