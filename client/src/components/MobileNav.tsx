import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  PulseIcon, DashboardIcon, FileListIcon, 
  UserVoiceIcon, LockIcon, HospitalIcon, 
  ExchangeIcon, LogoutIcon 
} from "@/lib/icons";
import { MessageSquareIcon } from "lucide-react";

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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-2">
        <div className="flex justify-around">
          <Link href="/" className={`flex flex-col items-center py-1 px-3 ${isActive("/") ? "text-primary-600" : "text-neutral-500"}`}>
            <DashboardIcon className="text-xl" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link href="/records" className={`flex flex-col items-center py-1 px-3 ${isActive("/records") ? "text-primary-600" : "text-neutral-500"}`}>
              <FileListIcon className="text-xl" />
              <span className="text-xs mt-1">Records</span>
          </Link>
          <Link href="/consultations" className={`flex flex-col items-center py-1 px-3 ${isActive("/consultations") ? "text-primary-600" : "text-neutral-500"}`}>
              <UserVoiceIcon className="text-xl" />
              <span className="text-xs mt-1">Consult</span>
          </Link>
          <Link href="/transactions" className={`flex flex-col items-center py-1 px-3 ${isActive("/transactions") ? "text-primary-600" : "text-neutral-500"}`}>
              <ExchangeIcon className="text-xl" />
              <span className="text-xs mt-1">Blockchain</span>
          </Link>
          <Link href="/consent" className={`flex flex-col items-center py-1 px-3 ${isActive("/consent") ? "text-primary-600" : "text-neutral-500"}`}>
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
        <h1 className="font-display font-bold text-lg text-primary-600">MediBridge</h1>
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
                    ? "bg-primary-50 text-primary-700" 
                    : "text-neutral-600 hover:bg-neutral-100 transition-colors"
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
      <div className="mt-auto pt-4 border-t border-neutral-200">
        <div className="flex items-center space-x-3 px-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profileImage || ""} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.name || "Anonymous User"}</p>
            <p className="text-xs text-neutral-500 truncate">ID: {user?.walletId?.substring(0, 6)}...{user?.walletId?.substring(user.walletId.length - 4)}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => logout()} 
            className="text-neutral-400 hover:text-neutral-600"
          >
            <LogoutIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
