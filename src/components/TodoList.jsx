import { useState, useMemo, useCallback } from 'react';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';
import EmptyState from './EmptyState';
import './TodoList.css';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'priority', label: 'Priority' },
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function TodoList({ todos, setTodos }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const handleAdd = useCallback(
    (todo) => setTodos((prev) => [todo, ...prev]),
    [setTodos]
  );

  const handleToggle = useCallback(
    (id) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))),
    [setTodos]
  );

  const handleDelete = useCallback(
    (id) => setTodos((prev) => prev.filter((t) => t.id !== id)),
    [setTodos]
  );

  const handleEdit = useCallback(
    (id, newTitle) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))),
    [setTodos]
  );

  const handleClearCompleted = useCallback(
    () => setTodos((prev) => prev.filter((t) => !t.completed)),
    [setTodos]
  );

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(query));
    }

    switch (filter) {
      case 'active':
        result = result.filter((t) => !t.completed);
        break;
      case 'completed':
        result = result.filter((t) => t.completed);
        break;
      case 'high':
      case 'medium':
      case 'low':
        result = result.filter((t) => t.priority === filter);
        break;
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'priority':
        result.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
        break;
    }

    return result;
  }, [todos, filter, search, sortBy]);

  const activeCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  return (
    <div className="todo-list-container">
      <div className="section-header">
        <h2>Tasks</h2>
        <div className="section-counts">
          <span className="count-badge active-badge">{activeCount} active</span>
          <span className="count-badge done-badge">{completedCount} done</span>
        </div>
      </div>

      <AddTodo onAdd={handleAdd} />

      <div className="todo-controls">
        <div className="search-box">
          <FiSearch size={15} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <FiX size={14} />
            </button>
          )}
        </div>

        <div className="filter-group">
          <FiFilter size={15} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter tasks">
            {FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort tasks">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <EmptyState
            type="tasks"
            title="No tasks found"
            hint={search ? 'Try a different search term' : 'Create your first task above!'}
          />
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {completedCount > 0 && (
        <button className="clear-completed-btn" onClick={handleClearCompleted}>
          Clear {completedCount} completed task{completedCount !== 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
}
