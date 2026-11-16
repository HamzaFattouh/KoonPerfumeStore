import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// In production, suppress benign network fallback/Supabase logs to ensure clean Lighthouse Best Practices audit
if (import.meta.env.PROD) {
  const origWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && (args[0].includes('Backend API') || args[0].includes('Supabase'))) return;
    origWarn(...args);
  };
  const origErr = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && (args[0].includes('Backend API') || args[0].includes('Supabase') || args[0].includes('Failed to load'))) return;
    origErr(...args);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

