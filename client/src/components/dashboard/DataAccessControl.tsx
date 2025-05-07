import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheckIcon } from "@/lib/icons";
import { DataAccessProvider } from "@shared/schema";
import { RiHospitalLine, RiUser6Line, RiTestTubeLine, RiAddLine } from 'react-icons/ri';

export default function DataAccessControl() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ["/api/consent/providers"],
  });

  const toggleAccess = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const response = await fetch(`/api/consent/providers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update consent");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consent/providers"] });
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Data Access Control</CardTitle>
        <Badge variant="outline" className="bg-secondary-50 text-secondary-700 px-2 py-1 flex items-center gap-1">
          <ShieldCheckIcon />
          <span>ZKP Protected</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          ) : (
            <>
              <ProviderAccessCard 
                icon="ri-hospital-line"
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                name="Northwest Medical Center"
                status="Active permission"
                daysLeft={30}
                active={true}
                accessTo={["Medical history", "Lab results", "Prescriptions"]}
                onToggle={(active) => toggleAccess.mutate({ id: "nw-medical", active })}
              />
              
              <ProviderAccessCard 
                icon="ri-user-6-line"
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
                name="Dr. Emily Chen"
                status="Active permission"
                daysLeft={15}
                active={true}
                accessTo={["Medical history", "Prescriptions"]}
                onToggle={(active) => toggleAccess.mutate({ id: "dr-chen", active })}
              />
              
              <ProviderAccessCard 
                icon="ri-test-tube-line"
                iconBg="bg-orange-100"
                iconColor="text-orange-600"
                name="CityLabs Diagnostics"
                status="Pending request"
                isPending={true}
                accessTo={["Lab results"]}
                onReview={() => {}}
              />
            </>
          )}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            <RiAddLine className="mr-1" size={16} />
            Manage Data Access
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProviderAccessCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  name: string;
  status: string;
  daysLeft?: number;
  active?: boolean;
  isPending?: boolean;
  accessTo: string[];
  onToggle?: (active: boolean) => void;
  onReview?: () => void;
}

function ProviderAccessCard({
  icon,
  iconBg,
  iconColor,
  name,
  status,
  daysLeft,
  active = false,
  isPending = false,
  accessTo,
  onToggle,
  onReview
}: ProviderAccessCardProps) {
  const [isActive, setIsActive] = useState(active);

  const handleToggle = () => {
    setIsActive(!isActive);
    onToggle?.(!isActive);
  };

  return (
    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon === "ri-hospital-line" && <RiHospitalLine className={iconColor} size={20} />}
          {icon === "ri-user-6-line" && <RiUser6Line className={iconColor} size={20} />}
          {icon === "ri-test-tube-line" && <RiTestTubeLine className={iconColor} size={20} />}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-neutral-800">{name}</h4>
          <div className="flex items-center mt-1">
            <span className="text-xs text-neutral-500">{status}</span>
            {daysLeft && (
              <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{daysLeft} days left</span>
            )}
          </div>
        </div>
        {isPending ? (
          <Button onClick={onReview} size="sm" className="bg-primary-600 text-white text-xs px-2 py-1 rounded hover:bg-primary-700">
            Review
          </Button>
        ) : (
          <Switch 
            checked={isActive} 
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary-600"
          />
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-neutral-200 text-xs text-neutral-600">
        <p>{isPending ? "Requesting access to" : "Access to"}: {accessTo.join(", ")}</p>
      </div>
    </div>
  );
}
