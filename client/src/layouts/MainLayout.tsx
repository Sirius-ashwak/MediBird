import { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Menu, X } from "lucide-react";
import { useLocation } from "wouter";
import { PulseIcon } from "@/lib/icons";
import ThemeToggle from "@/components/ThemeToggle";
import HealthTip from "@/components/HealthTip";

interface MainLayoutProps {
  children: ReactNode;
}

// Create a context to share the sidebar state
export const SidebarContext = {
  isSidebarCollapsed: false,
  toggleSidebar: () => {}
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Check for saved preference in localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medibird-sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  });
  
  const { loading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('medibird-sidebar-collapsed', String(newState));
    }
  };
  
  // Redirect to login if not authenticated - only once when component mounts
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      setLocation('/login');
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background transition-colors duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-primary-600">Loading MediBird...</span>
      </div>
    );
  }
  
  // Don't render the layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Update shared context object
  SidebarContext.isSidebarCollapsed = sidebarCollapsed;
  SidebarContext.toggleSidebar = toggleSidebar;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Sidebar - hidden on mobile */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      {/* Mobile header and menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-10 transition-colors duration-300">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <PulseIcon className="text-white text-lg" />
            </div>
            <h1 className="font-display font-bold text-lg text-primary-600">MediBird</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-foreground/30 backdrop-blur-sm md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-background border-l border-border shadow-lg p-4 slide-in transition-colors duration-300">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>
            <div className="flex justify-end pt-1 pb-4">
              <ThemeToggle />
            </div>
            <MobileNav onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 transition-all duration-300">
          {children}
        </main>
        <MobileNav isMobileBar />
      </div>
      
      {/* Health Tips Component with playful character animations */}
      <HealthTip position="bottom-right" autoShowInterval={180000} />
    </div>
  );
}
