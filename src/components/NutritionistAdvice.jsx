import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Aggregate nutrition data by date, summing main macros and sodium
function aggregateNutrition(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const nutritionKeys = ['Fat (g)', 'Carbohydrates (g)', 'Protein (g)', 'Sugar', 'Fiber', 'Sodium (mg)', 'Cholesterol'];
  const byDate = {};
  data.forEach(row => {
    const date = row.Date;
    if (!date) return;
    if (!byDate[date]) {
      byDate[date] = { Date: date };
      nutritionKeys.forEach(k => byDate[date][k] = 0);
    }
    nutritionKeys.forEach(k => {
      byDate[date][k] += parseFloat(row[k] || 0);
    });
  });
  return Object.values(byDate);
}

// Aggregate exercise data by date, summing calories, minutes, steps
function aggregateExercise(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const exerciseKeys = ['Exercise Calories', 'Exercise Minutes', 'Steps'];
  const byDate = {};
  data.forEach(row => {
    const date = row.Date;
    if (!date) return;
    if (!byDate[date]) {
      byDate[date] = { Date: date };
      exerciseKeys.forEach(k => byDate[date][k] = 0);
    }
    exerciseKeys.forEach(k => {
      byDate[date][k] += parseFloat(row[k] || 0);
    });
  });
  return Object.values(byDate);
}

function csvToText(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => row[h] ?? '').join(','));
  return [headers.join(','), ...rows].join('\n');
}

export function splitAdviceSections(advice) {
  if (!advice) return [];
  const regex = /(## Nutrition Advice|## Body Measurements Advice|## Exercise Activity Advice)/gi;
  const matches = [...advice.matchAll(regex)];
  if (!matches.length) return [];
  let sections = [];
  for (let i = 0; i < matches.length; i++) {
    const title = matches[i][0];
    const start = matches[i].index + title.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : advice.length;
    // Remove leading markdown heading from content if present
    let content = advice.slice(start, end).trim();
    content = content.replace(/^##\s+[^\n]+\n?/i, '');
    sections.push({ title, content });
  }
  return sections;
}

export function NutritionistAdviceSection({ advice, heading, maxHeight = 300 }) {
  const sections = splitAdviceSections(advice);
  let sectionTitle = '';
  if (heading === 'nutrition') sectionTitle = '## Nutrition Advice';
  else if (heading === 'weight') sectionTitle = '## Body Measurements Advice';
  else if (heading === 'activity') sectionTitle = '## Exercise Activity Advice';
  else sectionTitle = heading;
  const section = sections.find(s => s.title.toLowerCase() === sectionTitle.toLowerCase());
  if (!section) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-600 text-sm">No advice available for this section.</div>
    );
  }

  const cleanTitle = section.title.replace(/^\d+\.\s*/, '');
  // Voice playback state
  const [playing, setPlaying] = React.useState(false);
  const [rate, setRate] = React.useState(1);
  const synthRef = React.useRef(window.speechSynthesis);
  const utterRef = React.useRef(null);

  const playAudio = () => {
    if (!section.content) return;
    if (playing) {
      synthRef.current.cancel();
      return;
    }

    const voices = synthRef.current.getVoices();
    let voice = voices.find(v => v.name.toLowerCase().includes('samantha'));
    if (!voice) {
      const preferredNames = [
        'Google US English', 'Google UK English Female', 'Jenny', 'Susan', 'Emma', 'Victoria', 'Fiona', 'Samantha', 'Karen', 'Moira', 'Tessa', 'Zira', 'Joanna', 'Kendra', 'Kimberly', 'Salli', 'Olivia', 'Amy', 'Ava'
      ];
      voice = voices.find(v => v.lang.startsWith('en') && preferredNames.some(name => v.name.toLowerCase().includes(name.toLowerCase()))) ||
              voices.find(v => v.lang.startsWith('en') && v.gender === 'female') ||
              voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
              voices.find(v => v.lang.startsWith('en')) ||
              voices[0];
    }
    if (!voice) voice = voices[0];
    const utter = new window.SpeechSynthesisUtterance(section.content);
    utter.voice = voice;
    utter.pitch = 1.08;
    utter.rate = rate;
    utter.onstart = () => setPlaying(true);
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);
    utterRef.current = utter;
    synthRef.current.speak(utter);
  };

  // Stop audio if user navigates away or component unmounts
  React.useEffect(() => () => synthRef.current.cancel(), []);

  return (
    <div className="prose max-w-none text-green-900 whitespace-pre-line" style={{ maxHeight, overflowY: 'auto', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="10" r="6" fill="#34d399" stroke="#166534" strokeWidth="1.5"/>
          <ellipse cx="16" cy="25" rx="10" ry="6" fill="#bbf7d0" stroke="#166534" strokeWidth="1.5"/>
          <path d="M12 22c0-2 2-3 4-3s4 1 4 3" stroke="#166534" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M10 26c-1.2-1.5-2-3.5-2-5.5 0-2.5 2-4.5 4.5-4.5" stroke="#16a34a" strokeWidth="1.1"/>
          <path d="M22 26c1.2-1.5 2-3.5 2-5.5 0-2.5-2-4.5-4.5-4.5" stroke="#16a34a" strokeWidth="1.1"/>
          {/* Apple/leaf accent */}
          <ellipse cx="24.5" cy="8.5" rx="2" ry="1" fill="#a3e635" stroke="#65a30d" strokeWidth="0.8"/>
          <path d="M24.5 8.5c0-1 1-2 2-2" stroke="#65a30d" strokeWidth="0.8"/>
        </svg>
        <span style={{ fontWeight: 700, fontSize: '1.18em', color: '#166534', letterSpacing: 0.2 }}>AI Nutritionist Says...</span>
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={playAudio}
          aria-label={playing ? 'Pause audio' : 'Play advice audio'}
          title={playing ? 'Pause audio' : 'Play advice audio'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4, display: 'flex', alignItems: 'center' }}
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 5V4L8 9H4z" fill="#16a34a"/><path d="M16 9.41l1.41 1.41L19.83 8l1.41 1.41-2.42 2.42 2.42 2.42-1.41 1.41-2.42-2.42-2.42 2.42-1.41-1.41 2.42-2.42-2.42-2.42L13.59 8l2.41 2.41z" fill="#16a34a"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 5V4L8 9H4z" fill="#16a34a"/><path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.06c1.5-.74 2.5-2.26 2.5-4.03z" fill="#16a34a"/><path d="M19.5 12c0-3.04-1.72-5.64-4.5-6.32v2.06c2.04.61 3.5 2.54 3.5 4.26s-1.46 3.65-3.5 4.26v2.06c2.78-.68 4.5-3.28 4.5-6.32z" fill="#16a34a"/></svg>
          )}
        </button>
        <select
          value={rate}
          onChange={e => setRate(Number(e.target.value))}
          aria-label="Speech rate"
          title="Speech rate"
          style={{ marginLeft: 8, fontSize: '0.95em', borderRadius: 4, border: '1px solid #d1d5db', background: '#f9fafb', color: '#065f46', padding: '2px 6px', height: 28 }}
        >
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </span>
      <ReactMarkdown>{section.content.replace(/^##\s+[^\n]+\n?/i, '')}</ReactMarkdown>
    </div>
  );
}

