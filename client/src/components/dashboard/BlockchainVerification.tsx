import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

import { CheckboxCircleIcon } from "@/lib/icons";

export default function BlockchainVerification() {
  const { data: verificationLogs, isLoading } = useQuery({
    queryKey: ["/api/blockchain/logs"],
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Blockchain Verification Log</CardTitle>
        <Badge variant="outline" className="bg-neutral-100 text-neutral-700 px-2 py-1 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span>Polkadot Network</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <div className="bg-neutral-50 p-3 mb-3 rounded-lg border border-neutral-200">
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
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-2">
                
                
                
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50">
                    <TableHead className="py-2 px-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Record ID</TableHead>
                    <TableHead className="py-2 px-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</TableHead>
                    <TableHead className="py-2 px-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Timestamp</TableHead>
                    <TableHead className="py-2 px-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-neutral-200">
                  <TableRow>
                    <TableCell className="py-2 px-3 whitespace-nowrap font-mono text-xs">0x72F9...34B2</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">Medical Report</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">Today, 09:45 AM</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">
                      <Badge variant="outline" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckboxCircleIcon className="mr-1" />Verified
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2 px-3 whitespace-nowrap font-mono text-xs">0x58A1...2FD7</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">Prescription</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">Yesterday, 03:12 PM</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">
                      <Badge variant="outline" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckboxCircleIcon className="mr-1" />Verified
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-2 px-3 whitespace-nowrap font-mono text-xs">0x31C7...9AF4</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">Lab Results</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">Jul 15, 2023, 11:30 AM</TableCell>
                    <TableCell className="py-2 px-3 whitespace-nowrap">
                      <Badge variant="outline" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckboxCircleIcon className="mr-1" />Verified
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
