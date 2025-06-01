import React from 'react';

export default function SummaryCard({ title, value, unit, color = '', icon, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 shadow-md p-6 flex flex-col items-center justify-center min-h-[140px] bg-gradient-to-br from-white via-gray-50 to-gray-100 hover:shadow-lg transition-shadow duration-200 ${className}`}
      style={{ position: 'relative', transition: 'box-shadow 0.2s' }}
    >
      {icon && (
        <div className="mb-2">{icon}</div>
      )}
      <div className={`text-lg font-semibold mb-1 ${color}`}>{title}</div>
      <div className={`text-4xl font-extrabold mb-1 ${color}`} style={{ letterSpacing: '-0.02em' }}>{value}</div>
      {unit && <div className={`text-base font-medium opacity-70 ${color}`}>{unit}</div>}
    </div>
  );
}

