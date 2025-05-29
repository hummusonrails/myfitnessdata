import React, { useState } from 'react';

export default function CollapsibleTable({ data }) {
  const [open, setOpen] = useState(false);
  if (!data || data.length === 0) return null;
  const columns = Object.keys(data[0]);
  return (
    <div className="mt-6">
      <button
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold mb-2"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Hide' : 'Show'} Raw Data Table
      </button>
      {open && (
        <div className="overflow-x-auto border rounded shadow bg-white mt-2">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-2 py-1 border-b text-left font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="even:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="px-2 py-1 border-b">{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
