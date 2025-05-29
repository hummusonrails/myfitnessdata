import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Your privacy is extremely important to us. MyFitnessData is designed from the ground up to ensure your data stays private and secure.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">How Your Data Is Handled</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>CSV Uploads:</strong> When you upload CSV files (Nutrition, Measurement, Exercise), they are <span className="font-bold">never uploaded to any server</span>. All parsing and processing happens entirely in your browser.</li>
        <li><strong>Local Storage:</strong> Your OpenAI API key is stored locally in your browser using <code>localStorage</code>. It is <span className="font-bold">never sent to any server</span> except directly to OpenAI when you use the chat feature.</li>
        <li><strong>No Analytics or Tracking:</strong> MyFitnessData does not use any analytics, tracking scripts, or cookies. We do not collect or store any personal data.</li>
        <li><strong>AI Chat Feature:</strong> When you use the chat feature, only the relevant context from your uploaded data and your prompt are sent directly to the OpenAI API. <span className="font-bold">Your data and key are never sent to any other third party</span>.</li>
        <li><strong>Open Source:</strong> You can inspect or run the code yourself to verify these claims.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Control</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You can clear your browser storage at any time to remove your data and API key.</li>
        <li>All features work entirely in your browser—no account or signup is required.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Questions?</h2>
      <p>If you have questions about privacy or data handling, please <a href="https://github.com/hummusonrails/myfitnessdata/issues" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">open an issue on GitHub</a>.</p>
    </div>
  );
}
