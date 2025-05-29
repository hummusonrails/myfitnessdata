import React, { useState } from 'react';
import Papa from 'papaparse';
import MeasurementVisualizations from '../visualizations/MeasurementVisualizations';
import { useData } from '../context/DataContext';
import BackgroundScribbles from '../components/BackgroundScribbles';
import ChatWithData from '../components/ChatWithData';

export default function Measurement() {
  const { measurement, setMeasurement } = useData();
  const [error, setError] = useState('');

  // Helper: check if measurement data has at least one row with a valid date
  const hasValidMeasurement = Array.isArray(measurement) && measurement.some(row => row && row.Date);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.startsWith('Measurement-')) {
      setError("Please upload a file that starts with 'Measurement-'.");
      return;
    }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const valid = Array.isArray(results.data) && results.data.some(row => row && row.Date);
        if (valid) {
          setMeasurement(results.data);
          setError('');
        } else {
          setMeasurement([]);
          setError('No valid rows found in CSV.');
        }
      },
      error: (err) => {
        setError('Failed to parse CSV');
      }
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 overflow-hidden">
      <BackgroundScribbles />
      <div className="z-10 w-full max-w-3xl mx-auto flex flex-col gap-8 items-center pt-24 pb-16">
        <div className="bg-white/95 rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-6 w-full border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-gray-900 text-center">Measurement Data</h1>
          <ChatWithData data={measurement} section="measurement" />
          {!hasValidMeasurement && (
            <div className="flex flex-col gap-2 mb-4">
              <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2 rounded border border-gray-300 px-3 py-2 w-full" />
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
          )}
          {hasValidMeasurement ? (
            <MeasurementVisualizations data={measurement} />
          ) : (
            <div className="text-gray-500 text-center">Upload a CSV to see visualizations.</div>
          )}
        </div>
      </div>
    </div>
  );
}
