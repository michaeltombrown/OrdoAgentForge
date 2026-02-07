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
import { Activity, DollarSign, Zap, TrendingUp } from 'lucide-react';

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

interface DetailedAnalyticsDashboardProps {
  data: AnalyticsData;
  title?: string;
}

export const DetailedAnalyticsDashboard: React.FC<
  DetailedAnalyticsDashboardProps
> = ({ data, title = 'Analytics Dashboard' }) => {
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
      <h2 className="text-2xl font-bold">{title}</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SimpleAnalyticsCard
          title="Total Executions"
          value={formatNumber(data.totalExecutions)}
          icon={Activity}
          description="All-time tool runs"
        />
        <SimpleAnalyticsCard
          title="Total Tokens"
          value={formatNumber(data.totalTokens)}
          icon={Zap}
          description="Tokens consumed"
        />
        <SimpleAnalyticsCard
          title="Total Cost"
          value={formatCurrency(data.totalCost)}
          icon={DollarSign}
          description="Total spending"
        />
        <SimpleAnalyticsCard
          title="Average Cost"
          value={formatCurrency(
            data.totalExecutions > 0 ? data.totalCost / data.totalExecutions : 0
          )}
          icon={TrendingUp}
          description="Per execution"
        />
      </div>

      {/* Top Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tools</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topTools && data.topTools.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool Name</TableHead>
                  <TableHead className="text-right">Executions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topTools.map((tool) => (
                  <TableRow key={tool.tool_id}>
                    <TableCell className="font-medium">
                      {tool.tool_name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(tool.execution_count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No tool usage data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivity && data.recentActivity.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.tool_name}
                    </TableCell>
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