export default function NutritionistAdvice({ nutrition, measurement, exercise, onAdvice, regenerateKey }) {
  const [advice, setAdvice] = useState(() => localStorage.getItem('nutritionist_advice_v1') || '');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('openai_api_key') || '';
    setApiKey(key);
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    // If regenerateKey is set, always fetch new advice (ignore cache)
    if (regenerateKey > 0) {
      setAdvice('');
    }
    // If advice is already present in state (from localStorage), skip API call unless regenerating
    if (advice && advice.length > 0 && !regenerateKey) {
      if (onAdvice) onAdvice(advice);
      return;
    }
    setLoading(true);
    setError('');

    function lastNDays(data, n) {
      if (!Array.isArray(data) || data.length === 0) return [];
      // Sort by date ascending
      const sorted = [...data].sort((a, b) => new Date(a.Date) - new Date(b.Date));
      // Get unique days
      const uniqueByDate = [];
      const seen = new Set();
      for (let i = sorted.length - 1; i >= 0 && uniqueByDate.length < n; i--) {
        const d = sorted[i].Date;
        if (d && !seen.has(d)) {
          uniqueByDate.unshift(sorted[i]);
          seen.add(d);
        }
      }
      return uniqueByDate;
    }
    // Aggregate if needed
    const nutritionData = nutrition && nutrition.length > 40 ? aggregateNutrition(nutrition) : nutrition;
    const exerciseData = exercise && exercise.length > 40 ? aggregateExercise(exercise) : exercise;
    const measurementData = measurement || [];
    // Only last 14 days
    const nutrition14 = lastNDays(nutritionData, 14);
    const exercise14 = lastNDays(exerciseData, 14);
    const measurement14 = lastNDays(measurementData, 14);
    const nutritionText = csvToText(nutrition14);
    const measurementText = csvToText(measurement14);
    const exerciseText = csvToText(exercise14);
    const prompt = `You are a certified nutritionist. The following is a summary of a client's nutrition, measurement, and exercise data (CSV format). Please provide:\n- Specific, actionable, and constructive feedback for each section.\n- Minimize generic encouragement; focus on what the user can do to improve.\n- For each section, include at least one concrete suggestion or action step.\n- Use the following exact markdown headings for each section: ## Nutrition Advice, ## Body Measurements Advice, ## Exercise Activity Advice.\n- Present your advice as if you were speaking directly to the client, in a professional and concise tone.\n\nNutrition Data:\n${nutritionText}\n\nMeasurement Data:\n${measurementText}\n\nExercise Data:\n${exerciseText}`;

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: 'You are a certified nutritionist helping a client interpret their health data.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1200,
        temperature: 0.3
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error.message);
        const result = json.choices?.[0]?.message?.content || '';
        setAdvice(result);
        localStorage.setItem('nutritionist_advice_v1', result);
        if (onAdvice) onAdvice(result);
      })
      .catch(e => setError(e.message || 'Failed to fetch advice.'))
      .finally(() => setLoading(false));
  }, [apiKey, nutrition, measurement, exercise]);

  const saveKey = () => {
    localStorage.setItem('openai_api_key', input);
    setApiKey(input);
    setShowInput(false);
  };

  if (!apiKey) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-6">
        <p className="mb-2 text-yellow-800">Want personalized nutritionist insights powered by AI?</p>
        {showInput ? (
          <div className="flex gap-2 items-center">
            <input
              type="password"
              className="border px-2 py-1 rounded"
              placeholder="Enter OpenAI API Key"
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={saveKey}>Save</button>
            <button className="text-gray-500 ml-2" onClick={() => setShowInput(false)}>Cancel</button>
          </div>
        ) : (
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setShowInput(true)}>
            Add OpenAI API Key
          </button>
        )}
      </div>
    );
  }

  return null;
}
