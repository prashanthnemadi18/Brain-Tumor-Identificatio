import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { IconMenu, IconSearch, IconBell, IconSun, IconMoon } from '../../components/icons';

const TopBar = ({ onMenu, user, search, onSearch }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <button className="topbar__menu" onClick={onMenu} aria-label="Open menu">
        <IconMenu />
      </button>

      <div className="topbar__search">
        <IconSearch width={18} height={18} />
        <input
          type="text"
          placeholder="Search analyses, reports…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="topbar__actions">
        <button className="topbar__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <IconMoon width={20} height={20} /> : <IconSun width={20} height={20} />}
        </button>
        <button className="topbar__icon-btn" aria-label="Notifications">
          <IconBell width={20} height={20} />
          <span className="topbar__dot" />
        </button>
        <div className="topbar__user">
          <span className="topbar__avatar">{(user?.name || 'U')[0].toUpperCase()}</span>
          <span className="topbar__user-name">{user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
