import { useState, useEffect } from 'react';
import {
  supabase,
  getCurrentUser,
  signIn,
  signUp,
  signOut,
} from './lib/supabase';
import type { User } from '@supabase/supabase-js';

function SupabaseExample() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signUp(email, password);
      alert('Check your email for the confirmation link!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  }

  if (loading) {
    return <div className="supabase-example">Loading...</div>;
  }

  if (user) {
    return (
      <div className="supabase-example">
        <h2>Welcome to Supabase!</h2>
        <div className="user-info">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Created:</strong>{' '}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div className="supabase-example">
      <h2>Supabase Authentication</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSignIn}>
        <h3>Sign In</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        <button type="button" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>

      <p className="hint">
        Don't have credentials yet? Set up your Supabase project first!
      </p>
    </div>
  );
}

export default SupabaseExample;
