import { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { PulseIcon } from "@/lib/icons";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to auth");
      setLocation('/auth');
    }
  }, [loading, isAuthenticated, setLocation]);

  useEffect(() => {
    // Refresh auth state periodically
    const interval = setInterval(() => {
      if (!loading && !isAuthenticated) {
        console.log("Session check: User not authenticated, redirecting to auth");
        setLocation('/auth');
      }
    }, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading MediBridge...</span>
      </div>
    );
  }
  
  // Don't render the layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 text-neutral-800">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />
      
      {/* Mobile header and menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <PulseIcon className="text-white text-lg" />
            </div>
            <h1 className="font-display font-bold text-lg text-primary-600">MediBridge</h1>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-neutral-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-neutral-800/50 md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4 slide-in">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-neutral-100"
            >
              <X className="h-6 w-6" />
            </button>
            <MobileNav onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {children}
        <MobileNav isMobileBar />
      </div>
    </div>
  );
}
