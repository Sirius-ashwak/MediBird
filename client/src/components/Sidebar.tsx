import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  PulseIcon, DashboardIcon, FileListIcon, 
  UserVoiceIcon, LockIcon, HospitalIcon, 
  ExchangeIcon, ShieldCheckIcon, LogoutIcon 
} from "@/lib/icons";
import { MessageSquareIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after component mounts to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/records", label: "Medical Records", icon: <FileListIcon /> },
    { path: "/consultations", label: "AI Consultations", icon: <UserVoiceIcon /> },
    { path: "/consent", label: "Consent Management", icon: <LockIcon /> },
    { path: "/providers", label: "Healthcare Providers", icon: <HospitalIcon /> },
    { path: "/transactions", label: "Blockchain Logs", icon: <ExchangeIcon /> },
    { path: "/websocket", label: "WebSocket Demo", icon: <MessageSquareIcon className="h-5 w-5" /> },
  ];

  const sidebarWidth = isCollapsed ? "md:w-20" : "md:w-64 lg:w-72";
  const iconWrapperClass = isCollapsed ? "mx-auto" : "";
  const textVisibility = isCollapsed ? "hidden" : "block";
  const justifyContent = isCollapsed ? "justify-center" : "";
  const logoJustify = isCollapsed ? "justify-center" : "";
  const logoTextVisible = isCollapsed ? "hidden" : "block";
  const paddingClass = isCollapsed ? "px-2" : "px-4";
  const contentClass = isCollapsed ? "opacity-0 invisible" : "opacity-100 visible";
  const transitionDelay = isCollapsed ? "delay-0" : "delay-100";

  return (
    <aside className={`hidden md:flex ${sidebarWidth} flex-col bg-background border-r border-border ${paddingClass} p-4 transition-all duration-300 ease-in-out relative`}>
      <div className={`flex items-center ${logoJustify} space-x-2 mb-8 relative`}>
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <PulseIcon className="text-white text-xl" />
        </div>
        <h1 className={`font-display font-bold text-xl text-primary-600 ${logoTextVisible} transition-opacity duration-200 ${contentClass} ${transitionDelay}`}>MediBird</h1>
        
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-background border border-border rounded-full shadow-sm hover:bg-muted transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4 text-foreground" /> : <ChevronLeft className="h-4 w-4 text-foreground" />}
        </Button>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <TooltipProvider disableHoverableContent={!isCollapsed}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      href={item.path} 
                      className={`flex items-center ${justifyContent} px-3 py-2.5 rounded-lg ${
                        isActive(item.path) 
                          ? "bg-primary-100/20 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" 
                          : "text-foreground hover:bg-muted transition-colors"
                      }`}
                    >
                      <div className={iconWrapperClass}>{item.icon}</div>
                      <span className={`${textVisibility} ${isActive(item.path) ? "font-medium" : ""} ml-3 transition-opacity duration-200 ${contentClass} ${transitionDelay}`}>
                        {item.label}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && isMounted && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        {!isCollapsed && (
          <div className="bg-muted p-3 rounded-lg transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                <ShieldCheckIcon className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Connected via</p>
                <p className="text-sm font-medium text-foreground">Polkadot Network</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <ShieldCheckIcon className="text-secondary-500 mr-1" />
              <span>Secure connection active</span>
            </div>
          </div>
        )}
        
        {isCollapsed ? (
          <div className="flex justify-center mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profileImage || ""} alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {user?.name || "Anonymous User"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex items-center space-x-3 mt-4 px-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profileImage || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary-600/20 text-primary-700 dark:bg-primary-400/20 dark:text-primary-400">
                {user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{user?.name || "Anonymous User"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.walletId ? 
                  `ID: ${user.walletId.substring(0, 6)}...${user.walletId.substring(user.walletId.length - 4)}` 
                  : "No Wallet ID"
                }
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => logout()} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogoutIcon />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}