import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import './App.css';

function App() {
  const { user, isLoaded } = useUser();

  return (
    <div className="App">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>OrdoAgentForge</h1>
        <div>
          <SignedOut>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <SignInButton mode="modal">
                <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '4px' }}>Sign Up</button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        <SignedOut>
          <div className="card">
            <h2>Welcome to OrdoAgentForge</h2>
            <p>Please sign in to get started.</p>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="card">
            <h2>Welcome back{isLoaded && user ? `, ${user.firstName || user.username}` : ''}!</h2>
            <p>You are successfully authenticated with Clerk.</p>
            {isLoaded && user && (
              <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                <h3>User Info:</h3>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
                <p><strong>Username:</strong> {user.username}</p>
              </div>
            )}
          </div>
        </SignedIn>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>🛠️ Integrations Status</h3>
          <ul style={{ textAlign: 'left' }}>
            <li>✅ React + TypeScript + Vite</li>
            <li>✅ Clerk Authentication</li>
            <li>✅ Supabase</li>
            <li>✅ Airia API</li>
            <li>✅ MongoDB</li>
            <li>✅ Vercel Deployment</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
