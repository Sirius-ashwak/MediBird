import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import MedicalRecords from "@/pages/MedicalRecords";
import AIConsultations from "@/pages/AIConsultations";
import ConsentManagement from "@/pages/ConsentManagement";
import Providers from "@/pages/Providers";
import BlockchainLogs from "@/pages/BlockchainLogs";
import WebSocketDemo from "@/pages/WebSocketDemo";
import MainLayout from "@/layouts/MainLayout";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/pages/login-page";
import { ProtectedRoute } from "@/lib/protected-route";
import { Loader2 } from "lucide-react";

function Router() {
  const { isAuthenticated, loading } = useAuth();
  const [location] = useLocation();
  
  // Render a direct app with routes for authenticated users
  const renderApp = () => {
    return (
      <MainLayout>
        <Switch>
          <Route path="/">
            <Dashboard />
          </Route>
          <Route path="/records">
            <MedicalRecords />
          </Route>
          <Route path="/consultations">
            <AIConsultations />
          </Route>
          <Route path="/consent">
            <ConsentManagement />
          </Route>
          <Route path="/providers">
            <Providers />
          </Route>
          <Route path="/transactions">
            <BlockchainLogs />
          </Route>
          <Route path="/websocket">
            <WebSocketDemo />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </MainLayout>
    );
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-primary-600">Loading MediBridge...</span>
      </div>
    );
  }

  // Public routes
  if (!isAuthenticated) {
    if (location !== "/login" && location !== "/auth") {
      return <Redirect to="/login" />;
    }
    
    return (
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/auth">
          <LoginPage />
        </Route>
        <Route path="*">
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }

  // Protected routes - only for authenticated users
  return renderApp();
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
