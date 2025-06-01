import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import NutritionVisualizations from '../visualizations/NutritionVisualizations';
import MeasurementVisualizations from '../visualizations/MeasurementVisualizations';
import ExerciseVisualizations from '../visualizations/ExerciseVisualizations';
import SummaryCard from './SummaryCard';
import NutritionistAdvice, { NutritionistAdviceSection } from '../components/NutritionistAdvice';
import BackgroundScribbles from '../components/BackgroundScribbles';

export default function PersonalHealthReport() {
  const { nutrition, measurement, exercise } = useData();
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(true);
  const [hasAll, setHasAll] = useState(false);
  const [regenerateKey, setRegenerateKey] = useState(0);

  useEffect(() => {
    setHasAll(
      Array.isArray(nutrition) && nutrition.length > 0 &&
      Array.isArray(measurement) && measurement.length > 0 &&
      Array.isArray(exercise) && exercise.length > 0
    );
  }, [nutrition, measurement, exercise]);

  if (!hasAll) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Personal Nutrition Report</h1>
        <p className="text-gray-600 mb-6">
          Please upload your Nutrition, Measurement, and Exercise data to view your complete nutrition report.
        </p>
      </div>
    );
  }


  // Handler to clear cached advice and trigger new fetch
  const handleRegenerateAdvice = () => {
    localStorage.removeItem('nutritionist_advice_v1');
    setAdvice('');
    setAdviceLoading(true);
    setRegenerateKey(k => k + 1);
  };

  return (
    <div className="relative">
      <BackgroundScribbles />
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8">Personal Nutrition Report</h1>
        {/* Generate New Advice Button */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded shadow"
            onClick={handleRegenerateAdvice}
            disabled={adviceLoading}
            title="Generate new AI nutritionist advice based on your current data"
          >
            {adviceLoading ? 'Generating Advice...' : 'Generate New Advice'}
          </button>
        </div>
        {/* Insightful Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Best Step Day */}
          <SummaryCard
            title="Best Step Day"
            value={(() => {
              if (!exercise.length) return '-';
              const stepKey = Object.keys(exercise[0]).find(k => k.toLowerCase().includes('step'));
              if (!stepKey) return '-';
              let max = 0, maxDate = '';
              exercise.forEach(row => {
                const steps = parseFloat(row[stepKey]);
                if (!isNaN(steps) && steps > max) {
                  max = steps;
                  maxDate = row.Date || '';
                }
              });
              if (!max || !maxDate) return '-';
              const dateStr = new Date(maxDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              return `${max.toLocaleString()} steps (${dateStr})`;
            })()}
            icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#bbf7d0"/><path d="M8 16l2-3 2 2 4-6" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" fill="#059669"/></svg>}
            color="text-green-800"
          />
          <SummaryCard
            title="Weight Change"
            value={(() => {
              if (!measurement.length) return '-';
              const sorted = [...measurement].filter(row => row.Weight).sort((a, b) => new Date(a.Date) - new Date(b.Date));
              if (sorted.length < 2) return '-';
              const first = parseFloat(sorted[0].Weight);
              const last = parseFloat(sorted[sorted.length - 1].Weight);
              if (isNaN(first) || isNaN(last)) return '-';
              const diff = last - first;
              const pct = first ? ((diff / first) * 100).toFixed(1) : '-';
              return `${diff > 0 ? '+' : ''}${diff.toFixed(1)} lbs (${pct}% )`;
            })()}
            icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#dbeafe"/><path d="M8 13l2.5 2.5L16 10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            color="text-blue-800"
          />
          <SummaryCard
            title="Avg Daily Calories vs. Goal"
            value={(() => {
              if (!nutrition.length) return '-';
              const calKey = Object.keys(nutrition[0]).find(k => k.toLowerCase().includes('calorie'));
              if (!calKey) return '-';
              // Group by date and sum calories per day
              const dayMap = {};
              nutrition.forEach(row => {
                const date = row.Date;
                const cals = parseFloat(row[calKey]);
                if (!date || isNaN(cals)) return;
                if (!dayMap[date]) dayMap[date] = 0;
                dayMap[date] += cals;
              });
              const dayTotals = Object.values(dayMap);
              if (!dayTotals.length) return '-';
              const sum = dayTotals.reduce((a, b) => a + b, 0);
              const avg = sum / dayTotals.length;
              const goal = 1800;
              const pct = ((avg - goal) / goal) * 100;
              return `${Math.round(avg).toLocaleString()} / ${goal} Calories (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`;
            })()}
            icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fef9c3"/><path d="M8 14h8M8 10h8" stroke="#eab308" strokeWidth="2" strokeLinecap="round"/><circle cx="8" cy="10" r="1" fill="#eab308"/><circle cx="8" cy="14" r="1" fill="#eab308"/></svg>}
            color="text-yellow-800"
          />
          <SummaryCard
            title="Largest Calorie Spike"
            value={(() => {
              if (!nutrition.length) return '-';
              const calKey = Object.keys(nutrition[0]).find(k => k.toLowerCase().includes('calorie'));
              if (!calKey) return '-';
              // Group by date and sum calories per day
              const dayMap = {};
              nutrition.forEach(row => {
                const date = row.Date;
                const cals = parseFloat(row[calKey]);
                if (!date || isNaN(cals)) return;
                if (!dayMap[date]) dayMap[date] = 0;
                dayMap[date] += cals;
              });
              const dayTotals = Object.values(dayMap);
              const dates = Object.keys(dayMap);
              if (!dayTotals.length) return '-';
              const avg = dayTotals.reduce((a, b) => a + b, 0) / dayTotals.length;
              let maxDiff = 0, maxDay = '';
              dayTotals.forEach((total, idx) => {
                const diff = Math.abs(total - avg);
                if (diff > maxDiff) {
                  maxDiff = diff;
                  maxDay = dates[idx];
                }
              });
              if (!maxDiff || !maxDay) return '-';
              const dateStr = new Date(maxDay).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              return `${Math.round(maxDiff)} Calories (${dateStr})`;
            })()}
            icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fee2e2"/><path d="M8 16l8-8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/><circle cx="8" cy="16" r="1.5" fill="#dc2626"/></svg>}
            color="text-red-800"
          />
          <SummaryCard
            title="This Week vs. Last Week"
            value={(() => {
              // Helper: get week start (Sunday)
              function getWeek(date) {
                const d = new Date(date);
                d.setHours(0,0,0,0);
                d.setDate(d.getDate() - d.getDay());
                return d.getTime();
              }
              // --- CALORIES ---
              if (!nutrition.length) return '-';
              const calKey = Object.keys(nutrition[0]).find(k => k.toLowerCase().includes('calorie'));
              if (!calKey) return '-';
              // Group by date, sum per day
              const calDayMap = {};
              nutrition.forEach(row => {
                const date = row.Date;
                const cals = parseFloat(row[calKey]);
                if (!date || isNaN(cals)) return;
                if (!calDayMap[date]) calDayMap[date] = 0;
                calDayMap[date] += cals;
              });
              // Group daily totals by week
              const calWeekMap = {};
              Object.entries(calDayMap).forEach(([date, total]) => {
                const week = getWeek(date);
                if (!calWeekMap[week]) calWeekMap[week] = [];
                calWeekMap[week].push(total);
              });
              // --- STEPS ---
              if (!exercise.length) return '-';
              const stepKey = Object.keys(exercise[0]).find(k => k.toLowerCase().includes('step'));
              if (!stepKey) return '-';
              const stepDayMap = {};
              exercise.forEach(row => {
                const date = row.Date;
                const steps = parseFloat(row[stepKey]);
                if (!date || isNaN(steps)) return;
                if (!stepDayMap[date]) stepDayMap[date] = 0;
                stepDayMap[date] += steps;
              });
              const stepWeekMap = {};
              Object.entries(stepDayMap).forEach(([date, total]) => {
                const week = getWeek(date);
                if (!stepWeekMap[week]) stepWeekMap[week] = [];
                stepWeekMap[week].push(total);
              });
              // --- WEIGHT ---
              if (!measurement.length) return '-';
              const weightWeekMap = {};
              measurement.forEach(row => {
                const date = row.Date;
                const weight = parseFloat(row.Weight);
                if (!date || isNaN(weight)) return;
                const week = getWeek(date);
                if (!weightWeekMap[week]) weightWeekMap[week] = [];
                weightWeekMap[week].push({ date, weight });
              });
              // --- Find most recent two weeks with data ---
              const allWeeks = Array.from(new Set([
                ...Object.keys(calWeekMap),
                ...Object.keys(stepWeekMap),
                ...Object.keys(weightWeekMap)
              ])).map(Number).sort((a, b) => b - a);
              if (allWeeks.length < 2) return '-';
              const [thisWeek, lastWeek] = allWeeks;
              // --- Calculate averages/deltas ---
              const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
              const calAvgThis = avg(calWeekMap[thisWeek] || []);
              const calAvgLast = avg(calWeekMap[lastWeek] || []);
              const calDelta = (calAvgThis !== null && calAvgLast !== null) ? calAvgThis - calAvgLast : null;
              const stepAvgThis = avg(stepWeekMap[thisWeek] || []);
              const stepAvgLast = avg(stepWeekMap[lastWeek] || []);
              const stepDelta = (stepAvgThis !== null && stepAvgLast !== null) ? stepAvgThis - stepAvgLast : null;
              const getLastWeight = arr => arr && arr.length ? arr.sort((a,b)=>new Date(a.date)-new Date(b.date))[arr.length-1].weight : null;
              const weightThis = getLastWeight(weightWeekMap[thisWeek]);
              const weightLast = getLastWeight(weightWeekMap[lastWeek]);
              const weightDelta = (weightThis !== null && weightLast !== null) ? weightThis - weightLast : null;
              return [
                `Calories: ${calDelta ? (calDelta>0?'+':'')+Math.round(calDelta) : '-'} avg`,
                `Steps: ${stepDelta ? (stepDelta>0?'+':'')+Math.round(stepDelta) : '-'} avg`,
                `Weight: ${weightDelta ? (weightDelta>0?'+':'')+weightDelta.toFixed(1) : '-'} lbs`
              ].join(' | ');
            })()}
            icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#f3f4f6"/><path d="M8 16v-4a4 4 0 018 0v4" stroke="#374151" strokeWidth="2" strokeLinecap="round"/><path d="M12 12v-2" stroke="#374151" strokeWidth="2" strokeLinecap="round"/></svg>}
            color="text-gray-800"
            className="lg:col-span-2"
          />
        </div>
        {/* Advice fetcher (hidden) */}
        <NutritionistAdvice
          nutrition={nutrition}
          measurement={measurement}
          exercise={exercise}
          regenerateKey={regenerateKey}
          onAdvice={a => {
            setAdvice(a);
            setAdviceLoading(false);
          }}
        />
        {/* Visualizations with interleaved advice as side-by-side cards */}
        <div className="flex flex-col gap-10 mb-12">
          {/* Nutrition Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">Nutrition Trends</h2>
              <NutritionVisualizations
                data={nutrition}
                summaryOnly={true}
                defaultView="macros"
                defaultMacroChart="stacked"
                hideTabs={true}
              />
              <a href="/nutrition" className="block mt-3 text-blue-600 hover:underline text-sm font-medium">See more nutrition charts</a>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg shadow p-6 flex flex-col max-h-[350px] overflow-y-auto">
              {!adviceLoading && advice && (
                <NutritionistAdviceSection advice={advice} heading="nutrition" />
              )}
            </div>
          </div>
          {/* Measurements Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">Body Measurements</h2>
              <MeasurementVisualizations
                data={measurement}
                summaryOnly={true}
                defaultChartType="line"
                hideTabs={true}
              />
              <a href="/measurement" className="block mt-3 text-blue-600 hover:underline text-sm font-medium">See more measurement charts</a>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg shadow p-6 flex flex-col max-h-[350px] overflow-y-auto">
              
              {!adviceLoading && advice && (
                <NutritionistAdviceSection advice={advice} heading="weight" />
              )}
            </div>
          </div>
          {/* Exercise Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">Exercise Activity</h2>
              <ExerciseVisualizations
                data={exercise}
                summaryOnly={true}
                defaultView="steps"
                defaultChartType="bar"
                hideTabs={true}
              />
              <a href="/exercise" className="block mt-3 text-blue-600 hover:underline text-sm font-medium">See more exercise charts</a>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg shadow p-6 flex flex-col max-h-[350px] overflow-y-auto">
              {!adviceLoading && advice && (
                <NutritionistAdviceSection advice={advice} heading="activity" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
