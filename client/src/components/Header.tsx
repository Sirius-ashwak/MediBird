import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, NotificationIcon, SettingsIcon } from "@/lib/icons";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { SidebarContext } from "@/layouts/MainLayout";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  // Access sidebar state from MainLayout context
  const { isSidebarCollapsed, toggleSidebar } = SidebarContext;
  const [location] = useLocation();
  
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/records":
        return "Medical Records";
      case "/consultations":
        return "AI Consultations";
      case "/consent":
        return "Consent Management";
      case "/providers":
        return "Healthcare Providers";
      case "/transactions":
        return "Blockchain Logs";
      case "/websocket":
        return "WebSocket Demo";
      default:
        return "MediBird";
    }
  };

  return (
    <header className="bg-background border-b border-border py-4 px-6 hidden md:block transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Separate toggle button in header for better visibility */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4 p-1.5 rounded-lg hover:bg-muted border border-border text-foreground transition-colors"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="font-display text-2xl font-semibold text-foreground transition-colors">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="py-2 pl-9 pr-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64 text-sm transition-colors" 
            />
            <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
          </div>
          <Button 
            onClick={() => window.location.href = '/notifications'} 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded-full bg-muted text-foreground hover:bg-muted/80 relative transition-colors"
          >
            <NotificationIcon />
            <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-500 rounded-full"></span>
          </Button>
          <Button 
            onClick={() => window.location.href = '/settings'} 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            <SettingsIcon />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
