import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrgList } from '@/components/admin/OrgList';
import { CreateToolForm } from '@/components/admin/CreateToolForm';
import { useUser } from '@/hooks/useUser';
import { Building2, Wrench, BarChart3, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('organizations');

  // Check if user has admin access
  if (!user || (user.role !== 'SYSTEM_ADMIN' && user.role !== 'ORG_OWNER')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        </div>
        <p className="text-gray-600">
          Manage organizations, tools, and system-wide settings
        </p>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="organizations">
            <Building2 className="w-4 h-4 mr-2" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="tools">
            <Wrench className="w-4 h-4 mr-2" />
            Tools
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="system">
            <Shield className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="mt-6">
          <OrgList
            organizations={[]}
            onSelect={(org) => console.log('Selected org:', org)}
            onCreate={() => console.log('Create organization')}
            loading={false}
          />
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="mt-6">
          <CreateToolForm
            onSubmit={async (data) => {
              console.log('Creating tool:', data);
              // TODO: Implement actual tool creation
            }}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <div className="text-center py-12 text-gray-500">
            System analytics coming soon
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="mt-6">
          <div className="text-center py-12 text-gray-500">
            System configuration coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
