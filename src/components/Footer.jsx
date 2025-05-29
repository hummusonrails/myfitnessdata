import React from 'react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full flex flex-col md:flex-row items-center justify-between gap-2 px-6 py-6 bg-white/80 text-gray-700 border-t border-gray-200 mt-auto z-20">
      <div className="flex items-center gap-2 text-sm">
        <span>&copy; {currentYear} </span>
        <a href="https://www.hummusonrails.com" className="underline font-medium hover:text-blue-600" target="_blank" rel="noopener noreferrer">Ben Greenberg</a>
      </div>
      <div>
        <a href="https://github.com/hummusonrails/myfitnessdata" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-blue-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block align-middle"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.74 0 0 .84-.28 2.75 1.05A9.37 9.37 0 0 1 12 6.81c.85.004 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.43.2 2.48.1 2.74.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.31.68.92.68 1.85 0 1.33-.01 2.41-.01 2.74 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" /></svg>
          <span className="sr-only">GitHub</span>
        </a>
      </div>
    </footer>
  );
}
