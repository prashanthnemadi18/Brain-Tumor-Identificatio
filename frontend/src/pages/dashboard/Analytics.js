import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, PointElement, LineElement, Title, Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import StatCard from '../../components/StatCard';
import { getTumorInfo, TUMOR_INFO } from '../../utils/tumorInfo';
import { useTheme } from '../../context/ThemeContext';
import { IconSpark, IconBrain, IconShield, IconChart } from '../../components/icons';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
  BarElement, PointElement, LineElement, Title, Filler
);

const Analytics = () => {
  const { stats, history } = useOutletContext();
  const { theme } = useTheme();
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,40,80,0.08)';
  const tickColor = theme === 'dark' ? '#9db0c7' : '#5a6b82';

  const dist = stats?.class_distribution || {};
  const total = stats?.total_predictions || 0;
  const noTumor = dist.notumor || 0;
  const tumorDetections = total - noTumor;
  const avgConf = (stats?.average_confidence || 0) * 100;

  const entries = Object.entries(dist);
  const top = entries.slice().sort((a, b) => b[1] - a[1])[0];

  // Trend: analyses per day (last 7 days)
  const trend = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    const counts = days.map((d) => {
      const next = new Date(d); next.setDate(d.getDate() + 1);
      return (history || []).filter((h) => {
        const t = new Date(h.timestamp);
        return t >= d && t < next;
      }).length;
    });
    return {
      labels: days.map((d) => d.toLocaleDateString('en-US', { weekday: 'short' })),
      counts,
    };
  }, [history]);

  // Confidence buckets from loaded history
  const buckets = useMemo(() => {
    const b = { '<70%': 0, '70–85%': 0, '85–95%': 0, '95–100%': 0 };
    (history || []).forEach((h) => {
      const c = h.confidence * 100;
      if (c < 70) b['<70%']++;
      else if (c < 85) b['70–85%']++;
      else if (c < 95) b['85–95%']++;
      else b['95–100%']++;
    });
    return b;
  }, [history]);

  const doughnutData = {
    labels: entries.map(([k]) => getTumorInfo(k).name),
    datasets: [{
      data: entries.map(([, v]) => v),
      backgroundColor: entries.map(([k]) => getTumorInfo(k).color),
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const barData = {
    labels: entries.map(([k]) => getTumorInfo(k).name),
    datasets: [{
      label: 'Detections',
      data: entries.map(([, v]) => v),
      backgroundColor: entries.map(([k]) => getTumorInfo(k).color),
      borderRadius: 8,
      maxBarThickness: 46,
    }],
  };

  const lineData = {
    labels: trend.labels,
    datasets: [{
      label: 'Analyses',
      data: trend.counts,
      borderColor: TUMOR_INFO.meningioma.color,
      backgroundColor: 'rgba(17,138,178,0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: TUMOR_INFO.meningioma.color,
    }],
  };

  const barData2 = {
    labels: Object.keys(buckets),
    datasets: [{
      label: 'Analyses',
      data: Object.values(buckets),
      backgroundColor: ['#f78c6b', '#118ab2', '#06d6a0', '#8d99ae'],
      borderRadius: 8,
      maxBarThickness: 46,
    }],
  };

  const legendOpts = { position: 'bottom', labels: { color: tickColor, usePointStyle: true, padding: 16 } };
  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: legendOpts },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor, precision: 0 }, beginAtZero: true },
    },
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Analytics</h1>
          <p className="page-head__sub">Insights across all of your MRI analyses.</p>
        </div>
      </div>

      <section className="grid-4">
        <StatCard icon={<IconSpark />} value={total} label="Total Analyses" accent="#118ab2" />
        <StatCard icon={<IconBrain />} value={tumorDetections} label="Possible Tumor Detections" accent="#ef476f" />
        <StatCard icon={<IconShield />} value={noTumor} label="No-Tumor Results" accent="#06d6a0" />
        <StatCard icon={<IconChart />} value={`${avgConf.toFixed(1)}%`} label="Avg. Confidence" accent="#f78c6b" />
      </section>

      {total === 0 ? (
        <div className="panel">
          <div className="empty-mini empty-mini--tall">
            <IconChart width={44} height={44} />
            <p>No data yet. Complete an MRI analysis to populate your analytics dashboard.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid-2">
            <section className="panel">
              <div className="panel__head"><h2>Tumor Category Distribution</h2></div>
              <div className="chart-box chart-box--donut">
                <Doughnut data={doughnutData} options={{ ...baseOpts, cutout: '62%', scales: {} }} />
              </div>
            </section>
            <section className="panel">
              <div className="panel__head"><h2>Detections by Category</h2></div>
              <div className="chart-box"><Bar data={barData} options={{ ...baseOpts, plugins: { legend: { display: false } } }} /></div>
            </section>
          </div>

          <div className="grid-2">
            <section className="panel">
              <div className="panel__head"><h2>Analysis Activity (Last 7 Days)</h2></div>
              <div className="chart-box"><Line data={lineData} options={{ ...baseOpts, plugins: { legend: { display: false } } }} /></div>
            </section>
            <section className="panel">
              <div className="panel__head"><h2>Confidence Distribution</h2></div>
              <div className="chart-box"><Bar data={barData2} options={{ ...baseOpts, plugins: { legend: { display: false } } }} /></div>
            </section>
          </div>

          <section className="panel">
            <div className="panel__head"><h2>Summary</h2></div>
            <div className="summary-grid">
              <div className="summary-stat">
                <span>Most frequently detected</span>
                <strong style={{ color: top ? getTumorInfo(top[0]).color : undefined }}>
                  {top ? getTumorInfo(top[0]).name : '—'}
                </strong>
              </div>
              <div className="summary-stat">
                <span>Average prediction confidence</span>
                <strong>{avgConf.toFixed(1)}%</strong>
              </div>
              <div className="summary-stat">
                <span>Tumor vs. no-tumor ratio</span>
                <strong>{tumorDetections} : {noTumor}</strong>
              </div>
              <div className="summary-stat">
                <span>Categories observed</span>
                <strong>{entries.length}</strong>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Analytics;
