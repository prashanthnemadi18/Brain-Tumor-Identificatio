import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { predictionAPI } from '../../services/api';
import './Dashboard.css';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    const onUserUpdated = () => {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    };
    window.addEventListener('bt:user-updated', onUserUpdated);
    return () => window.removeEventListener('bt:user-updated', onUserUpdated);
  }, [navigate]);

  const loadStats = useCallback(async () => {
    try {
      const res = await predictionAPI.getStats();
      setStats(res.data);
    } catch (e) {
      console.error('stats load failed', e);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const res = await predictionAPI.getHistory(1, 50);
      setHistory(res.data.predictions || []);
    } catch (e) {
      console.error('history load failed', e);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadHistory();
  }, [loadStats, loadHistory]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const refresh = () => {
    loadStats();
    loadHistory();
  };

  return (
    <div className="dash-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
      />
      <div className="dash-main">
        <TopBar
          onMenu={() => setSidebarOpen(true)}
          user={user}
          search={search}
          onSearch={setSearch}
        />
        <main className="dash-content">
          <Outlet
            context={{ user, stats, history, refresh, loadHistory, search, onLogout: handleLogout }}
          />
        </main>
        <footer className="dash-disclaimer">
          This system is an AI-assisted research and preliminary screening tool. It is not
          intended to provide a medical diagnosis. AI predictions should be reviewed by a
          qualified healthcare professional.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
