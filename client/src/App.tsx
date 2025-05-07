import { Switch, Route } from "wouter";
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
import { AuthProvider } from "@/context/AuthContext";
import LoginPage from "@/pages/login-page";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  const ProtectedLayout = () => (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/records" component={MedicalRecords} />
        <Route path="/consultations" component={AIConsultations} />
        <Route path="/consent" component={ConsentManagement} />
        <Route path="/providers" component={Providers} />
        <Route path="/transactions" component={BlockchainLogs} />
        <Route path="/websocket" component={WebSocketDemo} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );

  return (
    <Switch>
      <Route path="/auth" component={LoginPage} />
      <Route path="/login" component={LoginPage} /> {/* Add an alias to support both paths */}
      <ProtectedRoute path="/" component={ProtectedLayout} />
    </Switch>
  );
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
