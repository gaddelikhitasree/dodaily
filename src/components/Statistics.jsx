import { useMemo, memo } from 'react';
import { FiCheckCircle, FiClock, FiBell, FiTarget } from 'react-icons/fi';
import './Statistics.css';

const DonutChart = memo(function DonutChart({ segments, size = 120, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const offsets = segments.reduce((acc, segment, i) => {
    const prev = i === 0 ? 0 : acc[i - 1].end;
    const pct = total > 0 ? segment.value / total : 0;
    const dash = pct * circumference;
    acc.push({ start: prev, end: prev + dash, dash });
    return acc;
  }, []);

  const paths = segments.map((segment, i) => (
    <circle
      key={segment.label}
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={segment.color}
      strokeWidth={strokeWidth}
      strokeDasharray={`${offsets[i].dash} ${circumference - offsets[i].dash}`}
      strokeDashoffset={-offsets[i].start}
      strokeLinecap="round"
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
      className="donut-segment"
    />
  ));

  return (
    <svg width={size} height={size} className="donut-chart" viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--hover-bg)"
        strokeWidth={strokeWidth}
      />
      {paths}
    </svg>
  );
});

const MiniStat = memo(function MiniStat(props) {
  return (
    <div className="mini-stat">
      <div className="mini-stat-icon" style={{ color: props.color, background: `${props.color}15` }}>
        <props.icon size={18} />
      </div>
      <div className="mini-stat-info">
        <span className="mini-stat-value">{props.value}</span>
        <span className="mini-stat-label">{props.label}</span>
      </div>
    </div>
  );
});

export default function Statistics({ todos, reminders }) {
  const stats = useMemo(() => {
    const categories = {};
    const priorities = { high: 0, medium: 0, low: 0 };

    todos.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + 1;
      if (!t.completed) priorities[t.priority]++;
    });

    const completedTodos = todos.filter((t) => t.completed).length;
    const completedReminders = reminders.filter((r) => r.completed).length;
    const activeTasks = todos.length - completedTodos;
    const completionRate = todos.length > 0
      ? Math.round((completedTodos / todos.length) * 100)
      : 0;

    return {
      totalTasks: todos.length,
      completedTasks: completedTodos,
      activeTasks,
      totalReminders: reminders.length,
      completedReminders,
      activeReminders: reminders.length - completedReminders,
      categories: Object.entries(categories).sort((a, b) => b[1] - a[1]),
      priorities,
      completionRate,
    };
  }, [todos, reminders]);

  const maxCategory = Math.max(...stats.categories.map(([, v]) => v), 1);

  const taskSegments = [
    { label: 'Completed', value: stats.completedTasks, color: 'var(--green)' },
    { label: 'Active', value: stats.activeTasks, color: 'var(--accent)' },
  ];

  const reminderSegments = [
    { label: 'Completed', value: stats.completedReminders, color: 'var(--green)' },
    { label: 'Active', value: stats.activeReminders, color: 'var(--accent-secondary)' },
  ];

  return (
    <div className="statistics">
      <div className="section-header">
        <h2>Analytics</h2>
      </div>

      <div className="stats-summary-row">
        <MiniStat icon={FiTarget} label="Total Tasks" value={stats.totalTasks} color="var(--accent)" />
        <MiniStat icon={FiCheckCircle} label="Completed" value={stats.completedTasks} color="var(--green)" />
        <MiniStat icon={FiClock} label="Active" value={stats.activeTasks} color="var(--blue)" />
        <MiniStat icon={FiBell} label="Reminders" value={stats.totalReminders} color="var(--accent-secondary)" />
      </div>

      <div className="stats-charts-row">
        <div className="chart-card">
          <h4>Task Distribution</h4>
          <div className="donut-wrapper">
            <DonutChart segments={taskSegments} />
            <div className="donut-center">
              <span className="donut-center-value">{stats.completionRate}%</span>
              <span className="donut-center-label">Done</span>
            </div>
          </div>
          <div className="chart-legend">
            {taskSegments.map((s) => (
              <div key={s.label} className="legend-item">
                <span className="legend-dot" style={{ background: s.color }} />
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h4>Reminder Status</h4>
          <div className="donut-wrapper">
            <DonutChart segments={reminderSegments} />
            <div className="donut-center">
              <span className="donut-center-value">{stats.totalReminders}</span>
              <span className="donut-center-label">Total</span>
            </div>
          </div>
          <div className="chart-legend">
            {reminderSegments.map((s) => (
              <div key={s.label} className="legend-item">
                <span className="legend-dot" style={{ background: s.color }} />
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-bottom-row">
        <div className="overview-card">
          <h4>Priority Breakdown</h4>
          <div className="priority-bars">
            {Object.entries(stats.priorities).map(([p, count]) => (
              <div key={p} className="priority-bar-row">
                <span className={`priority-label ${p}`}>{p}</span>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${p}`}
                    style={{
                      width: `${stats.activeTasks > 0 ? (count / stats.activeTasks) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {stats.categories.length > 0 && (
          <div className="overview-card">
            <h4>Tasks by Category</h4>
            <div className="chart-bars">
              {stats.categories.map(([cat, count]) => (
                <div key={cat} className="chart-bar-row">
                  <span className="chart-label">{cat}</span>
                  <div className="chart-track">
                    <div
                      className="chart-fill"
                      style={{ width: `${(count / maxCategory) * 100}%` }}
                    />
                  </div>
                  <span className="chart-value">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
