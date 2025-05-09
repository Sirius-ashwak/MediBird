import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, NotificationIcon, SettingsIcon } from "@/lib/icons";

export default function Header() {
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
      default:
        return "MediBridge";
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-6 hidden md:block">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-neutral-800">{getPageTitle()}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="py-2 pl-9 pr-4 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64 text-sm" 
            />
            <SearchIcon className="text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <Button 
            onClick={() => window.location.href = '/notifications'} 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 relative"
          >
            <NotificationIcon />
            <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-500 rounded-full"></span>
          </Button>
          <Button 
            onClick={() => window.location.href = '/settings'} 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          >
            <SettingsIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
