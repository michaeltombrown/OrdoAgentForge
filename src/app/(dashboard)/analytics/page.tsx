import React, { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SimpleAnalyticsCard } from '@/components/analytics/SimpleAnalyticsCard';
import { DetailedAnalyticsDashboard } from '@/components/analytics/DetailedAnalyticsDashboard';
import { SystemAnalyticsDashboard } from '@/components/analytics/SystemAnalyticsDashboard';
import { Activity } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user } = useUser();
  const {
    userAnalytics,
    workspaceAnalytics,
    organizationAnalytics,
    systemAnalytics,
    loading,
    error,
    fetchUserAnalytics,
    fetchOrganizationAnalytics,
    fetchSystemAnalytics,
  } = useAnalytics();

  useEffect(() => {
    // Fetch appropriate analytics based on user role
    if (user?.role === 'SYSTEM_ADMIN') {
      fetchSystemAnalytics();
    } else if (user?.role === 'ORG_OWNER') {
      fetchOrganizationAnalytics();
    } else {
      fetchUserAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Activity className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Failed to load analytics
        </h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  // System Admin View
  if (user?.role === 'SYSTEM_ADMIN' && systemAnalytics) {
    return <SystemAnalyticsDashboard data={systemAnalytics} />;
  }

  // Org Owner View
  if (user?.role === 'ORG_OWNER' && organizationAnalytics) {
    return (
      <DetailedAnalyticsDashboard
        data={organizationAnalytics}
        title="Organization Analytics"
      />
    );
  }

  // Workspace Admin View
  if (
    user?.role === 'WORKSPACE_ADMIN' &&
    (workspaceAnalytics || userAnalytics)
  ) {
    return (
      <DetailedAnalyticsDashboard
        data={(workspaceAnalytics || userAnalytics)!}
        title="Workspace Analytics"
      />
    );
  }

  // Member View - Simple analytics
  if (userAnalytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your tool usage and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SimpleAnalyticsCard
            title="Total Executions"
            value={userAnalytics.totalExecutions.toLocaleString()}
            description="Tools executed"
          />
          <SimpleAnalyticsCard
            title="Tokens Used"
            value={userAnalytics.totalTokens.toLocaleString()}
            description="Total tokens consumed"
          />
          <SimpleAnalyticsCard
            title="Total Cost"
            value={`$${userAnalytics.totalCost.toFixed(2)}`}
            description="Your spending"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12 text-gray-500">
      No analytics data available
    </div>
  );
};
