import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  IconHome, IconBrain, IconChart, IconHistory,
  IconUser, IconSettings, IconLogout, IconClose,
} from '../../components/icons';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: IconHome, end: true },
  { to: '/dashboard/identification', label: 'Tumor Identification', icon: IconBrain },
  { to: '/dashboard/analytics', label: 'Analytics', icon: IconChart },
  { to: '/dashboard/history', label: 'Detection History', icon: IconHistory },
  { to: '/dashboard/profile', label: 'Profile', icon: IconUser },
  { to: '/dashboard/settings', label: 'Settings', icon: IconSettings },
];

const Sidebar = ({ open, onClose, onLogout, user }) => (
  <>
    {open && <div className="sidebar__scrim" onClick={onClose} />}
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__logo"><IconBrain width={26} height={26} /></span>
        <div className="sidebar__brand-text">
          <strong>NeuroScan AI</strong>
          <small>Tumor Identification</small>
        </div>
        <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
          <IconClose width={20} height={20} />
        </button>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <span className="sidebar__link-icon"><Icon /></span>
            <span className="sidebar__link-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <span className="sidebar__avatar">{(user?.name || 'U')[0].toUpperCase()}</span>
          <div className="sidebar__user-text">
            <strong>{user?.name || 'User'}</strong>
            <small>{user?.email || ''}</small>
          </div>
        </div>
        <button className="sidebar__logout" onClick={onLogout}>
          <IconLogout width={20} height={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  </>
);

export default Sidebar;
