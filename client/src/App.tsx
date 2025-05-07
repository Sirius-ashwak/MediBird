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
import LoginPage from "@/pages/LoginPage";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/">
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
      </Route>
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
