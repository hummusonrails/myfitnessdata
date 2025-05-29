import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// Utility to convert CSV data (array of objects) to a string for LLM context
function csvToText(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => row[h] ?? '').join(','));
  return [headers.join(','), ...rows].join('\n');
}

export default function ChatWithData({ data, section }) {
  const [collapsed, setCollapsed] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: `You are a helpful assistant for analyzing ${section} data. The user has uploaded the following CSV data. Answer their questions using this data as context.`
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  // Save API key to localStorage
  useEffect(() => {
    if (apiKey) localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);

  // Handle sending a message
  async function sendMessage(e) {
    e.preventDefault();
    setError('');
    if (!apiKey) {
      setError('Please provide your OpenAI API key.');
      return;
    }
    if (!input.trim()) return;
    const csvContext = csvToText(data);
    if (!csvContext) {
      setError('No CSV data available.');
      return;
    }
    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: input.trim()
      },
      {
        role: 'system',
        content: `Here is the CSV data for context:\n${csvContext}`
      }
    ];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: newMessages,
          max_tokens: 512,
          temperature: 0.2
        })
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      const aiMessage = json.choices?.[0]?.message;
      if (aiMessage) {
        setMessages([...newMessages, aiMessage]);
        setInput('');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } else {
        setError('No response from OpenAI.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch from OpenAI.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mt-4">
      <button
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-semibold focus:outline-none"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
      >
        <span>💬 Chat with your {section} data</span>
        <span>{collapsed ? '+' : '-'}</span>
      </button>
      {!collapsed && (
        <div className="border border-blue-100 rounded-b-lg bg-white p-4 mt-0 flex flex-col gap-4 animate-fade-in">
          <label className="block text-sm font-medium text-gray-700">
            OpenAI API Key (never leaves your browser):
            <a
              href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-blue-700 underline hover:text-blue-900 align-middle"
            >
              Where do I find my API key?
            </a>
            <input
              type="password"
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </label>
          <div className="max-h-64 overflow-y-auto bg-gray-50 rounded p-2 border border-gray-100 text-sm text-gray-900 space-y-2">
            {messages.filter(m => m.role !== 'system').map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                {m.role === 'user' ? (
                  <span className="inline-block bg-blue-100 text-blue-900 px-2 py-1 rounded-lg">
                    {m.content}
                  </span>
                ) : (
                  <div className="prose prose-sm max-w-none bg-gray-100 px-3 py-2 rounded-lg">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="text-gray-400">Thinking...</div>}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question about your data..."
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              Send
            </button>
          </form>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          <div className="text-xs text-gray-500 mt-2">Your API key and data never leave your browser. Powered by OpenAI GPT-3.5-turbo.</div>
        </div>
      )}
    </div>
  );
}
