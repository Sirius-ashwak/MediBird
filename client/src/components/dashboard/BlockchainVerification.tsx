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
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg relative bg-white dark:bg-slate-800">
      {/* Subtle blockchain pattern background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgNEMxMi45NTMgNCAwIDE2Ljk1MyAwIDI4YzAgMTEuMDQ3IDEyLjk1MyAyNCAyNCAyNHMyNC0xMi45NTMgMjQtMjRDNDggMTYuOTUzIDM1LjA0NyA0IDI0IDR6bTAgNDBjLTguODMgMC0xNi03LjE3LTE2LTE2czctMTYgMTYtMTZjOC44MzcgMCAxNiA3LjE3IDE2IDE2cy03LjE2MyAxNi0xNiAxNnptOC0yMmgtMnY2aC02di0yaC00djJoLTZ2LTZoLTJ2MTBoMnYtMmgxNnYyaDJ2LTEweiIgZmlsbD0iIzMzMyIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')]">
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex-shrink-0 flex items-center justify-center shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M22 11V9L12 5L2 9L12 13L22 9.00001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 10.9999V15.9999C6 15.9999 9 18.9999 12 18.9999C15 18.9999 18 15.9999 18 15.9999V10.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <CardTitle className="text-lg font-display tracking-tight text-slate-800 dark:text-white">Blockchain Verification Log</CardTitle>
        </div>
        <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
          <div className="h-2 w-2 bg-pink-500 rounded-full animate-pulse"></div>
          <span>Polkadot Network</span>
        </Badge>
      </CardHeader>
      
      <CardContent className="p-5 relative z-10">
        <div className="overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 mb-5 rounded-xl border border-green-200 dark:border-green-800/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                  <CheckboxCircleIcon className="text-green-600 dark:text-green-400" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">All records verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Last check: 10 minutes ago</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 pl-11">
              Your medical data integrity is continuously verified on the blockchain to ensure it hasn't been tampered with.
            </p>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-green-500 animate-spin"></div>
                  <div className="h-8 w-8 rounded-full border-t-2 border-b-2 border-green-300 animate-spin absolute top-2 left-2"></div>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                    <TableHead className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Record ID</TableHead>
                    <TableHead className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</TableHead>
                    <TableHead className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</TableHead>
                    <TableHead className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                  <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <TableCell className="py-3 px-4 whitespace-nowrap font-mono text-xs text-slate-700 dark:text-slate-300">0x72F9...34B2</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">Medical Report</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">Today, 09:45 AM</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="outline" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                        <div className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-500"></div>
                        Verified
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <TableCell className="py-3 px-4 whitespace-nowrap font-mono text-xs text-slate-700 dark:text-slate-300">0x58A1...2FD7</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">Prescription</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">Yesterday, 03:12 PM</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="outline" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                        <div className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-500"></div>
                        Verified
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <TableCell className="py-3 px-4 whitespace-nowrap font-mono text-xs text-slate-700 dark:text-slate-300">0x31C7...9AF4</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">Lab Results</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">Jul 15, 2023, 11:30 AM</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="outline" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                        <div className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-500"></div>
                        Verified
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
