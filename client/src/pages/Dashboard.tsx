import { useAuth } from "@/context/AuthContext";
import StatsCard from "@/components/dashboard/StatsCard";
import AIConsultation from "@/components/dashboard/AIConsultation";
import MedicalActivity from "@/components/dashboard/MedicalActivity";
import BlockchainVerification from "@/components/dashboard/BlockchainVerification";
import BlockchainIdentity from "@/components/dashboard/BlockchainIdentity";
import HealthProfile from "@/components/dashboard/HealthProfile";
import DataAccessControl from "@/components/dashboard/DataAccessControl";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import { 
  FileListIcon, 
  CalendarIcon, 
  LockIcon 
} from "@/lib/icons";

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <main className="flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Top gradient accent */}
      <div className="h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-accent-500"></div>
      
      {/* Content container with increased padding and max-width */}
      <div className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10 md:pt-6 pt-20">
        {/* Welcome section with modern typography and subtle effects */}
        <div className="mb-10">
          <div className="flex items-center mb-2">
            <div className="h-8 w-1 bg-primary-600 rounded-full mr-3"></div>
            <h2 className="font-display text-2xl font-semibold text-slate-800 dark:text-white tracking-tight">
              Welcome back, <span className="text-primary-600">{user?.name.split(' ')[0] || 'Sarah'}</span>
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 ml-4 pl-3 border-l border-slate-200 dark:border-slate-700">
            Here's your personalized health dashboard with real-time analytics and insights.
          </p>
        </div>
      
        {/* Stats cards with upgraded glass effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatsCard 
            title="Health Score" 
            value={87} 
            unit="/100" 
            status="good" 
            progress={87} 
          />
          
          <StatsCard 
            title="Medical Records" 
            value={12} 
            unit="files" 
            icon={<FileListIcon className="h-5 w-5 text-primary-500" />}
            link={{ label: "View all records", href: "/records" }}
          />
          
          <StatsCard 
            title="Upcoming Appointments" 
            value={2} 
            unit="scheduled" 
            icon={<CalendarIcon className="h-5 w-5 text-primary-500" />}
            link={{ label: "Manage appointments", href: "/appointments" }}
          />
          
          <StatsCard 
            title="Data Access Requests" 
            value={3} 
            unit="pending" 
            icon={<LockIcon className="h-5 w-5 text-primary-500" />}
            link={{ label: "Review requests", href: "/consent" }}
          />
        </div>
      
        {/* Main content area - Improved 2 column layout with better spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <AIConsultation />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlockchainIdentity />
              <BlockchainVerification />
            </div>
            
            <MedicalActivity />
          </div>
          
          {/* Right column (1/3 width) */}
          <div className="space-y-8">
            <HealthProfile />
            <DataAccessControl />
            <UpcomingAppointments />
          </div>
        </div>
      </div>
    </main>
  );
}
