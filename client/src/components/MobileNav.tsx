import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  PulseIcon, DashboardIcon, FileListIcon, 
  UserVoiceIcon, LockIcon, HospitalIcon, 
  ExchangeIcon, LogoutIcon 
} from "@/lib/icons";
import { MessageSquareIcon } from "lucide-react";
import { Link } from "wouter"; // Ensure we import Link correctly

interface MobileNavProps {
  onClose?: () => void;
  isMobileBar?: boolean;
}

export default function MobileNav({ onClose, isMobileBar = false }: MobileNavProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  if (isMobileBar) {
    // Bottom navigation bar for mobile
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 transition-colors duration-300">
        <div className="flex justify-around">
          <Link 
            href="/" 
            onClick={() => {}}
            className={`flex flex-col items-center py-1 px-3 ${isActive("/") ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"}`}
          >
            <DashboardIcon className="text-xl" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link 
            href="/records" 
            onClick={() => {}}
            className={`flex flex-col items-center py-1 px-3 ${isActive("/records") ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"}`}
          >
            <FileListIcon className="text-xl" />
            <span className="text-xs mt-1">Records</span>
          </Link>
          <Link 
            href="/consultations" 
            onClick={() => {}}
            className={`flex flex-col items-center py-1 px-3 ${isActive("/consultations") ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"}`}
          >
            <UserVoiceIcon className="text-xl" />
            <span className="text-xs mt-1">Consult</span>
          </Link>
          <Link 
            href="/transactions" 
            onClick={() => {}}
            className={`flex flex-col items-center py-1 px-3 ${isActive("/transactions") ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"}`}
          >
            <ExchangeIcon className="text-xl" />
            <span className="text-xs mt-1">Blockchain</span>
          </Link>
          <Link 
            href="/consent" 
            onClick={() => {}}
            className={`flex flex-col items-center py-1 px-3 ${isActive("/consent") ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"}`}
          >
            <LockIcon className="text-xl" />
            <span className="text-xs mt-1">Privacy</span>
          </Link>
        </div>
      </div>
    );
  }

  // Side drawer for mobile
  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/records", label: "Medical Records", icon: <FileListIcon /> },
    { path: "/consultations", label: "AI Consultations", icon: <UserVoiceIcon /> },
    { path: "/consent", label: "Consent Management", icon: <LockIcon /> },
    { path: "/providers", label: "Healthcare Providers", icon: <HospitalIcon /> },
    { path: "/transactions", label: "Blockchain Logs", icon: <ExchangeIcon /> },
    { path: "/websocket", label: "WebSocket Demo", icon: <MessageSquareIcon className="h-5 w-5" /> },
  ];

  return (
    <>
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <PulseIcon className="text-white text-lg" />
        </div>
        <h1 className="font-display font-bold text-lg text-primary-600">MediBird</h1>
      </div>
      
      {/* Mobile navigation */}
      <nav className="mb-6">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg ${
                  isActive(item.path) 
                    ? "bg-primary-100/20 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" 
                    : "text-foreground hover:bg-muted transition-colors"
                }`}
                onClick={onClose}
              >
                {item.icon}
                <span className={isActive(item.path) ? "font-medium" : ""}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Mobile user profile section */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center space-x-3 px-2">
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
      </div>
    </>
  );
}
