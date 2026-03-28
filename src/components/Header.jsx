import { memo } from 'react';
import { format } from 'date-fns';
import { FiSun, FiMoon, FiMenu, FiZap } from 'react-icons/fi';
import './Header.css';

const Header = memo(function Header({ darkMode, onToggleDark, onToggleSidebar }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle menu">
          <FiMenu size={20} />
        </button>
        <div className="header-brand">
          <div className="header-logo">
            <FiZap size={18} />
          </div>
          <div className="header-brand-text">
            <h1 className="header-title">DoDaily</h1>
            <p className="header-subtitle">{format(new Date(), 'EEE, MMM d')}</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button
          className="theme-toggle"
          onClick={onToggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="theme-icon">
            {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
          </span>
        </button>
        <div className="header-avatar" aria-hidden="true">
          <span>U</span>
        </div>
      </div>
    </header>
  );
});

export default Header;
