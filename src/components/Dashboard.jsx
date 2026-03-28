import { useMemo, memo } from 'react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import {
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
  FiArrowRight,
  FiList,
} from 'react-icons/fi';
import './Dashboard.css';

const SLICE_HIGH_PRIORITY = 5;
const SLICE_TOMORROW = 3;

const RingChart = memo(function RingChart({ value, size = 56, strokeWidth = 5, color = 'var(--accent)' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="ring-chart" role="img" aria-label={`${value}% complete`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--hover-bg)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="ring-chart-fill"
      />
    </svg>
  );
});

export default function Dashboard({ todos, reminders, setActiveView }) {
  const stats = useMemo(() => {
    const activeTodos = todos.filter((t) => !t.completed).length;
    const completedTodos = todos.filter((t) => t.completed).length;
    const totalTodos = todos.length;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    const overdueReminders = reminders.filter(
      (r) => !r.completed && isPast(new Date(r.datetime))
    ).length;
    const todayReminders = reminders.filter(
      (r) => !r.completed && isToday(new Date(r.datetime))
    );
    const tomorrowReminders = reminders.filter(
      (r) => !r.completed && isTomorrow(new Date(r.datetime))
    );
    const highPriorityTodos = todos.filter(
      (t) => !t.completed && t.priority === 'high'
    );

    return {
      activeTodos,
      completedTodos,
      totalTodos,
      completionRate,
      overdueReminders,
      todayReminders,
      tomorrowReminders,
      highPriorityTodos,
    };
  }, [todos, reminders]);

  const cards = useMemo(() => [
    { key: 'total', icon: FiList, value: stats.totalTodos, label: 'Total Tasks', scheme: 'cyan', view: 'todos' },
    { key: 'active', icon: FiClock, value: stats.activeTodos, label: 'Active Tasks', scheme: 'blue', view: 'todos' },
    { key: 'done', icon: FiCheckCircle, value: stats.completedTodos, label: 'Completed', scheme: 'green', view: 'todos' },
    { key: 'overdue', icon: FiAlertTriangle, value: stats.overdueReminders, label: 'Overdue', scheme: 'orange', view: 'reminders' },
    { key: 'rate', icon: FiTrendingUp, value: `${stats.completionRate}%`, label: 'Completion', scheme: 'purple', view: null },
  ], [stats.totalTodos, stats.activeTodos, stats.completedTodos, stats.overdueReminders, stats.completionRate]);

  return (
    <div className="dashboard">
      <div className="dashboard-greeting">
        <h2>Good {getGreeting()}!</h2>
        <p>Here&apos;s your productivity snapshot for {format(new Date(), 'EEEE, MMMM do')}</p>
      </div>

      <div className="stats-grid" role="list">
        {cards.map((card) => {
          const StatWrapper = card.view ? 'button' : 'div';
          const interactiveProps = card.view
            ? { onClick: () => setActiveView(card.view), type: 'button' }
            : { role: 'listitem' };

          return (
            <StatWrapper
              key={card.key}
              className={`stat-card ${card.view ? '' : 'static'}`}
              {...interactiveProps}
            >
              <div className={`stat-icon ${card.scheme}`}>
                <card.icon size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-number">{card.value}</span>
                <span className="stat-label">{card.label}</span>
              </div>
            </StatWrapper>
          );
        })}
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-section">
          <div className="section-title">
            <h3>High Priority</h3>
            {stats.highPriorityTodos.length > 0 && (
              <button type="button" className="see-all" onClick={() => setActiveView('todos')}>
                View all <FiArrowRight size={14} />
              </button>
            )}
          </div>
          {stats.highPriorityTodos.length === 0 ? (
            <p className="dashboard-empty">All clear — no urgent tasks!</p>
          ) : (
            <ul className="dashboard-list">
              {stats.highPriorityTodos.slice(0, SLICE_HIGH_PRIORITY).map((todo) => (
                <li key={todo.id} className="dashboard-list-item priority-high">
                  <span className="dl-dot" />
                  <span className="dl-text">{todo.title}</span>
                  <span className="dl-category">{todo.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-title">
            <h3>Today&apos;s Schedule</h3>
            {stats.todayReminders.length > 0 && (
              <button type="button" className="see-all" onClick={() => setActiveView('reminders')}>
                View all <FiArrowRight size={14} />
              </button>
            )}
          </div>
          {stats.todayReminders.length === 0 ? (
            <p className="dashboard-empty">No reminders for today.</p>
          ) : (
            <ul className="dashboard-list">
              {stats.todayReminders.map((r) => (
                <li key={r.id} className="dashboard-list-item">
                  <span className="dl-color" style={{ background: r.color }} />
                  <span className="dl-text">{r.title}</span>
                  <span className="dl-time">
                    {format(new Date(r.datetime), 'h:mm a')}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {stats.tomorrowReminders.length > 0 && (
            <>
              <h4 className="subheading">Tomorrow</h4>
              <ul className="dashboard-list">
                {stats.tomorrowReminders.slice(0, SLICE_TOMORROW).map((r) => (
                  <li key={r.id} className="dashboard-list-item muted">
                    <span className="dl-color" style={{ background: r.color }} />
                    <span className="dl-text">{r.title}</span>
                    <span className="dl-time">
                      {format(new Date(r.datetime), 'h:mm a')}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {stats.totalTodos > 0 && (
        <div className="progress-section">
          <div className="progress-content">
            <div className="progress-text-block">
              <h3>Overall Progress</h3>
              <p className="progress-detail">
                {stats.completedTodos} of {stats.totalTodos} tasks completed
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
            <div className="progress-ring-wrap">
              <RingChart value={stats.completionRate} size={72} strokeWidth={6} />
              <span className="progress-ring-label">{stats.completionRate}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
