/**
 * Clerk Authentication Helper Functions
 *
 * This module provides utility functions for working with Clerk authentication.
 */

import React from 'react';
import { useAuth, useUser, useClerk } from '@clerk/clerk-react';

/**
 * Custom hook to get authentication state and methods
 */
export function useAuthHelpers() {
  const { isSignedIn, userId, sessionId, signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const clerk = useClerk();

  return {
    // Auth state
    isSignedIn,
    userId,
    sessionId,
    isLoaded,

    // User data
    user,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    userName: user?.fullName || user?.firstName || 'User',
    userImageUrl: user?.imageUrl,

    // Auth methods
    signOut,
    openSignIn: () => clerk.openSignIn(),
    openSignUp: () => clerk.openSignUp(),
    openUserProfile: () => clerk.openUserProfile(),
  };
}

/**
 * Check if user has a specific role
 */
export function useHasRole(role: string) {
  const { user } = useUser();
  return user?.publicMetadata?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function useHasAnyRole(roles: string[]) {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string;
  return userRole && roles.includes(userRole);
}

/**
 * Get user metadata
 */
export function useUserMetadata() {
  const { user } = useUser();
  return {
    publicMetadata: user?.publicMetadata || {},
    privateMetadata: user?.unsafeMetadata || {},
  };
}

/**
 * Update user metadata
 * Note: This should be done server-side for security
 */
export async function updateUserMetadata(
  _userId: string,
  _metadata: Record<string, unknown>
) {
  // This would typically be done server-side
  // For client-side updates, use user.update()
  throw new Error('User metadata updates should be done server-side');
}

/**
 * Protected content wrapper
 */
export function ProtectedContent({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Role-based content wrapper
 */
export function RoleProtectedContent({
  children,
  requiredRole,
  fallback = null,
}: {
  children: React.ReactNode;
  requiredRole: string;
  fallback?: React.ReactNode;
}) {
  const hasRole = useHasRole(requiredRole);
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
