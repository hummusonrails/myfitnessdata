import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area, ComposedChart, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine, Brush } from 'recharts';
import CollapsibleTable from '../components/CollapsibleTable';

const chartTypes = [
  { key: 'bar', label: 'Bar Chart' },
  { key: 'line', label: 'Line Chart' },
  { key: 'area', label: 'Area Chart' },
];

export default function ExerciseVisualizations({ data }) {
  const [view, setView] = useState('calories');
  const [chartType, setChartType] = useState('bar');

  // Prepare chart data
  const dailyData = {};
  data.forEach(row => {
    const date = row.Date;
    if (!date) return;
    if (!dailyData[date]) dailyData[date] = { date, calories: 0, minutes: 0, steps: 0 };
    dailyData[date].calories += parseFloat(row['Exercise Calories'] || 0);
    dailyData[date].minutes += parseFloat(row['Exercise Minutes'] || 0);
    dailyData[date].steps += parseFloat(row['Steps'] || 0);
  });
  const chartData = Object.values(dailyData);

  // Helper to pick chart for current subcategory
  const renderChart = (dataKey, color) => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color + '33'} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-1 rounded ${view === 'calories' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('calories')}>Calories</button>
        <button className={`px-3 py-1 rounded ${view === 'minutes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('minutes')}>Minutes</button>
        <button className={`px-3 py-1 rounded ${view === 'steps' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('steps')}>Steps</button>
      </div>
      <div className="flex gap-2 mb-2">
        {chartTypes.map(opt => (
          <button key={opt.key} className={`px-2 py-1 rounded ${chartType === opt.key ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setChartType(opt.key)}>{opt.label}</button>
        ))}
      </div>
      {view === 'calories' && renderChart('calories', '#60a5fa')}
      {view === 'minutes' && renderChart('minutes', '#f472b6')}
      {view === 'steps' && renderChart('steps', '#22d3ee')}
      <CollapsibleTable data={data} />
    </div>
  );
}
