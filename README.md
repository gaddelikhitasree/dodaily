# DoDaily — Reminders & To-Do App

A modern productivity app built with React 19 + Vite 8 for managing tasks and reminders with browser notifications.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher (comes with Node.js)

## Installation

```bash
git clone <repo-url> dodaily
cd dodaily
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all source files |

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Dates | date-fns 4 |
| Icons | react-icons 5 |
| Linting | ESLint 9 |
| Language | JavaScript (ES Modules) |

## Dependencies

**Runtime** — defined in `package.json` under `dependencies`:

- `react` / `react-dom` — UI framework
- `date-fns` — date formatting and comparison
- `react-icons` — SVG icon library

**Development** — defined in `package.json` under `devDependencies`:

- `vite` + `@vitejs/plugin-react` — build tooling
- `eslint` + plugins — code quality

All dependencies are managed via `package.json`. Running `npm install` will install everything needed.

## Project Structure

```
src/
├── main.jsx                  # Entry point (StrictMode)
├── App.jsx                   # Root component, routing, state
├── App.css
├── index.css                 # Design system tokens, themes
├── components/
│   ├── Header.jsx / .css     # Top bar with brand + theme toggle
│   ├── Sidebar.jsx / .css    # Navigation (desktop + mobile)
│   ├── Dashboard.jsx / .css  # Overview stats + today's schedule
│   ├── TodoList.jsx / .css   # Task list with filter/search/sort
│   ├── TodoItem.jsx / .css   # Individual task card
│   ├── AddTodo.jsx / .css    # New task form
│   ├── ReminderList.jsx/.css # Reminder list with filters
│   ├── ReminderItem.jsx/.css # Individual reminder card
│   ├── AddReminder.jsx/.css  # New reminder form
│   ├── Statistics.jsx / .css # Analytics charts
│   ├── Toast.jsx / .css      # Notification toasts
│   ├── EmptyState.jsx        # Shared empty state component
│   ├── ErrorBoundary.jsx/.css# Error boundary wrapper
└── hooks/
    ├── useLocalStorage.js    # Persistent state with cross-tab sync
    └── useNotification.js    # Reminder polling + browser notifications
```

## Features

- Task management with priority levels and categories
- Reminder scheduling with color coding and repeat options
- Browser push notifications when reminders are due
- Dashboard with stats, progress ring, and today's schedule
- Analytics with donut charts and category/priority breakdowns
- Light/dark theme with glassmorphism design
- Hash-based routing with browser back/forward support
- Code-split views via React.lazy for faster initial load
- Fully responsive (mobile bottom nav + collapsible sidebar)
- Cross-tab localStorage sync
- Accessible (ARIA labels, keyboard navigation, reduced motion)
