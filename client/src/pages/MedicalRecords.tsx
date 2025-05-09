import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  FileListIcon, 
  SearchIcon, 
  ShieldCheckIcon, 
  CheckboxCircleIcon,
  NotificationIcon,
  SettingsIcon
} from "@/lib/icons";

export default function MedicalRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  
  const { data: records, isLoading } = useQuery({
    queryKey: ["/api/medical-records"],
  });

  return (
    <main className="flex-1 overflow-auto p-6 md:pt-6 pt-20">
      <div className="mb-8">
        <h2 className="font-display text-xl font-medium text-neutral-800 dark:text-white mb-4">Medical Records</h2>
        
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#1A2035] dark:to-[#101626] p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-slate-700 card-glow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Input 
                type="text" 
                placeholder="Search records..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <FileListIcon className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <i className="ri-add-line mr-2"></i>
                Upload Record
              </Button>
            </div>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="lab">Lab Results</TabsTrigger>
              <TabsTrigger value="imaging">Imaging</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="reports">Medical Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-lg border dark:border-slate-700 dark:bg-[#1A2035]/40">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    
                    
                    
                    
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:bg-slate-800/50 dark:border-slate-700">
                        <TableHead className="w-[100px] dark:text-gray-300">Type</TableHead>
                        <TableHead className="dark:text-gray-300">Description</TableHead>
                        <TableHead className="dark:text-gray-300">Provider</TableHead>
                        <TableHead className="dark:text-gray-300">Date</TableHead>
                        <TableHead className="dark:text-gray-300">Status</TableHead>
                        <TableHead className="text-right dark:text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="dark:border-slate-700/50">
                        <TableCell className="dark:text-gray-300">
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 dark:border-blue-700/30">Lab Result</Badge>
                        </TableCell>
                        <TableCell className="font-medium dark:text-white">Complete Blood Count (CBC)</TableCell>
                        <TableCell className="dark:text-gray-300">Northwest Medical Center</TableCell>
                        <TableCell className="dark:text-gray-300">July 15, 2023</TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center space-x-1">
                            <CheckboxCircleIcon className="text-green-500 dark:text-emerald-400" />
                            <span className="text-sm dark:text-emerald-300">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="dark:text-blue-300 dark:hover:bg-blue-950/30">View</Button>
                          <Button variant="ghost" size="sm" className="dark:text-blue-300 dark:hover:bg-blue-950/30">Share</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="dark:border-slate-700/50">
                        <TableCell className="dark:text-gray-300">
                          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 dark:border-purple-700/30">Imaging</Badge>
                        </TableCell>
                        <TableCell className="font-medium dark:text-white">Chest X-Ray</TableCell>
                        <TableCell className="dark:text-gray-300">City Hospital</TableCell>
                        <TableCell className="dark:text-gray-300">June 22, 2023</TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center space-x-1">
                            <CheckboxCircleIcon className="text-green-500 dark:text-emerald-400" />
                            <span className="text-sm dark:text-emerald-300">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="dark:text-blue-300 dark:hover:bg-blue-950/30">View</Button>
                          <Button variant="ghost" size="sm" className="dark:text-blue-300 dark:hover:bg-blue-950/30">Share</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="dark:border-slate-700/50">
                        <TableCell className="dark:text-gray-300">
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 dark:border-green-700/30">Prescription</Badge>
                        </TableCell>
                        <TableCell className="font-medium dark:text-white">Amoxicillin 500mg</TableCell>
                        <TableCell className="dark:text-gray-300">Dr. Emily Chen</TableCell>
                        <TableCell className="dark:text-gray-300">June 15, 2023</TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center space-x-1">
                            <CheckboxCircleIcon className="text-green-500 dark:text-emerald-400" />
                            <span className="text-sm dark:text-emerald-300">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="dark:text-blue-300 dark:hover:bg-blue-950/30">View</Button>
                          <Button variant="ghost" size="sm" className="dark:text-blue-300 dark:hover:bg-blue-950/30">Share</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="dark:border-slate-700/50">
                        <TableCell className="dark:text-gray-300">
                          <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 dark:border-orange-700/30">Report</Badge>
                        </TableCell>
                        <TableCell className="font-medium dark:text-white">Annual Physical Examination</TableCell>
                        <TableCell className="dark:text-gray-300">Dr. Robert Wilson</TableCell>
                        <TableCell className="dark:text-gray-300">May 10, 2023</TableCell>
                        <TableCell className="dark:text-gray-300">
                          <div className="flex items-center space-x-1">
                            <CheckboxCircleIcon className="text-green-500 dark:text-emerald-400" />
                            <span className="text-sm dark:text-emerald-300">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="dark:text-blue-300 dark:hover:bg-blue-950/30">View</Button>
                          <Button variant="ghost" size="sm" className="dark:text-blue-300 dark:hover:bg-blue-950/30">Share</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>
              
              <div className="bg-neutral-50 dark:bg-gradient-to-r dark:from-blue-950/40 dark:to-indigo-950/40 p-3 rounded-lg border border-neutral-200 dark:border-blue-800/30 card-glow">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="text-secondary-500 dark:text-blue-400 text-lg" />
                  <p className="text-sm text-neutral-600 dark:text-gray-300">All your medical records are encrypted and verified on the Polkadot blockchain</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
