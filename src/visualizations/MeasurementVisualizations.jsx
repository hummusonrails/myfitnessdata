import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, ComposedChart, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine, Brush } from 'recharts';
import CollapsibleTable from '../components/CollapsibleTable';

export default function MeasurementVisualizations({ data }) {
  const [chartType, setChartType] = useState('line');
  // Parse date and weight
  const chartData = data.map(row => ({
    date: row.Date,
    weight: parseFloat(row.Weight),
  })).filter(row => !isNaN(row.weight));

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button className={`px-2 py-1 rounded ${chartType === 'line' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setChartType('line')}>Line Chart</button>
        <button className={`px-2 py-1 rounded ${chartType === 'area' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setChartType('area')}>Area Chart</button>
        <button className={`px-2 py-1 rounded ${chartType === 'bar' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setChartType('bar')}>Bar Chart</button>
      </div>
      {chartType === 'line' && (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#f59e42" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {chartType === 'area' && (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="weight" stroke="#f59e42" fill="#fde68a" />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {chartType === 'bar' && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="weight" fill="#f59e42" />
          </BarChart>
        </ResponsiveContainer>
      )}
      <CollapsibleTable data={data} />
    </div>
  );
}
