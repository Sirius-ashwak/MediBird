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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Cross-Provider Identity</CardTitle>
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 px-2 py-1 flex items-center gap-1">
          <Shield size={14} />
          <span>Blockchain Verified</span>
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
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 text-sm">
                  Verifiable credentials let you securely share your identity across healthcare providers with zero-knowledge proofs.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                {credentials?.map((credential: any) => (
                  <div key={credential.id} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Key size={18} />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h4 className="font-medium text-neutral-800">
                              {credentialTypeLabels[credential.type] || credential.type}
                            </h4>
                            {credential.verified && (
                              <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 px-1.5 py-0.5">
                                <Check size={10} className="mr-1" />
                                <span className="text-[10px]">Verified</span>
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-neutral-500">
                              Created {new Date(credential.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setCredentialIdToVerify(credential.id);
                            setVerifyDialogOpen(true);
                          }}
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-neutral-600">
                      <p>Credential ID: {credential.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                Create Verifiable Credential
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Verifiable Credential</DialogTitle>
                <DialogDescription>
                  Create a blockchain-secured identity credential that can be verified across healthcare providers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="credentialType">Credential Type</Label>
                  <Select value={credentialType} onValueChange={setCredentialType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select credential type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patientIdentity">Patient Identity</SelectItem>
                      <SelectItem value="insuranceVerification">Insurance Verification</SelectItem>
                      <SelectItem value="medicalLicense">Medical License</SelectItem>
                      <SelectItem value="pharmacyLicense">Pharmacy License</SelectItem>
                      <SelectItem value="labCertification">Laboratory Certification</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-neutral-500 mt-1">
                    {credentialTypeDescriptions[credentialType] || "Secure your identity with blockchain technology."}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => createCredential.mutate()}
                  disabled={createCredential.isPending}
                >
                  {createCredential.isPending ? <Spinner size="sm" className="mr-2" /> : null}
                  Create Credential
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Verify Credential</DialogTitle>
                <DialogDescription>
                  Verify this credential on the blockchain.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="credentialId">Credential ID</Label>
                  <Input
                    id="credentialId"
                    value={credentialIdToVerify}
                    onChange={(e) => setCredentialIdToVerify(e.target.value)}
                    placeholder="Enter credential ID"
                  />
                </div>
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700 text-xs">
                    Verification checks the cryptographic signature on the blockchain to ensure this credential hasn't been tampered with.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => verifyCredential.mutate()}
                  disabled={verifyCredential.isPending || !credentialIdToVerify}
                >
                  {verifyCredential.isPending ? <Spinner size="sm" className="mr-2" /> : null}
                  Verify Credential
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}