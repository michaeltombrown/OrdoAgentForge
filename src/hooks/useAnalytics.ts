import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';
import { useWorkspaces } from './useWorkspaces';

interface AnalyticsData {
  totalExecutions: number;
  totalTokens: number;
  totalCost: number;
  topTools: Array<{
    tool_id: string;
    tool_name: string;
    execution_count: number;
  }>;
  recentActivity: Array<{
    id: string;
    tool_name: string;
    created_at: string;
    status: string;
  }>;
}

interface WorkspaceAnalytics extends AnalyticsData {
  workspace_id: string;
  workspace_name: string;
}

interface OrganizationAnalytics extends AnalyticsData {
  organization_id: string;
  organization_name: string;
  workspaceCount: number;
  userCount: number;
}

interface SystemAnalytics {
  totalOrganizations: number;
  totalWorkspaces: number;
  totalUsers: number;
  totalExecutions: number;
  totalTokens: number;
  totalCost: number;
  topOrganizations: Array<{
    organization_id: string;
    organization_name: string;
    execution_count: number;
    total_cost: number;
  }>;
  recentActivity: Array<{
    id: string;
    organization_name: string;
    workspace_name: string;
    tool_name: string;
    created_at: string;
    status: string;
  }>;
}

export function useAnalytics() {
  const userContext = useUser();
  const workspaceContext = useWorkspaces();
  const user = userContext?.user || null;
  const currentWorkspace = workspaceContext?.currentWorkspace || null;

  const [userAnalytics, setUserAnalytics] = useState<AnalyticsData | null>(
    null
  );
  const [workspaceAnalytics, setWorkspaceAnalytics] =
    useState<WorkspaceAnalytics | null>(null);
  const [organizationAnalytics, setOrganizationAnalytics] =
    useState<OrganizationAnalytics | null>(null);
  const [systemAnalytics, setSystemAnalytics] =
    useState<SystemAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserAnalytics = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/user', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user analytics');
      }

      const data = await response.json();
      setUserAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchWorkspaceAnalytics = useCallback(
    async (workspaceId?: string) => {
      const targetWorkspaceId = workspaceId || currentWorkspace?.id;
      if (!targetWorkspaceId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/analytics/workspace/${targetWorkspaceId}`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch workspace analytics');
        }

        const data = await response.json();
        setWorkspaceAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    },
    [currentWorkspace]
  );

  const fetchOrganizationAnalytics = useCallback(
    async (organizationId?: string) => {
      const targetOrgId = organizationId || user?.organization_id;
      if (!targetOrgId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/analytics/organization/${targetOrgId}`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch organization analytics');
        }

        const data = await response.json();
        setOrganizationAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const fetchSystemAnalytics = useCallback(async () => {
    if (user?.role !== 'SYSTEM_ADMIN') {
      setError(new Error('Unauthorized: System admin access required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/system', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system analytics');
      }

      const data = await response.json();
      setSystemAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Auto-fetch user analytics when user changes
  useEffect(() => {
    if (user) {
      fetchUserAnalytics();
    }
  }, [user, fetchUserAnalytics]);

  // Auto-fetch workspace analytics when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      fetchWorkspaceAnalytics(currentWorkspace.id);
    }
  }, [currentWorkspace, fetchWorkspaceAnalytics]);

  return {
    userAnalytics,
    workspaceAnalytics,
    organizationAnalytics,
    systemAnalytics,
    loading,
    error,
    fetchUserAnalytics,
    fetchWorkspaceAnalytics,
    fetchOrganizationAnalytics,
    fetchSystemAnalytics,
  };
}
