import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  PulseIcon, DashboardIcon, FileListIcon, 
  UserVoiceIcon, LockIcon, HospitalIcon, 
  ExchangeIcon, ShieldCheckIcon, LogoutIcon 
} from "@/lib/icons";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/records", label: "Medical Records", icon: <FileListIcon /> },
    { path: "/consultations", label: "AI Consultations", icon: <UserVoiceIcon /> },
    { path: "/consent", label: "Consent Management", icon: <LockIcon /> },
    { path: "/providers", label: "Healthcare Providers", icon: <HospitalIcon /> },
    { path: "/transactions", label: "Blockchain Logs", icon: <ExchangeIcon /> },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-white border-r border-neutral-200 p-4">
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <PulseIcon className="text-white text-xl" />
        </div>
        <h1 className="font-display font-bold text-xl text-primary-600">MediBridge</h1>
      </div>
      
      <nav className="flex-grow">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg ${
                  isActive(item.path) 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-neutral-600 hover:bg-neutral-100 transition-colors"
                }`}>
                  {item.icon}
                  <span className={isActive(item.path) ? "font-medium" : ""}>
                    {item.label}
                  </span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-neutral-200">
        <div className="bg-neutral-100 p-3 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center">
              <ShieldCheckIcon className="text-neutral-700" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Connected via</p>
              <p className="text-sm font-medium">Polkadot Network</p>
            </div>
          </div>
          <div className="text-xs text-neutral-600 flex items-center">
            <ShieldCheckIcon className="text-secondary-500 mr-1" />
            <span>Secure connection active</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 px-2">
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
    </aside>
  );
}
