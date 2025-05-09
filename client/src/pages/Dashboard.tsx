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
    <main className="flex-1 overflow-auto p-6 md:pt-6 pt-20">
      {/* Welcome section */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-medium text-neutral-800 mb-2">
          Welcome back, {user?.name.split(' ')[0] || 'Sarah'}
        </h2>
        <p className="text-neutral-600">Here's your health overview and recent activities.</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          icon={<FileListIcon className="text-primary-500" />}
          link={{ label: "View all records", href: "/records" }}
        />
        
        <StatsCard 
          title="Upcoming Appointments" 
          value={2} 
          unit="scheduled" 
          icon={<CalendarIcon className="text-primary-500" />}
          link={{ label: "Manage appointments", href: "/appointments" }}
        />
        
        <StatsCard 
          title="Data Access Requests" 
          value={3} 
          unit="pending" 
          icon={<LockIcon className="text-primary-500" />}
          link={{ label: "Review requests", href: "/consent" }}
        />
      </div>
      
      {/* Main content area - 2 column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <AIConsultation />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BlockchainIdentity />
            <BlockchainVerification />
          </div>
          <MedicalActivity />
        </div>
        
        {/* Right column (1/3 width) */}
        <div className="space-y-6">
          <HealthProfile />
          <DataAccessControl />
          <UpcomingAppointments />
        </div>
      </div>
    </main>
  );
}
