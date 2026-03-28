import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotification } from './hooks/useNotification';
import './App.css';

const Dashboard = lazy(() => import('./components/Dashboard'));
const TodoList = lazy(() => import('./components/TodoList'));
const ReminderList = lazy(() => import('./components/ReminderList'));
const Statistics = lazy(() => import('./components/Statistics'));

const VALID_VIEWS = new Set(['dashboard', 'todos', 'reminders', 'stats']);

function getViewFromHash() {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  return VALID_VIEWS.has(hash) ? hash : 'dashboard';
}

function ViewLoader() {
  return (
    <div className="view-loader" role="status" aria-label="Loading view">
      <div className="view-loader-spinner" />
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState(getViewFromHash);
  const [darkMode, setDarkMode] = useLocalStorage('dodaily-dark', false);
  const [todos, setTodos] = useLocalStorage('dodaily-todos', []);
  const [reminders, setReminders] = useLocalStorage('dodaily-reminders', []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { toasts, dismissToast, dismissAllToasts } = useNotification(reminders);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveView(getViewFromHash());
      setSidebarOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), [setDarkMode]);
  const toggleSidebar = useCallback(() => setSidebarOpen((s) => !s), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleViewChange = useCallback((view) => {
    window.location.hash = `#/${view}`;
  }, []);

  const { activeTodoCount, activeReminderCount } = useMemo(() => {
    const now = new Date();
    return {
      activeTodoCount: todos.filter((t) => !t.completed).length,
      activeReminderCount: reminders.filter(
        (r) => !r.completed && new Date(r.datetime) >= now
      ).length,
    };
  }, [todos, reminders]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            todos={todos}
            reminders={reminders}
            setActiveView={handleViewChange}
          />
        );
      case 'todos':
        return <TodoList todos={todos} setTodos={setTodos} />;
      case 'reminders':
        return <ReminderList reminders={reminders} setReminders={setReminders} />;
      case 'stats':
        return <Statistics todos={todos} reminders={reminders} />;
      default:
        return null;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Header
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
        onToggleSidebar={toggleSidebar}
      />
      <div className="app-body">
        <Sidebar
          activeView={activeView}
          setActiveView={handleViewChange}
          todoCount={activeTodoCount}
          reminderCount={activeReminderCount}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={closeSidebar}
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeSidebar(); }}
          />
        )}
        <main className="main-content">
          <ErrorBoundary>
            <Suspense fallback={<ViewLoader />}>
              <div className="view-wrapper">{renderView()}</div>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <Toast
        toasts={toasts}
        onDismiss={dismissToast}
        onDismissAll={dismissAllToasts}
      />
    </div>
  );
}
