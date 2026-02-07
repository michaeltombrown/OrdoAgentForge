import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple test component
function TestApp() {
  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'system-ui',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>
        🚀 React is Working!
      </h1>
      <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
        OrdoAgentForge Development Server
      </p>
      <div
        style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '20px',
        }}
      >
        <p>✅ React mounted successfully</p>
        <p>✅ Vite dev server running</p>
        <p>✅ TypeScript compiled</p>
        <p>⏳ Testing Clerk authentication...</p>
      </div>
      <p style={{ marginTop: '30px', fontSize: '0.9em' }}>
        Check console for environment variables
      </p>
    </div>
  );
}

console.log('🔍 Checking environment variables:');
console.log(
  'VITE_CLERK_PUBLISHABLE_KEY:',
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'
);
console.log(
  'VITE_SUPABASE_URL:',
  import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'
);
console.log(
  'VITE_SUPABASE_ANON_KEY:',
  import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TestApp />
    </React.StrictMode>
  );
  console.log('✅ React mounted to #root');
} else {
  console.error('❌ Root element not found!');
}
