import { memo, useEffect } from 'react';
import {
  FiGrid,
  FiCheckSquare,
  FiBell,
  FiBarChart2,
} from 'react-icons/fi';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { id: 'todos', label: 'Tasks', icon: FiCheckSquare },
  { id: 'reminders', label: 'Reminders', icon: FiBell },
  { id: 'stats', label: 'Analytics', icon: FiBarChart2 },
];

const Sidebar = memo(function Sidebar({
  activeView,
  setActiveView,
  todoCount,
  reminderCount,
  isOpen,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const getBadge = (id) => {
    if (id === 'todos' && todoCount > 0) return todoCount;
    if (id === 'reminders' && reminderCount > 0) return reminderCount;
    return null;
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const badge = getBadge(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-btn ${activeView === item.id ? 'active' : ''}`}
                onClick={() => setActiveView(item.id)}
                aria-current={activeView === item.id ? 'page' : undefined}
              >
                <item.icon size={19} />
                <span className="sidebar-label">{item.label}</span>
                {badge !== null && (
                  <span className={`sidebar-badge ${item.id === 'reminders' ? 'reminder' : ''}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => {
          const badge = getBadge(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              aria-label={item.label}
              aria-current={activeView === item.id ? 'page' : undefined}
            >
              <span className="mobile-nav-icon">
                <item.icon size={20} />
                {badge !== null && <span className="mobile-nav-badge">{badge}</span>}
              </span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
});

export default Sidebar;
