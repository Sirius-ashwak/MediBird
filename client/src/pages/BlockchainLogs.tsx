import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';

// UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Skeletons removed as requested
import { useToast } from '@/hooks/use-toast';

// Lucide icons
import {
  Shield,
  Link,
  ExternalLink,
  RefreshCw,
  Wallet,
  Database,
  Server,
  Network,
  Crosshair,
  ChevronRight,
  Copy,
  History,
  Loader2 as LoaderIcon
} from 'lucide-react';

// Custom spinner component
const Spinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
  };
  
  return (
    <LoaderIcon 
      size={sizeMap[size]} 
      className={`animate-spin text-primary ${className}`}
    />
  );
};

interface BlockchainLog {
  id: number;
  userId: number;
  operation: string;
  transactionHash: string;
  details: string;
  status: string;
  createdAt: string; // ISO string from API
}

interface BlockchainInfo {
  connected: boolean;
  chain?: string;
  nodeName?: string;
  nodeVersion?: string;
  currentBlock?: number;
  networkStatus: string;
  endpoint?: string;
  error?: string;
  simulationMode?: boolean;
}

export default function BlockchainLogs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("logs");
  
  // Query for fetching blockchain logs
  const { 
    data: logs = [] as BlockchainLog[], 
    isLoading: logsLoading, 
    isError: logsError,
    refetch: refetchLogs
  } = useQuery<BlockchainLog[]>({
    queryKey: ['/api/blockchain/logs'],
    enabled: !!user,
  });
  
  // Query for fetching blockchain info
  const { 
    data: blockchainInfo, 
    isLoading: infoLoading, 
    isError: infoError,
    refetch: refetchInfo
  } = useQuery<BlockchainInfo>({
    queryKey: ['/api/blockchain/info'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Mutation for creating a new wallet
  const createWalletMutation = useMutation({
    mutationFn: () => {
      return apiRequest<{ address: string; created: boolean; timestamp: string }>('/api/blockchain/wallet', {
        method: 'POST'
      });
    },
    onSuccess: (data) => {
      console.log('Wallet creation successful:', data);
      toast({
        title: "Wallet Created",
        description: `Your new Polkadot wallet has been created with address: ${truncateHash(data.address)}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blockchain/logs'] });
    },
    onError: (error) => {
      console.error('Wallet creation failed:', error);
      toast({
        title: "Error Creating Wallet",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Helper function to truncate hash values for display
  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return hash.length > 16 ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : hash;
  };
  
  // Format date for better readability
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };
  
  // Handle refresh button clicks
  const handleRefresh = () => {
    refetchLogs();
    refetchInfo();
    toast({
      title: "Refreshing Data",
      description: "Fetching the latest blockchain data...",
    });
  };
  
  // Handle create wallet button clicks
  const handleCreateWallet = () => {
    createWalletMutation.mutate();
  };
  
  // Display a status badge based on blockchain connection status
  const renderNetworkStatus = (info?: BlockchainInfo) => {
    if (!info) return <Badge variant="outline">Unknown</Badge>;
    
    if (info.connected) {
      return <Badge className="bg-green-500">Connected</Badge>;
    } else if (info.simulationMode) {
      return <Badge className="bg-yellow-500">Simulation Mode</Badge>;
    } else {
      return <Badge className="bg-red-500">Disconnected</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Verification</h1>
          <p className="text-gray-500">View and verify your medical data on Polkadot blockchain</p>
        </div>
        <Button onClick={handleRefresh} disabled={logsLoading || infoLoading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="logs" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="logs">Transaction Logs</TabsTrigger>
          <TabsTrigger value="network">Network Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs" className="space-y-6">
          {blockchainInfo?.simulationMode && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <div className="flex items-center">
                <Crosshair className="h-4 w-4 mr-2 text-yellow-600" />
                <AlertTitle>Simulation Mode Active</AlertTitle>
              </div>
              <AlertDescription>
                The application is currently running in simulation mode. No real blockchain transactions are being processed.
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Blockchain Transaction History
              </CardTitle>
              <CardDescription>
                View all your medical records and consent operations verified on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center p-8">
                  <Spinner size="lg" />
                </div>
              ) : logsError ? (
                <Alert variant="destructive">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    <AlertTitle>Error Loading Data</AlertTitle>
                  </div>
                  <AlertDescription>
                    There was a problem loading your blockchain logs. Please try again.
                  </AlertDescription>
                </Alert>
              ) : logs && logs.length > 0 ? (
                <Table>
                  <TableCaption>A list of your blockchain transactions</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operation</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log: BlockchainLog) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.operation}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center">
                            {truncateHash(log.transactionHash)}
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" asChild>
                              <a href={`https://westend.subscan.io/block/${log.transactionHash}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              log.status === "completed" 
                                ? "bg-green-500" 
                                : log.status === "pending" 
                                ? "bg-yellow-500" 
                                : "bg-red-500"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(log.createdAt)}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-8 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">No blockchain transactions found.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create a wallet or verify a medical record to see transactions here.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                onClick={handleCreateWallet} 
                disabled={createWalletMutation.isPending}
                className="flex items-center"
              >
                {createWalletMutation.isPending ? <Spinner className="mr-2" /> : <Wallet className="mr-2 h-4 w-4" />}
                Create Polkadot Wallet
              </Button>
              <Button variant="outline" onClick={() => refetchLogs()} className="flex items-center">
                <History className="mr-2 h-4 w-4" />
                Refresh Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="mr-2 h-5 w-5" />
                Polkadot Network Status
              </CardTitle>
              <CardDescription>
                Current information about the connected blockchain network
              </CardDescription>
            </CardHeader>
            <CardContent>
              {infoLoading ? (
                <div className="flex justify-center p-8">
                  <Spinner size="lg" />
                </div>
              ) : infoError ? (
                <Alert variant="destructive">
                  <div className="flex items-center">
                    <Server className="h-4 w-4 mr-2" />
                    <AlertTitle>Error Loading Network Info</AlertTitle>
                  </div>
                  <AlertDescription>
                    There was a problem connecting to the blockchain network.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500">Network Status</h3>
                      <div className="mt-2 flex items-center">
                        {renderNetworkStatus(blockchainInfo)}
                        <span className="ml-2 text-lg font-medium">
                          {blockchainInfo?.simulationMode 
                            ? "Simulation Mode" 
                            : blockchainInfo?.connected 
                            ? "Connected" 
                            : "Disconnected"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500">Network</h3>
                      <p className="mt-2 text-lg font-medium">
                        {blockchainInfo?.chain || "Unknown"}
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500">Node Version</h3>
                      <p className="mt-2 text-lg font-medium">
                        {blockchainInfo?.nodeName 
                          ? `${blockchainInfo.nodeName} v${blockchainInfo.nodeVersion}` 
                          : "Unknown"}
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500">Latest Block</h3>
                      <p className="mt-2 text-lg font-medium">
                        {blockchainInfo?.currentBlock !== undefined 
                          ? `#${blockchainInfo.currentBlock}` 
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                  
                  {blockchainInfo?.endpoint && (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500">Endpoint</h3>
                      <p className="mt-2 font-mono text-sm">
                        {blockchainInfo.endpoint}
                      </p>
                    </div>
                  )}
                  
                  {blockchainInfo?.error && (
                    <Alert variant="destructive">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2" />
                        <AlertTitle>Connection Error</AlertTitle>
                      </div>
                      <AlertDescription>
                        {blockchainInfo.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => refetchInfo()} className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Network Status
              </Button>
            </CardFooter>
          </Card>
          
          {blockchainInfo?.connected && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="mr-2 h-5 w-5" />
                  Polkadot Explorer Links
                </CardTitle>
                <CardDescription>
                  Explore more details about the Polkadot blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <a 
                      href="https://westend.subscan.io/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Westend Subscan Explorer
                    </a>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <a 
                      href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwestend-rpc.polkadot.io#/explorer" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Polkadot.js Apps Explorer
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}