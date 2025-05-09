import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

import { ShieldCheckIcon } from "@/lib/icons";
import { DataAccessProvider } from "@shared/schema";
import { RiHospitalLine, RiUser6Line, RiTestTubeLine, RiAddLine, RiShieldKeyholeLine, RiTimeLine } from 'react-icons/ri';

export default function DataAccessControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [accessDuration, setAccessDuration] = useState("30");
  
  const { data: providers, isLoading } = useQuery({
    queryKey: ["/api/consent/providers"],
  });
  
  const { data: allProviders, isLoading: isProvidersLoading } = useQuery({
    queryKey: ["/api/providers"],
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
  
  const grantBlockchainAccess = useMutation({
    mutationFn: async () => {
      if (!selectedProvider || selectedDataTypes.length === 0) {
        throw new Error("Please select a provider and at least one data type");
      }
      
      const response = await fetch("/api/blockchain/access/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: selectedProvider,
          dataTypes: selectedDataTypes,
          duration: parseInt(accessDuration)
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to grant access");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consent/providers"] });
      setIsDialogOpen(false);
      resetForm();
    }
  });
  
  const resetForm = () => {
    setSelectedProvider(null);
    setSelectedDataTypes([]);
    setAccessDuration("30");
  };
  
  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    if (checked) {
      setSelectedDataTypes(prev => [...prev, dataType]);
    } else {
      setSelectedDataTypes(prev => prev.filter(type => type !== dataType));
    }
  };
  
  const availableDataTypes = [
    "Medical history",
    "Lab results",
    "Prescriptions",
    "Appointments",
    "Vital signs",
    "Allergies",
    "Immunizations"
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Data Access Control</CardTitle>
        <Badge variant="outline" className="bg-secondary-50 text-secondary-700 px-2 py-1 flex items-center gap-1">
          <div className="flex items-center">
            <ShieldCheckIcon />
            <span className="ml-1">Blockchain Protected</span>
          </div>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Spinner size="lg" />
            </div>
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
                isBlockchainVerified={true}
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
                isBlockchainVerified={true}
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <RiAddLine className="mr-1" size={16} />
                Manage Data Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Grant Selective Data Access</DialogTitle>
                <DialogDescription>
                  Use blockchain-secured permissions to grant providers access to specific data categories.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="provider">Healthcare Provider</Label>
                  <Select value={selectedProvider?.toString()} onValueChange={(value) => setSelectedProvider(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {isProvidersLoading ? (
                        <div className="flex justify-center p-2">
                          <Spinner size="sm" />
                        </div>
                      ) : (
                        Array.isArray(allProviders) 
                          ? allProviders.map((provider: any) => (
                              <SelectItem key={provider.id} value={provider.id.toString()}>
                                {provider.name}
                              </SelectItem>
                            ))
                          : (
                            <>
                              <SelectItem value="1">Northwest Medical Center</SelectItem>
                              <SelectItem value="2">Dr. Emily Chen</SelectItem>
                              <SelectItem value="3">CityLabs Diagnostics</SelectItem>
                            </>
                          )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Data Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableDataTypes.map((dataType) => (
                      <div key={dataType} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`data-type-${dataType}`} 
                          checked={selectedDataTypes.includes(dataType)}
                          onCheckedChange={(checked) => 
                            handleDataTypeChange(dataType, checked === true)
                          }
                        />
                        <Label htmlFor={`data-type-${dataType}`} className="text-sm font-normal">
                          {dataType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="duration">Access Duration (days)</Label>
                  <Select value={accessDuration} onValueChange={setAccessDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-2 rounded bg-blue-50 text-blue-700 text-xs flex items-start mt-2">
                  <AlertCircle size={16} className="mr-2 shrink-0 mt-0.5" />
                  <p>Access permissions are secured with blockchain technology and cryptographic verification. The provider will only have access to the selected data types for the specified duration.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => grantBlockchainAccess.mutate()}
                  disabled={grantBlockchainAccess.isPending || !selectedProvider || selectedDataTypes.length === 0}
                >
                  {grantBlockchainAccess.isPending ? <Spinner size="sm" className="mr-2" /> : null}
                  Grant Access
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
  isBlockchainVerified?: boolean;
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
  onReview,
  isBlockchainVerified = false
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
          <div className="flex items-center">
            <h4 className="font-medium text-neutral-800">{name}</h4>
            {isBlockchainVerified && (
              <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 flex items-center gap-1">
                <RiShieldKeyholeLine size={12} className="mr-0.5" />
                <span className="text-[10px]">Blockchain Verified</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center mt-1">
            <span className="text-xs text-neutral-500">{status}</span>
            {daysLeft && (
              <div className="flex items-center ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                <RiTimeLine size={12} className="mr-1" />
                <span>{daysLeft} days left</span>
              </div>
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
        {isBlockchainVerified && (
          <p className="mt-1 text-emerald-600 flex items-center">
            <RiShieldKeyholeLine size={12} className="mr-1" />
            Cryptographically secured with blockchain smart contracts
          </p>
        )}
      </div>
    </div>
  );
}
