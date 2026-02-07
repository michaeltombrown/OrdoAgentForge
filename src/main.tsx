import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

console.log('🚀 main.tsx loading...');

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('🔑 Clerk Key:', PUBLISHABLE_KEY ? '✅ Found' : '❌ Missing');
console.log(
  '🌐 Supabase URL:',
  import.meta.env.VITE_SUPABASE_URL ? '✅ Found' : '❌ Missing'
);

if (!PUBLISHABLE_KEY) {
  console.error('❌ Missing Clerk Publishable Key');
  throw new Error('Missing Clerk Publishable Key');
}

console.log('📦 Mounting React app...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

console.log('✅ React app mounted successfully');
