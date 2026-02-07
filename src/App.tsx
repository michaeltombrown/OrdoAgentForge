import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './app/layout';
import { LandingPage } from './app/page';
import { DashboardLayoutPage } from './app/(dashboard)/layout';
import { DashboardPage } from './app/(dashboard)/page';
import { ToolPage } from './app/tools/[slug]/page';
import { KnowledgeBasePage } from './app/(dashboard)/knowledge/page';
import { AnalyticsPage } from './app/(dashboard)/analytics/page';
import { WorkspacesPage } from './app/(dashboard)/workspaces/page';
import { SettingsPage } from './app/(dashboard)/settings/page';
import { AdminPage } from './app/(dashboard)/admin/page';

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayoutPage />}>
            <Route index element={<DashboardPage />} />
            <Route path="knowledge" element={<KnowledgeBasePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="workspaces" element={<WorkspacesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>

          {/* Tool Routes */}
          <Route path="/tools/:slug" element={<ToolPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
