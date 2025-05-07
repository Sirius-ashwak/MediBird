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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ExchangeIcon, 
  CheckboxCircleIcon, 
  ShieldCheckIcon 
} from "@/lib/icons";
import { BlockchainLog } from "@shared/schema";

export default function BlockchainLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState<BlockchainLog | null>(null);
  
  const { data: logs, isLoading } = useQuery({
    queryKey: ["/api/blockchain/logs"],
  });

  const handleViewDetails = (log: BlockchainLog) => {
    setSelectedLog(log);
    setDetailsDialog(true);
  };
  
  const filteredLogs = logs?.filter((log: BlockchainLog) => {
    if (!searchQuery) return true;
    
    return (
      log.recordType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.transactionHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Filter logs by type for tabs
  const getLogsByType = (type: string) => {
    if (type === "all") return filteredLogs;
    return filteredLogs?.filter(
      (log: BlockchainLog) => log.recordType === type
    );
  };

  // Format hash for display
  const formatHash = (hash: string) => {
    if (hash.length <= 12) return hash;
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <main className="flex-1 overflow-auto p-6 md:pt-6 pt-20">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="font-display text-xl font-medium text-neutral-800">Blockchain Verification Logs</h2>
          <div className="mt-2 md:mt-0">
            <Badge variant="outline" className="bg-neutral-100 text-neutral-700 px-2 py-1 flex items-center gap-1">
              <i className="ri-link text-neutral-700"></i>
              <span>Polkadot Network</span>
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Transaction Logs</CardTitle>
              <div className="relative w-full md:w-64">
                <Input 
                  type="text" 
                  placeholder="Search transactions..." 
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
                  <TabsTrigger value="all">All Records</TabsTrigger>
                  <TabsTrigger value="medical_record">Medical Records</TabsTrigger>
                  <TabsTrigger value="consent">Consent Records</TabsTrigger>
                  <TabsTrigger value="provider">Provider Verifications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {renderTransactionTable(getLogsByType("all"), isLoading, handleViewDetails, formatHash, formatTimestamp)}
                </TabsContent>
                
                <TabsContent value="medical_record">
                  {renderTransactionTable(getLogsByType("medical_record"), isLoading, handleViewDetails, formatHash, formatTimestamp)}
                </TabsContent>
                
                <TabsContent value="consent">
                  {renderTransactionTable(getLogsByType("consent"), isLoading, handleViewDetails, formatHash, formatTimestamp)}
                </TabsContent>
                
                <TabsContent value="provider">
                  {renderTransactionTable(getLogsByType("provider"), isLoading, handleViewDetails, formatHash, formatTimestamp)}
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="bg-neutral-50 p-3 mt-4 rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckboxCircleIcon className="text-secondary-500 text-lg" />
                  <span className="font-medium text-sm">All records verified</span>
                </div>
                <span className="text-xs text-neutral-500">Last check: 10 minutes ago</span>
              </div>
              <p className="text-xs text-neutral-600">
                Your medical data integrity is continuously verified on the blockchain to ensure it hasn't been tampered with.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Blockchain Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-neutral-600">
                  MediBridge leverages Polkadot's blockchain technology to create a secure, transparent, and immutable record of all healthcare transactions. Every interaction with your medical data is verified and recorded on the blockchain.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-lock-line text-blue-600"></i>
                    </div>
                    <h3 className="font-medium text-lg">Security</h3>
                    <p className="text-sm text-neutral-600">Tamper-proof records</p>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-eye-off-line text-purple-600"></i>
                    </div>
                    <h3 className="font-medium text-lg">Privacy</h3>
                    <p className="text-sm text-neutral-600">Zero-Knowledge Proofs</p>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-group-line text-green-600"></i>
                    </div>
                    <h3 className="font-medium text-lg">Consensus</h3>
                    <p className="text-sm text-neutral-600">Distributed validation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500">Total Transactions</p>
                    <p className="text-xl font-medium">152</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-exchange-line text-blue-600"></i>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500">Verified Records</p>
                    <p className="text-xl font-medium">37</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-file-list-3-line text-green-600"></i>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-500">Network Status</p>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <p className="font-medium">Connected</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="ri-pulse-line text-purple-600"></i>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" className="text-primary-600 border-primary-200">
                    <i className="ri-refresh-line mr-2"></i>
                    Sync with Blockchain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Transaction Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Blockchain verification information
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Transaction Hash</h3>
                <p className="font-mono text-sm break-all">{selectedLog?.transactionHash}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Record Type</h3>
                  <p className="text-sm capitalize">{selectedLog?.recordType.replace('_', ' ')}</p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Status</h3>
                  <Badge variant="outline" className={`
                    ${selectedLog?.status === 'verified' ? 'bg-green-100 text-green-800' : 
                      selectedLog?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    <CheckboxCircleIcon className="mr-1" />
                    {selectedLog?.status}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Timestamp</h3>
                <p className="text-sm">
                  {selectedLog?.timestamp ? formatTimestamp(selectedLog?.timestamp) : ''}
                </p>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h3 className="text-sm font-medium text-neutral-500 mb-1">Record Details</h3>
                <pre className="text-xs overflow-auto p-2 bg-neutral-100 rounded max-h-32">
                  {selectedLog?.details ? JSON.stringify(selectedLog.details, null, 2) : '{}'}
                </pre>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialog(false)}>
              Close
            </Button>
            <Button>
              Verify Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function renderTransactionTable(
  logs: BlockchainLog[] | undefined, 
  isLoading: boolean, 
  onViewDetails: (log: BlockchainLog) => void,
  formatHash: (hash: string) => string,
  formatTimestamp: (timestamp: Date) => string
) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8">
        <ExchangeIcon className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-800 mb-1">No transactions found</h3>
        <p className="text-neutral-500">Try adjusting your search or filters</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction Hash</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-mono text-xs">{formatHash(log.transactionHash)}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {log.recordType.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
            <TableCell>
              <Badge variant="outline" className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                ${log.status === 'verified' ? 'bg-green-100 text-green-800' : 
                  log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}>
                <CheckboxCircleIcon className="mr-1" />{log.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(log)}>
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
