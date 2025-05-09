import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";

import { Activity } from "@shared/schema";
import { RiFileTextLine, RiExchangeLine, RiTimerLine, RiShieldCheckLine, RiLockLine, RiAiGenerate } from 'react-icons/ri';

export default function MedicalActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Recent Medical Activity</CardTitle>
        <Button variant="link" size="sm" className="text-primary-600">
          View all
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" className="ml-1">
            <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"/>
          </svg>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Spinner size="lg" />
            </div>
          ) : (
            // Actual data
            <>
              <ActivityItem
                icon="ri-file-text-line"
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                title="Lab Results Uploaded"
                timestamp="2 days ago"
                description="Blood work results from City Hospital"
                badge={{ text: "End-to-end encrypted", icon: "ri-lock-line", color: "bg-neutral-100 text-neutral-600" }}
                actionText="View details"
              />
              
              <ActivityItem
                icon="ri-exchange-line"
                iconBg="bg-green-100"
                iconColor="text-green-600"
                title="Access Granted"
                timestamp="3 days ago"
                description="Dr. Emily Chen at Northwest Medical"
                badge={{ text: "30 days access", icon: "ri-timer-line", color: "bg-blue-50 text-blue-700" }}
                actionText="Manage access"
              />
              
              <ActivityItem
                icon="ri-ai-generate"
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
                title="AI Health Analysis"
                timestamp="5 days ago"
                description="Sleep pattern analysis completed"
                badge={{ text: "Privacy preserved", icon: "ri-shield-check-line", color: "bg-purple-50 text-purple-700" }}
                actionText="View insights"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  timestamp: string;
  description: string;
  badge: {
    text: string;
    icon: string;
    color: string;
  };
  actionText: string;
}

function ActivityItem({ 
  icon, 
  iconBg, 
  iconColor,
  title, 
  timestamp, 
  description, 
  badge, 
  actionText 
}: ActivityItemProps) {
  // Render the appropriate icon based on the icon name
  const renderIcon = () => {
    switch(icon) {
      case 'ri-file-text-line':
        return <RiFileTextLine className={iconColor} size={20} />;
      case 'ri-exchange-line':
        return <RiExchangeLine className={iconColor} size={20} />;
      case 'ri-ai-generate':
        return <RiAiGenerate className={iconColor} size={20} />;
      default:
        return <RiFileTextLine className={iconColor} size={20} />;
    }
  };

  // Render the badge icon
  const renderBadgeIcon = () => {
    switch(badge.icon) {
      case 'ri-lock-line':
        return <RiLockLine size={14} />;
      case 'ri-timer-line':
        return <RiTimerLine size={14} />;
      case 'ri-shield-check-line':
        return <RiShieldCheckLine size={14} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {renderIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-neutral-800">{title}</h4>
            <span className="text-xs text-neutral-500">{timestamp}</span>
          </div>
          <p className="text-sm text-neutral-600">{description}</p>
          <div className="flex items-center mt-1">
            <div className={`flex items-center space-x-1 ${badge.color} px-2 py-0.5 rounded text-xs`}>
              {renderBadgeIcon()}
              <span>{badge.text}</span>
            </div>
            <Button variant="link" size="sm" className="ml-3 text-xs text-primary-600 p-0 h-auto">{actionText}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
