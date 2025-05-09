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

// Helper functions for determining provider icons based on type
function getProviderIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'doctor':
    case 'physician':
      return 'ri-user-6-line';
    case 'lab':
    case 'laboratory':
      return 'ri-test-tube-line';
    case 'hospital':
    case 'clinic':
    default:
      return 'ri-hospital-line';
  }
}

function getProviderIconBg(type: string): string {
  switch (type.toLowerCase()) {
    case 'doctor':
    case 'physician':
      return 'bg-indigo-100';
    case 'lab':
    case 'laboratory':
      return 'bg-orange-100';
    case 'hospital':
    case 'clinic':
    default:
      return 'bg-blue-100';
  }
}

function getProviderIconColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'doctor':
    case 'physician':
      return 'text-indigo-600';
    case 'lab':
    case 'laboratory':
      return 'text-orange-600';
    case 'hospital':
    case 'clinic':
    default:
      return 'text-blue-600';
  }
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

function ProviderAccessCardModern({
  icon,
  iconBg,
  iconColor,
  name,
  status,
  daysLeft,
  active = false,
  isPending = false,
  accessTo = [], // Default to empty array if not provided
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
    <div className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-lg ${
          icon === "ri-hospital-line" ? "bg-gradient-to-br from-blue-400 to-blue-600" :
          icon === "ri-user-6-line" ? "bg-gradient-to-br from-indigo-400 to-indigo-600" :
          "bg-gradient-to-br from-orange-400 to-orange-600"
        } flex items-center justify-center flex-shrink-0 shadow group-hover:shadow-lg transition-all duration-300`}>
          {icon === "ri-hospital-line" && <RiHospitalLine className="text-white" size={22} />}
          {icon === "ri-user-6-line" && <RiUser6Line className="text-white" size={22} />}
          {icon === "ri-test-tube-line" && <RiTestTubeLine className="text-white" size={22} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{name}</h4>
            {isBlockchainVerified && (
              <Badge variant="outline" className="ml-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.91 11.12C20.91 16.01 17.36 20.59 12.51 21.93C12.18 22.02 11.82 22.02 11.49 21.93C6.64 20.59 3.09 16.01 3.09 11.12V6.73C3.09 5.91 3.71 4.98 4.48 4.67L10.05 2.39C11.13 1.93 12.86 1.93 13.94 2.39L19.51 4.67C20.29 4.98 20.91 5.91 20.91 6.73V11.12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12.5V15.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[10px] font-medium">Verified</span>
                </div>
              </Badge>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{status}</span>
            {daysLeft && (
              <div className="flex items-center ml-3 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 shadow-sm">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{daysLeft} days left</span>
              </div>
            )}
          </div>
        </div>
        {isPending ? (
          <Button 
            onClick={onReview} 
            size="sm" 
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md px-3 py-1.5 rounded-lg hover:shadow-lg transition-all"
          >
            Review
          </Button>
        ) : (
          <Switch 
            checked={isActive} 
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-secondary-500 data-[state=checked]:to-secondary-600"
          />
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {accessTo.map((item, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 shadow-sm"
            >
              {item}
            </Badge>
          ))}
        </div>
        
        {isBlockchainVerified && (
          <p className="mt-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center">
            <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.17004 7.43994L12 12.5499L20.77 7.46991" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 21.61V12.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.93 2.48L5.59 5.44001C4.38 6.11001 3.39 7.79001 3.39 9.17001V14.82C3.39 16.2 4.38 17.88 5.59 18.55L10.94 21.52C12.1 22.15 13.9 22.15 15.06 21.52L20.41 18.55C21.62 17.88 22.61 16.2 22.61 14.82V9.17001C22.61 7.79001 21.62 6.11001 20.41 5.44001L15.06 2.47C13.9 1.84 12.1 1.84 10.93 2.48Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cryptographically secured on blockchain
          </p>
        )}
      </div>
    </div>
  );
}

// Keep the original ProviderAccessCard for backwards compatibility
function ProviderAccessCard({
  icon,
  iconBg,
  iconColor,
  name,
  status,
  daysLeft,
  active = false,
  isPending = false,
  accessTo = [], // Default to empty array if not provided
  onToggle,
  onReview,
  isBlockchainVerified = false
}: ProviderAccessCardProps) {
  return (
    <ProviderAccessCardModern
      icon={icon}
      iconBg={iconBg}
      iconColor={iconColor}
      name={name}
      status={status}
      daysLeft={daysLeft}
      active={active}
      isPending={isPending}
      accessTo={accessTo}
      onToggle={onToggle}
      onReview={onReview}
      isBlockchainVerified={isBlockchainVerified}
    />
  );
}

export default function DataAccessControl() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [accessDuration, setAccessDuration] = useState("30");
  
  const { data: providers = [], isLoading } = useQuery<DataAccessProvider[]>({
    queryKey: ["/api/consent/providers"],
    // Add default empty array to prevent null issues
    select: (data) => data || []
  });
  
  const { data: allProviders = [], isLoading: isProvidersLoading } = useQuery<any[]>({
    queryKey: ["/api/providers"],
    // Add default empty array to prevent null issues
    select: (data) => data || []
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
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg relative bg-white dark:bg-slate-800">
      {/* Subtle security pattern background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMGMyLjE4IDAgMy4zMyAxIDUgM2w0IDRjMiAyIDMgMyAzIDUuMzN2MTAuNjdjMCA1LTIgOC02IDEwLjY3TDMwIDQwbC02LTYuMzNjLTQtMi42Ny02LTUuNjctNi0xMC42N1YxMi4zM2MwLTIuMzMgMS00IDMtNS4zM2w0LTRjMS42Ny0yIDIuODItMyA1LTN6IiBmaWxsPSIjMzMzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]">
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 rounded-lg bg-gradient-to-br from-secondary-400 to-secondary-600 flex-shrink-0 flex items-center justify-center shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M9 11V17L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 17L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <CardTitle className="text-lg font-display tracking-tight text-slate-800 dark:text-white">Data Access Control</CardTitle>
        </div>
        <Badge variant="outline" className="bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium border-secondary-200 dark:border-secondary-800">
          <ShieldCheckIcon className="text-secondary-500 dark:text-secondary-400 h-4 w-4" />
          <span>Blockchain Protected</span>
        </Badge>
      </CardHeader>
      
      <CardContent className="p-5 relative z-10">
        <div className="space-y-5">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <div className="relative">
                <div className="h-14 w-14 rounded-full border-t-2 border-b-2 border-secondary-500 animate-spin"></div>
                <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-secondary-300 animate-spin absolute top-2 left-2"></div>
                <div className="h-6 w-6 rounded-full border-t-2 border-b-2 border-secondary-100 animate-spin absolute top-4 left-4"></div>
              </div>
            </div>
          ) : providers.length > 0 ? (
            <>
              {providers.map((provider: DataAccessProvider) => (
                <ProviderAccessCardModern
                  key={provider.id}
                  icon={getProviderIcon(provider.type || 'hospital')}
                  iconBg={getProviderIconBg(provider.type || 'hospital')}
                  iconColor={getProviderIconColor(provider.type || 'hospital')}
                  name={provider.name}
                  status={provider.status === 'approved' ? 'Active permission' : 
                         provider.status === 'pending' ? 'Pending request' : 'Inactive'}
                  daysLeft={provider.daysLeft}
                  active={provider.active}
                  isPending={provider.status === 'pending'}
                  accessTo={Array.isArray(provider.accessTo) ? provider.accessTo : []}
                  onToggle={(active) => toggleAccess.mutate({ id: provider.id.toString(), active })}
                  onReview={() => {}}
                  isBlockchainVerified={Boolean(provider.blockchainHash)}
                />
              ))}
            </>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <div className="mx-auto h-16 w-16 rounded-full bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center">
                <RiShieldKeyholeLine className="h-8 w-8 text-secondary-300 dark:text-secondary-700" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">No active permissions</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You haven't granted any data access permissions yet.</p>
              <Button 
                className="mt-5 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-md hover:shadow-lg transition-all"
                onClick={() => setIsDialogOpen(true)}
              >
                <RiAddLine className="mr-2 h-4 w-4" />
                Grant Access
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-5">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm">
                <RiAddLine className="mr-2" size={16} />
                Manage Data Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800 dark:text-white text-xl">Grant Selective Data Access</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                  Use blockchain-secured permissions to grant providers access to specific data categories.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="provider" className="text-slate-700 dark:text-slate-300">Healthcare Provider</Label>
                  <Select value={selectedProvider?.toString()} onValueChange={(value) => setSelectedProvider(parseInt(value))}>
                    <SelectTrigger className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      {isProvidersLoading ? (
                        <div className="flex justify-center p-2">
                          <div className="h-5 w-5 rounded-full border-t-2 border-b-2 border-secondary-500 animate-spin"></div>
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
                  <Label className="text-slate-700 dark:text-slate-300">Data Categories</Label>
                  <div className="grid grid-cols-2 gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    {availableDataTypes.map((dataType) => (
                      <div key={dataType} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`data-type-${dataType}`} 
                          checked={selectedDataTypes.includes(dataType)}
                          onCheckedChange={(checked) => 
                            handleDataTypeChange(dataType, checked === true)
                          }
                          className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-secondary-600 data-[state=checked]:border-secondary-600"
                        />
                        <Label htmlFor={`data-type-${dataType}`} className="text-sm font-normal text-slate-700 dark:text-slate-300">
                          {dataType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="duration" className="text-slate-700 dark:text-slate-300">Access Duration (days)</Label>
                  <Select value={accessDuration} onValueChange={setAccessDuration}>
                    <SelectTrigger className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex p-4 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-sm">
                  <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5 text-blue-500 dark:text-blue-400" />
                  <p className="leading-relaxed">
                    Access permissions are secured with blockchain technology and cryptographic verification. The provider will only have access to the selected data types for the specified duration.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-300 dark:border-slate-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => grantBlockchainAccess.mutate()}
                  disabled={grantBlockchainAccess.isPending || !selectedProvider || selectedDataTypes.length === 0}
                  className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white"
                >
                  {grantBlockchainAccess.isPending ? (
                    <div className="h-5 w-5 rounded-full border-2 border-secondary-200 border-t-secondary-600 animate-spin mr-2"></div>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
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

function ProviderAccessCardModern({
  icon,
  iconBg,
  iconColor,
  name,
  status,
  daysLeft,
  active = false,
  isPending = false,
  accessTo = [], // Default to empty array if not provided
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
    <div className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-lg ${
          icon === "ri-hospital-line" ? "bg-gradient-to-br from-blue-400 to-blue-600" :
          icon === "ri-user-6-line" ? "bg-gradient-to-br from-indigo-400 to-indigo-600" :
          "bg-gradient-to-br from-orange-400 to-orange-600"
        } flex items-center justify-center flex-shrink-0 shadow group-hover:shadow-lg transition-all duration-300`}>
          {icon === "ri-hospital-line" && <RiHospitalLine className="text-white" size={22} />}
          {icon === "ri-user-6-line" && <RiUser6Line className="text-white" size={22} />}
          {icon === "ri-test-tube-line" && <RiTestTubeLine className="text-white" size={22} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{name}</h4>
            {isBlockchainVerified && (
              <Badge variant="outline" className="ml-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.91 11.12C20.91 16.01 17.36 20.59 12.51 21.93C12.18 22.02 11.82 22.02 11.49 21.93C6.64 20.59 3.09 16.01 3.09 11.12V6.73C3.09 5.91 3.71 4.98 4.48 4.67L10.05 2.39C11.13 1.93 12.86 1.93 13.94 2.39L19.51 4.67C20.29 4.98 20.91 5.91 20.91 6.73V11.12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12.5V15.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[10px] font-medium">Verified</span>
                </div>
              </Badge>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{status}</span>
            {daysLeft && (
              <div className="flex items-center ml-3 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 shadow-sm">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{daysLeft} days left</span>
              </div>
            )}
          </div>
        </div>
        {isPending ? (
          <Button 
            onClick={onReview} 
            size="sm" 
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md px-3 py-1.5 rounded-lg hover:shadow-lg transition-all"
          >
            Review
          </Button>
        ) : (
          <Switch 
            checked={isActive} 
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-secondary-500 data-[state=checked]:to-secondary-600"
          />
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {accessTo.map((item, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 shadow-sm"
            >
              {item}
            </Badge>
          ))}
        </div>
        
        {isBlockchainVerified && (
          <p className="mt-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center">
            <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.17004 7.43994L12 12.5499L20.77 7.46991" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 21.61V12.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.93 2.48L5.59 5.44001C4.38 6.11001 3.39 7.79001 3.39 9.17001V14.82C3.39 16.2 4.38 17.88 5.59 18.55L10.94 21.52C12.1 22.15 13.9 22.15 15.06 21.52L20.41 18.55C21.62 17.88 22.61 16.2 22.61 14.82V9.17001C22.61 7.79001 21.62 6.11001 20.41 5.44001L15.06 2.47C13.9 1.84 12.1 1.84 10.93 2.48Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cryptographically secured on blockchain
          </p>
        )}
      </div>
    </div>
  );
}

// Keep the original ProviderAccessCard for backwards compatibility
function ProviderAccessCard({
  icon,
  iconBg,
  iconColor,
  name,
  status,
  daysLeft,
  active = false,
  isPending = false,
  accessTo = [], // Default to empty array if not provided
  onToggle,
  onReview,
  isBlockchainVerified = false
}: ProviderAccessCardProps) {
  return (
    <ProviderAccessCardModern
      icon={icon}
      iconBg={iconBg}
      iconColor={iconColor}
      name={name}
      status={status}
      daysLeft={daysLeft}
      active={active}
      isPending={isPending}
      accessTo={accessTo}
      onToggle={onToggle}
      onReview={onReview}
      isBlockchainVerified={isBlockchainVerified}
    />
  );
}
