import React from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import { getTumorInfo, formatConfidence, formatDateShort } from '../../utils/tumorInfo';
import { IconBrain, IconChart, IconSpark, IconShield, IconHistory } from '../../components/icons';

const Overview = () => {
  const { user, stats, history } = useOutletContext();
  const navigate = useNavigate();

  const dist = stats?.class_distribution || {};
  const total = stats?.total_predictions || 0;
  const noTumor = dist.notumor || 0;
  const tumorDetections = total - noTumor;
  const avgConf = (stats?.average_confidence || 0) * 100;

  const recent = (history || []).slice(0, 5);
  const topCategory = Object.entries(dist).sort((a, b) => b[1] - a[1])[0];
  const maxCount = Math.max(1, ...Object.values(dist));

  return (
    <div className="page">
      {/* Welcome */}
      <section className="welcome-card">
        <div className="welcome-card__text">
          <span className="welcome-card__eyebrow">AI-Assisted Imaging</span>
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h1>
          <p>
            Analyze brain MRI images using AI-assisted image classification. Upload a scan to
            get a preliminary tumor category and confidence score in seconds.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/identification')}>
            <IconSpark width={18} height={18} />
            Start New Analysis
          </button>
        </div>
        <div className="welcome-card__art" aria-hidden="true">
          <IconBrain width={150} height={150} />
        </div>
      </section>

      {/* Stats */}
      <section className="grid-4">
        <StatCard icon={<IconSpark />} value={total} label="Total Analyses" accent="#118ab2" />
        <StatCard icon={<IconBrain />} value={tumorDetections} label="Possible Tumor Detections" accent="#ef476f" />
        <StatCard icon={<IconShield />} value={noTumor} label="No-Tumor Results" accent="#06d6a0" />
        <StatCard icon={<IconChart />} value={`${avgConf.toFixed(1)}%`} label="Average Confidence" accent="#f78c6b" />
      </section>

      <div className="grid-2-1">
        {/* Recent analyses */}
        <section className="panel">
          <div className="panel__head">
            <h2>Recent Analyses</h2>
            <Link to="/dashboard/history" className="panel__link">View all</Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-mini">
              <IconHistory width={30} height={30} />
              <p>No analyses yet. Run your first MRI scan to see results here.</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/identification')}>
                Analyze an MRI
              </button>
            </div>
          ) : (
            <ul className="recent-list">
              {recent.map((item) => {
                const info = getTumorInfo(item.predicted_class);
                return (
                  <li key={item.id} className="recent-row">
                    <span className="recent-thumb" style={{ borderColor: info.color }}>
                      <IconBrain width={22} height={22} style={{ color: info.color }} />
                    </span>
                    <div className="recent-meta">
                      <strong>{info.name}</strong>
                      <small>{item.image_filename} · {formatDateShort(item.timestamp)}</small>
                    </div>
                    <span className="pill" style={{ background: `${info.color}1a`, color: info.color }}>
                      {formatConfidence(item.confidence)}
                    </span>
                    <Link to={`/dashboard/history?open=${item.id}`} className="btn btn-ghost btn-sm">View</Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Analytics preview */}
        <section className="panel">
          <div className="panel__head">
            <h2>Category Distribution</h2>
            <Link to="/dashboard/analytics" className="panel__link">Analytics</Link>
          </div>
          {total === 0 ? (
            <div className="empty-mini">
              <p>Distribution will appear once you have analyses.</p>
            </div>
          ) : (
            <div className="dist-list">
              {Object.entries(dist).map(([key, count]) => {
                const info = getTumorInfo(key);
                return (
                  <div key={key} className="dist-item">
                    <div className="dist-item__top">
                      <span>{info.name}</span>
                      <strong>{count}</strong>
                    </div>
                    <div className="dist-bar">
                      <div className="dist-bar__fill" style={{ width: `${(count / maxCount) * 100}%`, background: info.color }} />
                    </div>
                  </div>
                );
              })}
              {topCategory && (
                <div className="dist-note">
                  Most frequent: <strong>{getTumorInfo(topCategory[0]).name}</strong>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Overview;
