import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, Zap, Shield, BarChart3 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6">
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            OrdoAgentForge
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The multi-tenant AI dashboard for your organization. Manage tools,
            execute workflows, and analyze performance all in one place.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Powerful Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access a suite of AI-powered tools tailored for your workflow.
                Execute tasks with streaming responses in real-time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure multi-tenant architecture with granular access control at
                organization, workspace, and user levels.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track usage, monitor costs, and optimize performance with
                comprehensive analytics dashboards.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <div className="flex justify-center">
                <SignIn routing="hash" afterSignInUrl="/dashboard" />
              </div>
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <div className="flex justify-center">
                <SignUp routing="hash" afterSignUpUrl="/dashboard" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-muted-foreground">
        <p>&copy; 2024 OrdoAgentForge. All rights reserved.</p>
      </div>
    </div>
  );
};
