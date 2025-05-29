import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, Scatter, ReferenceLine, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart } from 'recharts';
import BackgroundScribbles from '../components/BackgroundScribbles';

const chartGroups = [
  {
    label: 'Weight vs. Calories & Exercise',
    keys: ['weight', 'calories', 'exerciseCalories'],
    subCharts: [
      { label: 'Composed Chart', type: 'composed' },
      { label: 'Area Chart', type: 'area' },
      { label: 'Radar Chart', type: 'radar' },
    ],
  },
  {
    label: 'Weight vs. Protein',
    keys: ['weight', 'protein'],
    subCharts: [
      { label: 'Scatter Chart', type: 'scatter' },
      { label: 'Line Chart', type: 'line' },
      { label: 'Radar Chart', type: 'radar' },
    ],
  },
  {
    label: 'Weight vs. Steps',
    keys: ['weight', 'steps'],
    subCharts: [
      { label: 'Scatter Chart', type: 'scatter' },
      { label: 'Line Chart', type: 'line' },
      { label: 'Radar Chart', type: 'radar' },
    ],
  },
  {
    label: 'Calories vs. Steps',
    keys: ['calories', 'steps'],
    subCharts: [
      { label: 'Scatter Chart', type: 'scatter' },
      { label: 'Line Chart', type: 'line' },
      { label: 'Radar Chart', type: 'radar' },
    ],
  },
  {
    label: 'Protein vs. Steps',
    keys: ['protein', 'steps'],
    subCharts: [
      { label: 'Scatter Chart', type: 'scatter' },
      { label: 'Line Chart', type: 'line' },
      { label: 'Radar Chart', type: 'radar' },
    ],
  },
  {
    label: 'Sodium vs. Weight',
    keys: ['sodium', 'weight'],
    subCharts: [
      { label: 'Scatter Chart', type: 'scatter' },
      { label: 'Line Chart', type: 'line' },
      { label: 'Radar Chart', type: 'radar' },
    ],
  },
];

function mergeData(nutrition, measurement, exercise) {
  // Merge by date, assuming Date is the key
  return (measurement || []).map(m => {
    const day = m.Date;
    const nutritionDay = (nutrition || []).find(n => n[Object.keys(n)[0]] === day || n.Date === day);
    const exerciseDay = (exercise || []).find(e => e.Date === day);
    return {
      date: day,
      weight: parseFloat(m.Weight),
      calories: nutritionDay ? (parseFloat(nutritionDay['Fat'] || 0) + parseFloat(nutritionDay['Carbohydrates (g)'] || 0) + parseFloat(nutritionDay['Protein (g)'] || 0)) : undefined,
      protein: nutritionDay ? parseFloat(nutritionDay['Protein (g)'] || 0) : undefined,
      sodium: nutritionDay ? parseFloat(nutritionDay['Sodium (mg)'] || 0) : undefined,
      steps: exerciseDay ? parseFloat(exerciseDay['Steps'] || 0) : undefined,
      exerciseCalories: exerciseDay ? parseFloat(exerciseDay['Exercise Calories'] || exerciseDay['Calories'] || 0) : undefined,
    };
  }).filter(row => row.date);
}

export default function Interplay() {
  const { nutrition, measurement, exercise } = useData();
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [activeSubIdx, setActiveSubIdx] = useState(0);
  const merged = mergeData(nutrition, measurement, exercise);

  const activeGroup = chartGroups[activeGroupIdx];
  const activeSub = activeGroup.subCharts[activeSubIdx];

  // Helper: get chart data keys
  function getKeys() {
    return activeGroup.keys;
  }

  // Chart renderers
  function renderChart() {
    const keys = getKeys();
    const data = merged.filter(row => keys.every(k => typeof row[k] === 'number' && !isNaN(row[k])));
    if (data.length === 0) return <div className="text-gray-500">Not enough data for this chart.</div>;
    if (activeSub.type === 'composed') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            {keys.includes('calories') && <Bar yAxisId="right" dataKey="calories" fill="#fbbf24" name="Total Macros (g)" />}
            {keys.includes('exerciseCalories') && <Bar yAxisId="right" dataKey="exerciseCalories" fill="#60a5fa" name="Exercise Calories" />}
            {keys.includes('weight') && <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#f59e42" strokeWidth={3} name="Weight" />}
            <ReferenceLine y={data.reduce((a,b)=>a+b.weight,0)/data.length} yAxisId="left" label="Avg Weight" stroke="#f59e42" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
    if (activeSub.type === 'area') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map(k => <Area key={k} type="monotone" dataKey={k} fill="#60a5fa" stroke="#2563eb" name={k.charAt(0).toUpperCase()+k.slice(1)} />)}
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    if (activeSub.type === 'scatter') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart data={data}>
            <XAxis dataKey={keys[0]} name={keys[0]} />
            <YAxis dataKey={keys[1]} name={keys[1]} />
            <Tooltip />
            <Scatter data={data} fill="#60a5fa" name={`${keys[0]} vs. ${keys[1]}`} />
          </ScatterChart>
        </ResponsiveContainer>
      );
    }
    if (activeSub.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map(k => <Line key={k} type="monotone" dataKey={k} stroke="#2563eb" name={k.charAt(0).toUpperCase()+k.slice(1)} />)}
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
    if (activeSub.type === 'radar') {
      return (
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="date" />
            <PolarRadiusAxis />
            {keys.map((k, idx) => (
              <Radar key={k} name={k.charAt(0).toUpperCase()+k.slice(1)} dataKey={k} stroke={['#f59e42', '#60a5fa', '#2563eb'][idx%3]} fill={['#f59e42', '#60a5fa', '#2563eb'][idx%3]} fillOpacity={0.4} />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      );
    }
    return <div>Chart type not implemented.</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 overflow-hidden">
      <BackgroundScribbles />
      <div className="z-10 w-full max-w-3xl mx-auto flex flex-col gap-8 items-center pt-24 pb-16">
        <div className="bg-white/95 rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-6 w-full border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-gray-900 text-center">Interplay of Your Data</h1>
          {merged.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {chartGroups.map((group, idx) => (
                  <button
                    key={group.label}
                    className={`px-4 py-2 rounded-full font-semibold transition-colors duration-150 shadow-sm ${activeGroupIdx === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-100'}`}
                    onClick={() => { setActiveGroupIdx(idx); setActiveSubIdx(0); }}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
              <div className="mb-2 flex flex-wrap gap-2 justify-center">
                {activeGroup.subCharts.map((sub, idx) => (
                  <button
                    key={sub.label}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 ${activeSubIdx === idx ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                    onClick={() => setActiveSubIdx(idx)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
                {renderChart()}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center">Upload data in all categories to see interplay visualizations.</div>
          )}
        </div>
      </div>
    </div>
  );
}
