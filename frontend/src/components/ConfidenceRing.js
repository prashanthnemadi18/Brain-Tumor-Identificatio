import React from 'react';

// Circular confidence indicator (SVG donut) with animated stroke.
const ConfidenceRing = ({ value = 0, size = 140, stroke = 12, color = '#118ab2', label = 'Confidence' }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value));
  const offset = circumference * (1 - pct);

  return (
    <div className="confidence-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="confidence-ring__svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--ring-track)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="confidence-ring__progress"
        />
      </svg>
      <div className="confidence-ring__center">
        <span className="confidence-ring__value" style={{ color }}>
          {(pct * 100).toFixed(1)}%
        </span>
        <span className="confidence-ring__label">{label}</span>
      </div>
    </div>
  );
};

export default ConfidenceRing;
