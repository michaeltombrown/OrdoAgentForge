import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { useAuthHelpers } from './lib/clerk-helpers';

/**
 * Example Clerk Authentication Component
 *
 * This component demonstrates various Clerk features including:
 * - Sign in/sign up buttons
 * - User profile display
 * - Protected content
 * - User metadata
 */

function ClerkExample() {
  const { user } = useUser();
  const { userName, userEmail, userImageUrl, signOut, openSignIn, openSignUp } =
    useAuthHelpers();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Clerk Authentication Example</h1>

      {/* Signed Out State */}
      <SignedOut>
        <div style={{ marginBottom: '20px' }}>
          <p>You are not signed in.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={openSignIn}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              onClick={openSignUp}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </SignedOut>

      {/* Signed In State */}
      <SignedIn>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {userImageUrl && (
              <img
                src={userImageUrl}
                alt={userName}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                }}
              />
            )}
            <div>
              <h2 style={{ margin: '0 0 5px 0' }}>Welcome, {userName}!</h2>
              <p style={{ margin: 0, color: '#666' }}>{userEmail}</p>
            </div>
            <UserButton />
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>User Information:</h3>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '5px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(
                {
                  id: user?.id,
                  email: userEmail,
                  name: userName,
                  createdAt: user?.createdAt,
                  lastSignInAt: user?.lastSignInAt,
                },
                null,
                2
              )}
            </pre>
          </div>

          <button
            onClick={() => signOut()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Sign Out
          </button>
        </div>
      </SignedIn>

      {/* Protected Content Example */}
      <div style={{ marginTop: '30px' }}>
        <h3>Protected Content:</h3>
        <SignedIn>
          <div
            style={{
              backgroundColor: '#D1FAE5',
              padding: '15px',
              borderRadius: '5px',
              border: '1px solid #10B981',
            }}
          >
            ✅ This content is only visible to authenticated users!
          </div>
        </SignedIn>
        <SignedOut>
          <div
            style={{
              backgroundColor: '#FEE2E2',
              padding: '15px',
              borderRadius: '5px',
              border: '1px solid #EF4444',
            }}
          >
            ⚠️ Please sign in to view protected content.
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

export default ClerkExample;
