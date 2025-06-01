import React from 'react';

export default function HeroDescription() {
  return (
    <div className="mx-auto max-w-2xl bg-white/90 rounded-xl shadow-lg px-6 py-6 md:py-8 md:px-10 border border-green-100 flex flex-col gap-3 items-center">
      <ul className="list-none text-lg md:text-xl text-gray-800 text-left w-full flex flex-col gap-2">
        <li>
          <span className="font-semibold text-blue-700"><span role="img" aria-label="visualize">🧩</span> Instantly visualize, analyze, and <span className='underline'>chat</span> with your nutrition, exercise, and measurement data using ChatGPT.</span>
        </li>
        <li>
          <span className="font-semibold text-green-700"><span role="img" aria-label="report">📝</span> Generate a <span className="underline">Personal Nutrition Report</span> powered by AI for tailored insights and recommendations.</span>
        </li>
        <li>
          <span className="font-semibold text-gray-700"><span role="img" aria-label="privacy">🔒</span> All your data is stored locally in your browser—your privacy is preserved.*</span>
        </li>
        <li>
          <span className="text-blue-700"><span role="img" aria-label="key">🗝️</span> To use the chat and personal nutrition report features, you'll need your own <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key" target="_blank" rel="noopener noreferrer" className="underline font-medium">OpenAI API key</a>.</span>
        </li>
      </ul>
      <div className="text-base text-gray-600 text-center mt-2">
        Export your data as CSV files from MyFitnessPal.{' '}
        <a href="https://support.myfitnesspal.com/hc/en-us/articles/360032273352-Data-Export-FAQs" className="text-blue-600 underline font-medium" target="_blank" rel="noopener noreferrer">How to export?</a>
      </div>
    </div>
  );
}
