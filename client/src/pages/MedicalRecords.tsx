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
        <h2 className="font-display text-xl font-medium text-neutral-800 mb-4">Medical Records</h2>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200">
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
              <div className="rounded-lg border">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    
                    
                    
                    
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">Lab Result</Badge>
                        </TableCell>
                        <TableCell className="font-medium">Complete Blood Count (CBC)</TableCell>
                        <TableCell>Northwest Medical Center</TableCell>
                        <TableCell>July 15, 2023</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CheckboxCircleIcon className="text-green-500" />
                            <span className="text-sm">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Share</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">Imaging</Badge>
                        </TableCell>
                        <TableCell className="font-medium">Chest X-Ray</TableCell>
                        <TableCell>City Hospital</TableCell>
                        <TableCell>June 22, 2023</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CheckboxCircleIcon className="text-green-500" />
                            <span className="text-sm">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Share</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Prescription</Badge>
                        </TableCell>
                        <TableCell className="font-medium">Amoxicillin 500mg</TableCell>
                        <TableCell>Dr. Emily Chen</TableCell>
                        <TableCell>June 15, 2023</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CheckboxCircleIcon className="text-green-500" />
                            <span className="text-sm">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Share</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">Report</Badge>
                        </TableCell>
                        <TableCell className="font-medium">Annual Physical Examination</TableCell>
                        <TableCell>Dr. Robert Wilson</TableCell>
                        <TableCell>May 10, 2023</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CheckboxCircleIcon className="text-green-500" />
                            <span className="text-sm">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Share</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>
              
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="text-secondary-500 text-lg" />
                  <p className="text-sm text-neutral-600">All your medical records are encrypted and verified on the Polkadot blockchain</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
