import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { HospitalIcon, ShieldCheckIcon } from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";
import { Provider } from "@shared/schema";

export default function Providers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [providerDialog, setProviderDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  
  const { toast } = useToast();
  
  const { data: providers, isLoading } = useQuery({
    queryKey: ["/api/providers"],
  });
  
  const handleViewProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setProviderDialog(true);
  };
  
  const filteredProviders = providers?.filter((provider: Provider) => {
    if (!searchQuery) return true;
    return (
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Filter providers by type for tabs
  const getProvidersByType = (type: string) => {
    if (type === "all") return filteredProviders;
    return filteredProviders?.filter(
      (provider: Provider) => provider.type === type
    );
  };

  return (
    <main className="flex-1 overflow-auto p-6 md:pt-6 pt-20">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="font-display text-xl font-medium text-neutral-800">Healthcare Providers</h2>
          <div className="mt-2 md:mt-0">
            <Badge variant="outline" className="bg-secondary-50 text-secondary-700 px-2 py-1 flex items-center gap-1">
              <ShieldCheckIcon />
              <span>Blockchain Verified</span>
            </Badge>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Provider Directory</CardTitle>
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
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-2">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Providers</TabsTrigger>
                <TabsTrigger value="hospital">Hospitals</TabsTrigger>
                <TabsTrigger value="doctor">Doctors</TabsTrigger>
                <TabsTrigger value="lab">Labs</TabsTrigger>
                <TabsTrigger value="clinic">Clinics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {renderProviderTable(getProvidersByType("all"), isLoading, handleViewProvider)}
              </TabsContent>
              
              <TabsContent value="hospital">
                {renderProviderTable(getProvidersByType("hospital"), isLoading, handleViewProvider)}
              </TabsContent>
              
              <TabsContent value="doctor">
                {renderProviderTable(getProvidersByType("doctor"), isLoading, handleViewProvider)}
              </TabsContent>
              
              <TabsContent value="lab">
                {renderProviderTable(getProvidersByType("lab"), isLoading, handleViewProvider)}
              </TabsContent>
              
              <TabsContent value="clinic">
                {renderProviderTable(getProvidersByType("clinic"), isLoading, handleViewProvider)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>About Provider Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-neutral-600">
                  MediBridge's provider network consists of verified healthcare professionals and organizations. All providers in our network have been verified and are able to securely access your health information when you grant consent.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <HospitalIcon className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-lg">42</h3>
                    <p className="text-sm text-neutral-600">Hospitals</p>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-user-6-line text-purple-600"></i>
                    </div>
                    <h3 className="font-medium text-lg">178</h3>
                    <p className="text-sm text-neutral-600">Doctors</p>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-test-tube-line text-green-600"></i>
                    </div>
                    <h3 className="font-medium text-lg">35</h3>
                    <p className="text-sm text-neutral-600">Labs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-medium text-neutral-800 flex items-center mb-2">
                    <i className="ri-shield-check-line mr-2 text-primary-600"></i>
                    Provider Authentication
                  </h3>
                  <p className="text-sm text-neutral-600">
                    All healthcare providers on MediBridge are authenticated using blockchain technology, ensuring their identities are verified and tamper-proof.
                  </p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-medium text-neutral-800 flex items-center mb-2">
                    <i className="ri-link-m mr-2 text-primary-600"></i>
                    Polkadot Integration
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Providers are verified through the Polkadot network, creating an immutable record of their credentials and certifications.
                  </p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="font-medium text-neutral-800 flex items-center mb-2">
                    <i className="ri-lock-line mr-2 text-primary-600"></i>
                    Access Control
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Only verified providers can request access to your medical data, and you maintain full control over who can access your information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Provider Details Dialog */}
      <Dialog open={providerDialog} onOpenChange={setProviderDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProvider?.name}</DialogTitle>
            <DialogDescription>
              Provider details and verification information
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-4">
              <div className="flex items-center mb-2">
                <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700">
                  {selectedProvider?.type}
                </Badge>
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                  <i className="ri-checkbox-circle-line mr-1"></i>
                  Verified
                </Badge>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start">
                  <i className="ri-map-pin-line text-neutral-500 mt-0.5 mr-2"></i>
                  <div>
                    <p className="text-sm text-neutral-800">{selectedProvider?.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="ri-mail-line text-neutral-500 mt-0.5 mr-2"></i>
                  <div>
                    <p className="text-sm text-neutral-800">{selectedProvider?.contact}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="ri-fingerprint-line text-neutral-500 mt-0.5 mr-2"></i>
                  <div>
                    <p className="text-sm font-mono text-neutral-800">
                      {selectedProvider?.blockchainId}
                    </p>
                    <p className="text-xs text-neutral-500">Blockchain ID</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-neutral-800">Services Offered</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <i className="ri-heart-pulse-line text-red-500 mb-1"></i>
                  <p className="text-sm font-medium">Cardiology</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <i className="ri-mental-health-line text-purple-500 mb-1"></i>
                  <p className="text-sm font-medium">Neurology</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <i className="ri-lungs-line text-blue-500 mb-1"></i>
                  <p className="text-sm font-medium">Pulmonology</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <i className="ri-test-tube-line text-green-500 mb-1"></i>
                  <p className="text-sm font-medium">Lab Tests</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProviderDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setProviderDialog(false);
                toast({
                  title: "Access request initiated",
                  description: "Request sent to grant data access to this provider.",
                });
              }}
            >
              Request Data Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function renderProviderTable(providers: Provider[] | undefined, isLoading: boolean, onViewProvider: (provider: Provider) => void) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!providers || providers.length === 0) {
    return (
      <div className="text-center py-8">
        <HospitalIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-800 mb-1">No providers found</h3>
        <p className="text-neutral-500">Try adjusting your search or filters</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Blockchain ID</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {providers.map((provider) => (
          <TableRow key={provider.id}>
            <TableCell className="font-medium">{provider.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {provider.type}
              </Badge>
            </TableCell>
            <TableCell>{provider.contact}</TableCell>
            <TableCell className="font-mono text-xs truncate max-w-[140px]">
              {provider.blockchainId}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onViewProvider(provider)}>
                View
              </Button>
              <Button variant="ghost" size="sm">
                Connect
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
