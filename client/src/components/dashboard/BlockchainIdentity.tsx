import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Shield, Check, Key } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BlockchainIdentity() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [credentialType, setCredentialType] = useState<string>("patientIdentity");
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [credentialIdToVerify, setCredentialIdToVerify] = useState("");
  
  // Fetch existing credentials
  const { data: credentials, isLoading } = useQuery({
    queryKey: ["/api/blockchain/identity/credentials"],
    queryFn: async () => {
      // Fallback mock data for now until API is fully implemented
      return [
        {
          id: "vc-123456",
          type: "patientIdentity",
          createdAt: "2023-05-01T12:00:00Z",
          verified: true
        },
        {
          id: "vc-789012",
          type: "insuranceVerification",
          createdAt: "2023-04-15T09:30:00Z",
          verified: true
        }
      ];
    }
  });
  
  const createCredential = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/blockchain/identity/credential", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialType
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create credential");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/blockchain/identity/credentials"] });
      setIsDialogOpen(false);
      toast({
        title: "Credential Created",
        description: `Your ${credentialTypeLabels[credentialType] || credentialType} credential has been created and secured on the blockchain.`,
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create credential",
        variant: "destructive"
      });
    }
  });
  
  const verifyCredential = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/blockchain/identity/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialId: credentialIdToVerify
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to verify credential");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setVerifyDialogOpen(false);
      toast({
        title: data.verified ? "Credential Verified" : "Verification Failed",
        description: data.verified 
          ? "The credential was successfully verified on the blockchain." 
          : "The credential could not be verified. It may be invalid or expired.",
        variant: data.verified ? "default" : "destructive"
      });
    }
  });
  
  const credentialTypeLabels: Record<string, string> = {
    "patientIdentity": "Patient Identity",
    "insuranceVerification": "Insurance Verification",
    "medicalLicense": "Medical License",
    "pharmacyLicense": "Pharmacy License",
    "labCertification": "Laboratory Certification"
  };
  
  const credentialTypeDescriptions: Record<string, string> = {
    "patientIdentity": "Securely verify your identity across healthcare providers without sharing sensitive information.",
    "insuranceVerification": "Prove insurance coverage to providers without revealing policy details.",
    "medicalLicense": "Verify your medical credentials across institutions and jurisdictions.",
    "pharmacyLicense": "Validate pharmacy credentials for prescription processing.",
    "labCertification": "Verify laboratory certification for processing medical tests."
  };

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg relative bg-white dark:bg-slate-800">
      {/* Subtle hexagon pattern background for blockchain theme */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTguOTcgNi4zMzZsLTkuNDg1IDUuNDc3djEwLjk1M2w5LjQ4NSA1LjQ3NiA5LjQ4NS01LjQ3NlYxMS44MTNMMTguOTcgNi4zMzZ6TTQwLjQ0IDYuMzM2bC05LjQ4NSA1LjQ3N3YxMC45NTNsOS40ODUgNS40NzYgOS40ODUtNS40NzZWMTEuODEzTDQwLjQ0IDYuMzM2ek0yOS43MDUgMjEuNzE5bC05LjQ4NSA1LjQ3N3YxMC45NTNsOS40ODUgNS40NzYgOS40ODUtNS40NzZWMjcuMTk2bC05LjQ4NS01LjQ3N3pNNTEuMTc2IDIxLjcxOWwtOS40ODUgNS40Nzd2MTAuOTUzbDkuNDg1IDUuNDc2IDkuNDg1LTUuNDc2VjI3LjE5NmwtOS40ODUtNS40Nzd6TTguMjM1IDIxLjcxOWwtOS40ODUgNS40Nzd2MTAuOTUzbDkuNDg1IDUuNDc2IDkuNDg1LTUuNDc2VjI3LjE5NmwtOS40ODUtNS40Nzd6TTE4Ljk3IDM3LjEwMmwtOS40ODUgNS40Nzd2MTAuOTUzbDkuNDg1IDUuNDc2IDkuNDg1LTUuNDc2VjQyLjU3OWwtOS40ODUtNS40Nzd6TTQwLjQ0IDM3LjEwMmwtOS40ODUgNS40Nzd2MTAuOTUzbDkuNDg1IDUuNDc2IDkuNDg1LTUuNDc2VjQyLjU3OWwtOS40ODUtNS40Nzd6IiBmaWxsPSIjMzMzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')]">
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex-shrink-0 flex items-center justify-center shadow-md">
            <Shield className="text-white h-5 w-5" />
          </div>
          <CardTitle className="text-lg font-display tracking-tight text-slate-800 dark:text-white">Cross-Provider Identity</CardTitle>
        </div>
        <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
          <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12.5V16.5C2 20 4 22 7.5 22H16.5C20 22 22 20 22 16.5V7.5C22 4 20 2 16.5 2H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 7L2 15V18H5L13 10" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 15L10.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path opacity="0.4" d="M2 12.5V7C2 4 4 2 7 2H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Blockchain Verified</span>
        </Badge>
      </CardHeader>
      
      <CardContent className="p-5 relative z-10">
        <div className="space-y-5">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
                <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-indigo-300 animate-spin absolute top-2 left-2"></div>
                <div className="h-8 w-8 rounded-full border-t-2 border-b-2 border-indigo-100 animate-spin absolute top-4 left-4"></div>
              </div>
            </div>
          ) : (
            <>
              <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-sm">
                <div className="flex gap-3">
                  <div className="bg-blue-100 dark:bg-blue-800/50 p-1.5 rounded-full">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    Verifiable credentials let you securely share your identity across healthcare providers with zero-knowledge proofs.
                  </AlertDescription>
                </div>
              </Alert>
              
              <div className="space-y-3">
                {credentials?.map((credential: any) => (
                  <div 
                    key={credential.id} 
                    className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Properly sized and positioned icon container */}
                        <div className="w-12 h-12 min-w-[3rem] rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow group-hover:shadow-lg transition-all duration-300">
                          <Key className="text-white h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center flex-wrap gap-2">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                              {credentialTypeLabels[credential.type] || credential.type}
                            </h4>
                            {credential.verified && (
                              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                <Check size={10} className="mr-1" />
                                <span className="text-[10px] font-medium">Verified</span>
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Created {new Date(credential.createdAt).toLocaleDateString()} • Secured with ZK-Proofs
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-all shadow-sm"
                          onClick={() => {
                            setCredentialIdToVerify(credential.id);
                            setVerifyDialogOpen(true);
                          }}
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.4 13.8999L9 15.2999C8.42 15.8799 7.5 15.8799 6.92 15.2999L4.07 12.4499C3.49 11.8699 3.49 10.9499 4.07 10.3699L9.05 5.39991C9.2 5.24991 9.38 5.13991 9.58 5.08991L12.89 3.99991C13.52 3.82991 14.1 4.14991 14.33 4.74991C14.34 4.78991 14.36 4.83991 14.37 4.88991L15.21 9.09991C15.26 9.35991 15.16 9.62991 14.96 9.80991L10.4 13.8999Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17.3 11.0001L15.32 13.3901C14.92 13.8801 14.98 14.6201 15.43 15.0701L18.59 18.2301C19.13 18.7701 20.02 18.7701 20.56 18.2301L21.5 17.2901C22.04 16.7501 22.04 15.8601 21.5 15.3201L18.34 12.1601C17.89 11.7101 17.15 11.6501 16.66 12.0501L16.21 12.4201C14.94 13.2101 15.33 11.6001 16.29 10.8001C17.24 10.0001 17.98 9.96006 19.03 10.8001L21.5 13.2701" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 20H7C4 20 3 19 3 16V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Verify
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30 p-2 rounded-lg font-mono">
                      <div className="flex items-center">
                        <span className="text-slate-400 dark:text-slate-500 mr-2">ID:</span> 
                        <span>{credential.id}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="mt-5">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Create Verifiable Credential
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800 dark:text-white text-xl">Create Verifiable Credential</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-300">
                  Create a blockchain-secured identity credential that can be verified across healthcare providers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="credentialType" className="text-slate-700 dark:text-slate-200">Credential Type</Label>
                  <Select value={credentialType} onValueChange={setCredentialType}>
                    <SelectTrigger className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                      <SelectValue placeholder="Select credential type" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <SelectItem value="patientIdentity">Patient Identity</SelectItem>
                      <SelectItem value="insuranceVerification">Insurance Verification</SelectItem>
                      <SelectItem value="medicalLicense">Medical License</SelectItem>
                      <SelectItem value="pharmacyLicense">Pharmacy License</SelectItem>
                      <SelectItem value="labCertification">Laboratory Certification</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 pl-3 border-l-2 border-slate-300 dark:border-slate-600">
                    {credentialTypeDescriptions[credentialType] || "Secure your identity with blockchain technology."}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-300 dark:border-slate-600">
                  Cancel
                </Button>
                <Button
                  onClick={() => createCredential.mutate()}
                  disabled={createCredential.isPending}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                >
                  {createCredential.isPending ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>Create Credential</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
            <DialogContent className="sm:max-w-[425px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800 dark:text-white text-xl">Verify Credential</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-300">
                  Verify this credential on the blockchain for authenticity and integrity.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="credentialId" className="text-slate-700 dark:text-slate-200">Credential ID</Label>
                  <Input
                    id="credentialId"
                    value={credentialIdToVerify}
                    onChange={(e) => setCredentialIdToVerify(e.target.value)}
                    placeholder="Enter credential ID"
                    className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm"
                  />
                </div>
                
                <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-sm">
                  <div className="flex gap-3">
                    <div className="bg-blue-100 dark:bg-blue-800/50 p-1.5 rounded-full">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs leading-relaxed">
                      Verification checks the cryptographic signature on the blockchain to ensure this credential hasn't been tampered with.
                    </AlertDescription>
                  </div>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setVerifyDialogOpen(false)} className="border-slate-300 dark:border-slate-600">
                  Cancel
                </Button>
                <Button
                  onClick={() => verifyCredential.mutate()}
                  disabled={verifyCredential.isPending || !credentialIdToVerify}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                >
                  {verifyCredential.isPending ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>Verify Credential</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}