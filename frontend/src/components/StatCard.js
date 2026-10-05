import React from 'react';

// Compact statistic card used on Overview / Analytics.
const StatCard = ({ icon, value, label, accent = '#118ab2', hint }) => (
  <div className="stat-card-modern" style={{ '--accent': accent }}>
    <div className="stat-card-modern__icon">{icon}</div>
    <div className="stat-card-modern__body">
      <div className="stat-card-modern__value">{value}</div>
      <div className="stat-card-modern__label">{label}</div>
      {hint && <div className="stat-card-modern__hint">{hint}</div>}
    </div>
  </div>
);

export default StatCard;
