import React, { useState } from 'react';
import Papa from 'papaparse';
import { useData } from '../context/DataContext';
import BackgroundScribbles from '../components/BackgroundScribbles';

export default function Landing() {
  const { nutrition, setNutrition, measurement, setMeasurement, exercise, setExercise, resetAll } = useData();
  const [errors, setErrors] = useState({});
  const [resetting, setResetting] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const handleUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    let expectedPrefix = '';
    if (type === 'nutrition') expectedPrefix = 'Nutrition-';
    if (type === 'measurement') expectedPrefix = 'Measurement-';
    if (type === 'exercise') expectedPrefix = 'Exercise-';
    if (!file.name.startsWith(expectedPrefix)) {
      setErrors(prev => ({ ...prev, [type]: `Please upload a file that starts with '${expectedPrefix}'.` }));
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (type === 'nutrition') setNutrition(results.data);
        if (type === 'measurement') setMeasurement(results.data);
        if (type === 'exercise') setExercise(results.data);
        setErrors(prev => ({ ...prev, [type]: '' }));
      },
      error: () => {
        setErrors(prev => ({ ...prev, [type]: 'Failed to parse CSV' }));
      }
    });
  };


  const allUploaded = nutrition.length > 0 && measurement.length > 0 && exercise.length > 0;

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 overflow-hidden">
      <BackgroundScribbles />
      <div className="z-10 w-full max-w-2xl mx-auto flex flex-col gap-12 items-center pt-24 pb-16">
        <div className="text-center flex flex-col gap-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-gray-900 text-center">
            Visualize &amp; <span className="text-blue-600">Chat with</span> Your MyFitnessPal Data
          </h1>
          <p className="text-xl text-gray-700 max-w-xl mx-auto text-center">
            Instantly visualize, analyze, and <span className="font-semibold text-blue-700">chat with your nutrition, exercise, and measurement data</span> using ChatGPT.
            <br />
            <span className="text-base text-gray-700 block mt-4 font-semibold">All your data is stored locally in your browser—your privacy is preserved.*</span>
            <span className="text-sm text-blue-700 block mt-2">To use the chat feature, you'll need your own <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key" target="_blank" rel="noopener noreferrer" className="underline font-medium">OpenAI API key</a>.</span>
          </p>
          
          <p className="text-base text-gray-600 text-center">Export your data as CSV files from MyFitnessPal. <a href="https://support.myfitnesspal.com/hc/en-us/articles/360032273352-Data-Export-FAQs" className="text-blue-600 underline font-medium" target="_blank" rel="noopener noreferrer">How to export?</a></p>
        </div>
        {allUploaded ? (
          <div className="bg-white/95 rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-8 w-full max-w-lg border border-gray-100 items-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Your Data is Ready!</h2>
            <div className="flex flex-col gap-4 w-full">
              <a href="/nutrition" className="flex items-center gap-3 px-5 py-3 rounded-lg bg-green-100 hover:bg-green-200 text-green-900 font-semibold text-lg shadow transition">
                <span role="img" aria-label="Nutrition">🥗</span> Nutrition Data
              </a>
              <a href="/measurement" className="flex items-center gap-3 px-5 py-3 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold text-lg shadow transition">
                <span role="img" aria-label="Measurement">📏</span> Measurement Data
              </a>
              <a href="/exercise" className="flex items-center gap-3 px-5 py-3 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-semibold text-lg shadow transition">
                <span role="img" aria-label="Exercise">🏋️</span> Exercise Data
              </a>
            </div>
            <div className="flex flex-col items-center gap-2 mt-4 w-full">
              <div className="text-center text-gray-500 text-base">Explore your data using the links above!</div>
              <div className="flex flex-wrap gap-4 justify-center mt-2">
                <button
                  className="text-blue-600 text-sm underline hover:text-blue-800 transition"
                  onClick={() => setResetting(true)}
                  type="button"
                >
                  Upload new data
                </button>
                <button
                  className="text-red-600 text-sm underline hover:text-red-800 transition"
                  onClick={() => setClearingAll(true)}
                  type="button"
                >
                  Remove all my uploaded data & settings
                </button>
              </div>
              {resetting && (
                <div className="bg-white border border-gray-300 rounded p-4 mt-2 shadow flex flex-col items-center">
                  <div className="mb-2 text-gray-700">Are you sure you want to upload new data? This will clear your current uploads.</div>
                  <div className="flex gap-3">
                    <button className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600" onClick={() => { resetAll(); setResetting(false); }}>Yes, reset</button>
                    <button className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setResetting(false)}>Cancel</button>
                  </div>
                </div>
              )}
              {clearingAll && (
                <div className="bg-white border border-gray-300 rounded p-4 mt-2 shadow flex flex-col items-center">
                  <div className="mb-2 text-gray-700">Are you sure you want to remove <span className='font-bold text-red-700'>all your uploaded data and settings</span>? This will delete your uploaded files and any saved OpenAI API key.<br /><span className="text-sm text-gray-500">This only removes data from <strong>your browser</strong>. Nothing is <strong>EVER</strong> stored remotely on <strong>MyFitnessData</strong>.</span></div>
                  <div className="flex gap-3">
                    <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => {
                      localStorage.clear();
                      resetAll();
                      setClearingAll(false);
                    }}>Yes, remove all</button>
                    <button className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setClearingAll(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white/95 rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-6 w-full max-w-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Upload Your CSV Files</h2>
              <ul className="flex flex-col gap-2 text-gray-700 text-base mb-4">
                <li><span className="font-semibold text-yellow-500">1.</span> Download your CSVs from <span className="font-mono">myfitnesspal.com/reports/data_export</span></li>
                <li><span className="font-semibold text-blue-500">2.</span> Upload Nutrition, Measurement, and Exercise CSVs below</li>
                <li><span className="font-semibold text-green-500">3.</span> Explore insights and charts!</li>
              </ul>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block font-medium mb-1">Nutrition CSV</label>
                  <input type="file" accept=".csv" onChange={e => handleUpload('nutrition', e)} disabled={nutrition.length > 0} className="rounded border border-gray-300 px-3 py-2 w-full" />
                  {errors.nutrition && <div className="text-red-500 text-sm mt-1">{errors.nutrition}</div>}
                  {nutrition.length > 0 && <div className="text-green-600 text-sm mt-1">Uploaded!</div>}
                </div>
                <div>
                  <label className="block font-medium mb-1">Measurement CSV</label>
                  <input type="file" accept=".csv" onChange={e => handleUpload('measurement', e)} disabled={measurement.length > 0} className="rounded border border-gray-300 px-3 py-2 w-full" />
                  {errors.measurement && <div className="text-red-500 text-sm mt-1">{errors.measurement}</div>}
                  {measurement.length > 0 && <div className="text-green-600 text-sm mt-1">Uploaded!</div>}
                </div>
                <div>
                  <label className="block font-medium mb-1">Exercise CSV</label>
                  <input type="file" accept=".csv" onChange={e => handleUpload('exercise', e)} disabled={exercise.length > 0} className="rounded border border-gray-300 px-3 py-2 w-full" />
                  {errors.exercise && <div className="text-red-500 text-sm mt-1">{errors.exercise}</div>}
                  {exercise.length > 0 && <div className="text-green-600 text-sm mt-1">Uploaded!</div>}
                </div>
              </div>
            </div>
            <div className="text-center text-gray-500 text-base mt-4">
              Once you upload your CSV files, use the navigation above to explore your data visualizations and insights.
            </div>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-8 text-center w-full">
        *Except when using the <span className="font-semibold">Chat with Your Data</span> feature, which sends your data to OpenAI's servers for processing.
      </p>
    </div>
  );
}
