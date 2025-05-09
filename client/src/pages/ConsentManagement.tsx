import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

import { CheckboxCircleIcon, ShieldCheckIcon, LockIcon } from "@/lib/icons";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DataAccessProvider } from "@shared/schema";

export default function ConsentManagement() {
  const [currentTab, setCurrentTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [newConsentDialog, setNewConsentDialog] = useState(false);
  
  const { toast } = useToast();
  
  const { data: providers, isLoading } = useQuery({
    queryKey: ["/api/consent/providers"],
  });
  
  const toggleConsent = useMutation({
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
      toast({
        title: "Consent updated",
        description: "Your data access permissions have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating consent",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const reviewConsent = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const response = await fetch(`/api/consent/providers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, active: status === "approved" })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update consent");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consent/providers"] });
      toast({
        title: "Request reviewed",
        description: "Your decision has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error reviewing request",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleToggleConsent = (id: string, active: boolean) => {
    toggleConsent.mutate({ id, active });
  };
  
  const filteredProviders = providers?.filter((provider: DataAccessProvider) => {
    if (!searchQuery) return true;
    return (
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  const activeProviders = filteredProviders?.filter((provider: DataAccessProvider) => 
    provider.status === "approved"
  );
  
  const pendingProviders = filteredProviders?.filter((provider: DataAccessProvider) => 
    provider.status === "pending"
  );
  
  return (
    <main className="flex-1 overflow-auto p-6 md:pt-6 pt-20">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="font-display text-xl font-medium text-neutral-800">Consent Management</h2>
          <div className="mt-2 md:mt-0 flex items-center gap-2">
            <Badge variant="outline" className="bg-secondary-50 text-secondary-700 px-2 py-1 flex items-center gap-1">
              <ShieldCheckIcon />
              <span>Zero-Knowledge Proofs</span>
            </Badge>
            <Button onClick={() => setNewConsentDialog(true)}>
              <LockIcon className="mr-2 h-4 w-4" />
              Grant New Access
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Data Access Control</CardTitle>
              <div className="relative w-full md:w-64">
                <Input 
                  type="text"
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="active">
                    Active Permissions
                    {activeProviders?.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{activeProviders.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending Requests
                    {pendingProviders?.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{pendingProviders.length}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                  {isLoading ? (
                    <div className="space-y-4">
                      
                      
                    </div>
                  ) : activeProviders?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Data Access</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeProviders.map((provider: DataAccessProvider) => (
                          <TableRow key={provider.id}>
                            <TableCell className="font-medium">
                              {provider.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {provider.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {provider.accessTo.map((access) => (
                                  <Badge key={access} variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                                    {access.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {provider.daysLeft ? (
                                <span className="text-sm">{provider.daysLeft} days</span>
                              ) : (
                                <span className="text-sm text-neutral-500">Not set</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Switch 
                                  checked={provider.active} 
                                  onCheckedChange={(checked) => handleToggleConsent(provider.id.toString(), checked)}
                                  className="data-[state=checked]:bg-primary-600"
                                />
                                <span className="ml-2 text-sm">
                                  {provider.active ? "Enabled" : "Disabled"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                Revoke
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <LockIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-800 mb-1">No active permissions</h3>
                      <p className="text-neutral-500 mb-4">You haven't granted data access to any providers yet.</p>
                      <Button onClick={() => setNewConsentDialog(true)}>
                        Grant New Access
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pending">
                  {isLoading ? (
                    <div className="space-y-4">
                      
                      
                    </div>
                  ) : pendingProviders?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Requested Data</TableHead>
                          <TableHead>Date Requested</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingProviders.map((provider: DataAccessProvider) => (
                          <TableRow key={provider.id}>
                            <TableCell className="font-medium">
                              {provider.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {provider.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {provider.accessTo.map((access) => (
                                  <Badge key={access} variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                                    {access.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-neutral-500">Today</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                                onClick={() => reviewConsent.mutate({ id: provider.id.toString(), status: "approved" })}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800 ml-2"
                                onClick={() => reviewConsent.mutate({ id: provider.id.toString(), status: "rejected" })}
                              >
                                Deny
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <CheckboxCircleIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-800 mb-1">No pending requests</h3>
                      <p className="text-neutral-500">You don't have any pending data access requests.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How Your Data is Protected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-medium text-neutral-800 flex items-center mb-2">
                    <ShieldCheckIcon className="mr-2 text-primary-600" />
                    Zero-Knowledge Proofs
                  </h3>
                  <p className="text-sm text-neutral-600">
                    MediBridge uses Zero-Knowledge Proofs to verify your identity and health data without revealing the actual information. This cryptographic method ensures privacy while still allowing verification.
                  </p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-medium text-neutral-800 flex items-center mb-2">
                    <i className="ri-lock-line mr-2 text-primary-600"></i>
                    Blockchain Security
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Your consent records are stored on the Polkadot blockchain, making them tamper-proof and creating an immutable audit trail of who has accessed your data and when.
                  </p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-medium text-neutral-800 flex items-center mb-2">
                    <i className="ri-user-settings-line mr-2 text-primary-600"></i>
                    Granular Access Control
                  </h3>
                  <p className="text-sm text-neutral-600">
                    You have complete control over which parts of your medical data each provider can access, and for how long. Access can be revoked at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Consent Management Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <>
                    
                    
                    
                  </>
                ) : (
                  <>
                    <div className="border-b border-neutral-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Access Granted to Dr. Emily Chen</p>
                          <p className="text-sm text-neutral-500">Medical history, Prescriptions</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">3 days ago</Badge>
                      </div>
                    </div>
                    
                    <div className="border-b border-neutral-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Access Revoked from Metro Health Clinic</p>
                          <p className="text-sm text-neutral-500">All data types</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">1 week ago</Badge>
                      </div>
                    </div>
                    
                    <div className="border-b border-neutral-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Temporary Access Expired</p>
                          <p className="text-sm text-neutral-500">Westside Medical Labs</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">2 weeks ago</Badge>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <Button variant="link" className="text-primary-600">
                        View All Activity
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* New Consent Dialog */}
      <Dialog open={newConsentDialog} onOpenChange={setNewConsentDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Grant Data Access</DialogTitle>
            <DialogDescription>
              Select a healthcare provider and specify which data they can access and for how long.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Healthcare Provider</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nw-medical">Northwest Medical Center</SelectItem>
                  <SelectItem value="dr-chen">Dr. Emily Chen</SelectItem>
                  <SelectItem value="city-labs">CityLabs Diagnostics</SelectItem>
                  <SelectItem value="metro-health">Metro Health Clinic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Types</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="medical-history" className="rounded border-neutral-300" />
                  <label htmlFor="medical-history" className="text-sm">Medical History</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="lab-results" className="rounded border-neutral-300" />
                  <label htmlFor="lab-results" className="text-sm">Lab Results</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="prescriptions" className="rounded border-neutral-300" />
                  <label htmlFor="prescriptions" className="text-sm">Prescriptions</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="imaging" className="rounded border-neutral-300" />
                  <label htmlFor="imaging" className="text-sm">Imaging</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Access Duration</label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewConsentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setNewConsentDialog(false);
                toast({
                  title: "Access granted",
                  description: "Healthcare provider has been granted access to the selected data.",
                });
              }}
            >
              Grant Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
