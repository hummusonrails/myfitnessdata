import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine, Brush } from 'recharts';
import CollapsibleTable from '../components/CollapsibleTable';

const nutritionCategories = [
  'Fat', 'Carbohydrates (g)', 'Protein (g)', 'Sugar', 'Fiber', 'Sodium (mg)', 'Cholesterol',
];

const macroViews = [
  { key: 'bar', label: 'Bar Chart' },
  { key: 'stacked', label: 'Stacked Area' },
  { key: 'pie', label: 'Pie (Avg)' }
];
const sugarViews = [
  { key: 'line', label: 'Line Chart' },
  { key: 'area', label: 'Area Chart' }
];
const sodiumViews = [
  { key: 'line', label: 'Line Chart' },
  { key: 'area', label: 'Area Chart' }
];

const COLORS = ['#fbbf24', '#38bdf8', '#34d399', '#ef4444', '#a3e635', '#6366f1', '#f472b6'];

export default function NutritionVisualizations({ data }) {
  const [view, setView] = useState('macros');
  const [macroChart, setMacroChart] = useState('bar');
  const [sugarChart, setSugarChart] = useState('line');
  const [sodiumChart, setSodiumChart] = useState('line');

  // Aggregate by date
  const dailyData = data.reduce((acc, row) => {
    const date = row[Object.keys(row)[0]];
    if (!acc[date]) acc[date] = { date };
    nutritionCategories.forEach(cat => {
      acc[date][cat] = (acc[date][cat] || 0) + parseFloat(row[cat] || 0);
    });
    return acc;
  }, {});
  const chartData = Object.values(dailyData);

  // Pie data for average macros
  const macroPie = nutritionCategories.slice(0, 3).map((cat, i) => ({
    name: cat,
    value: chartData.reduce((sum, row) => sum + (parseFloat(row[cat]) || 0), 0) / chartData.length || 0,
    fill: COLORS[i],
  }));

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-1 rounded ${view === 'macros' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('macros')}>Macros</button>
        <button className={`px-3 py-1 rounded ${view === 'sugar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('sugar')}>Sugar</button>
        <button className={`px-3 py-1 rounded ${view === 'sodium' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setView('sodium')}>Sodium</button>
      </div>
      {/* Macro visualizations */}
      {view === 'macros' && (
        <>
          <div className="flex gap-2 mb-2">
            {macroViews.map(opt => (
              <button key={opt.key} className={`px-2 py-1 rounded ${macroChart === opt.key ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setMacroChart(opt.key)}>{opt.label}</button>
            ))}
          </div>
          {macroChart === 'bar' && (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Fat" fill="#fbbf24" />
                <Bar dataKey="Carbohydrates (g)" fill="#38bdf8" />
                <Bar dataKey="Protein (g)" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {macroChart === 'stacked' && (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData} stackOffset="expand">
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Fat" stackId="1" stroke="#fbbf24" fill="#fbbf24" />
                <Area type="monotone" dataKey="Carbohydrates (g)" stackId="1" stroke="#38bdf8" fill="#38bdf8" />
                <Area type="monotone" dataKey="Protein (g)" stackId="1" stroke="#34d399" fill="#34d399" />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {macroChart === 'pie' && (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={macroPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                  {macroPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </>
      )}
      {/* Sugar visualizations */}
      {view === 'sugar' && (
        <>
          <div className="flex gap-2 mb-2">
            {sugarViews.map(opt => (
              <button key={opt.key} className={`px-2 py-1 rounded ${sugarChart === opt.key ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setSugarChart(opt.key)}>{opt.label}</button>
            ))}
          </div>
          {sugarChart === 'line' && (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Sugar" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
          {sugarChart === 'area' && (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Sugar" stroke="#ef4444" fill="#fecaca" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </>
      )}
      {/* Sodium visualizations */}
      {view === 'sodium' && (
        <>
          <div className="flex gap-2 mb-2">
            {sodiumViews.map(opt => (
              <button key={opt.key} className={`px-2 py-1 rounded ${sodiumChart === opt.key ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} onClick={() => setSodiumChart(opt.key)}>{opt.label}</button>
            ))}
          </div>
          {sodiumChart === 'line' && (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Sodium (mg)" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
          {sodiumChart === 'area' && (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Sodium (mg)" stroke="#6366f1" fill="#d1d5fa" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </>
      )}
      {/* Collapsible raw data table */}
      <CollapsibleTable data={data} />
    </div>
  );
}
