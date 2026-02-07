import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleAnalyticsCard } from './SimpleAnalyticsCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Building2, Users, Activity, DollarSign } from 'lucide-react';

interface SystemAnalyticsData {
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

interface SystemAnalyticsDashboardProps {
  data: SystemAnalyticsData;
}

export const SystemAnalyticsDashboard: React.FC<
  SystemAnalyticsDashboardProps
> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SimpleAnalyticsCard
          title="Organizations"
          value={formatNumber(data.totalOrganizations)}
          icon={Building2}
          description="Total organizations"
        />
        <SimpleAnalyticsCard
          title="Workspaces"
          value={formatNumber(data.totalWorkspaces)}
          icon={Activity}
          description="Total workspaces"
        />
        <SimpleAnalyticsCard
          title="Users"
          value={formatNumber(data.totalUsers)}
          icon={Users}
          description="Total users"
        />
        <SimpleAnalyticsCard
          title="Total Revenue"
          value={formatCurrency(data.totalCost)}
          icon={DollarSign}
          description="Total platform revenue"
        />
      </div>

      {/* Platform Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleAnalyticsCard
          title="Total Executions"
          value={formatNumber(data.totalExecutions)}
          description="All-time tool runs"
        />
        <SimpleAnalyticsCard
          title="Total Tokens"
          value={formatNumber(data.totalTokens)}
          description="Total tokens consumed"
        />
      </div>

      {/* Top Organizations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topOrganizations && data.topOrganizations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead className="text-right">Executions</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topOrganizations.map((org) => (
                  <TableRow key={org.organization_id}>
                    <TableCell className="font-medium">
                      {org.organization_name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(org.execution_count)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(org.total_cost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No organization data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent System Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivity && data.recentActivity.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Tool</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.organization_name}
                    </TableCell>
                    <TableCell>{activity.workspace_name}</TableCell>
                    <TableCell>{activity.tool_name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : activity.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {activity.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-500">
                      {formatDate(activity.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
