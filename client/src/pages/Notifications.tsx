import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  NotificationIcon, 
  LockIcon, 
  SecurityIcon, 
  UserVoiceIcon, 
  FileListIcon, 
  HospitalIcon, 
  ShieldCheckIcon 
} from "@/lib/icons";
import { format, formatDistanceToNow } from "date-fns";

// Define notification interfaces
interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  provider?: {
    id: number;
    name: string;
    image?: string;
  };
  metadata?: Record<string, any>;
}

export default function Notifications() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  // Mock notifications data - in a real app, this would come from an API
  const { data: notifications = [], isLoading, isError } = useQuery({
    queryKey: ["/api/notifications"],
    // Mock data for demonstration
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: 1,
          type: "consent",
          title: "Access Request",
          message: "Dr. Emily Chen requested access to your medical records",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          read: false,
          provider: {
            id: 2,
            name: "Dr. Emily Chen",
          },
          actionUrl: "/consent",
          metadata: {
            requestId: "req-123",
            dataTypes: ["Medical history", "Lab results"]
          }
        },
        {
          id: 2,
          type: "record",
          title: "New Medical Record",
          message: "Northwest Medical Center added a new lab result to your records",
          timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
          read: false,
          provider: {
            id: 1,
            name: "Northwest Medical Center",
          },
          actionUrl: "/records",
          metadata: {
            recordId: "rec-456",
            recordType: "Lab Result"
          }
        },
        {
          id: 3,
          type: "security",
          title: "New Device Login",
          message: "Your account was accessed from a new device in Seattle, WA",
          timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
          read: true,
          actionUrl: "/settings",
          metadata: {
            deviceType: "iPhone",
            location: "Seattle, WA",
            ipAddress: "192.168.1.1"
          }
        },
        {
          id: 4,
          type: "ai",
          title: "AI Consultation Update",
          message: "Your recent health query has been analyzed and recommendations are ready",
          timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
          read: true,
          actionUrl: "/consultations",
          metadata: {
            consultationId: "ai-789",
            topic: "Sleep patterns"
          }
        },
        {
          id: 5,
          type: "blockchain",
          title: "Blockchain Verification",
          message: "Your medical record has been verified on the blockchain",
          timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), // 3 days ago
          read: true,
          actionUrl: "/transactions",
          metadata: {
            transactionHash: "0x1234...5678",
            recordId: "rec-789",
            blockNumber: 12345
          }
        }
      ] as Notification[];
    },
    // This is just for demonstration - in a real app with a real API
    // we wouldn't need to mock this data
    select: (data) => data
  });

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: (id) => {
      // Update the local cache
      queryClient.setQueryData(["/api/notifications"], (oldData: Notification[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        );
      });
    }
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    },
    onSuccess: () => {
      // Update the local cache
      queryClient.setQueryData(["/api/notifications"], (oldData: Notification[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(notification => ({ ...notification, read: true }));
      });
      
      toast({
        title: "All notifications marked as read",
      });
    }
  });

  // Handle clicking on a notification
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }
    
    // In a real app, we would navigate to the action URL
    window.location.href = notification.actionUrl || "#";
  };

  // Function to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "consent":
        return <LockIcon className="h-5 w-5 text-secondary-600" />;
      case "record":
        return <FileListIcon className="h-5 w-5 text-green-600" />;
      case "security":
        return <SecurityIcon className="h-5 w-5 text-red-600" />;
      case "ai":
        return <UserVoiceIcon className="h-5 w-5 text-indigo-600" />;
      case "blockchain":
        return <ShieldCheckIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <NotificationIcon className="h-5 w-5 text-neutral-600" />;
    }
  };

  // Calculate unread counts for badge display
  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadCountByType = {
    consent: notifications.filter(n => n.type === "consent" && !n.read).length,
    record: notifications.filter(n => n.type === "record" && !n.read).length,
    security: notifications.filter(n => n.type === "security" && !n.read).length,
    ai: notifications.filter(n => n.type === "ai" && !n.read).length,
    blockchain: notifications.filter(n => n.type === "blockchain" && !n.read).length
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-semibold text-neutral-800">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-secondary-100 text-secondary-800">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => markAllAsReadMutation.mutate()}
          disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
        >
          Mark all as read
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="grid grid-cols-6 gap-2">
          <TabsTrigger value="all" className="relative">
            All
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="consent" className="relative">
            Access
            {unreadCountByType.consent > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[10px] text-white">
                {unreadCountByType.consent}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="record">Records</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg flex items-center space-x-2">
                <NotificationIcon className="h-5 w-5 text-neutral-600" />
                <span>{activeTab === "all" ? "All Notifications" : 
                       activeTab === "unread" ? "Unread Notifications" : 
                       `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications`}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-0">
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"></div>
                  <p className="mt-2 text-neutral-600">Loading notifications...</p>
                </div>
              ) : isError ? (
                <div className="py-8 text-center">
                  <p className="text-red-600">Error loading notifications. Please try again.</p>
                  <Button variant="outline" className="mt-2" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/notifications"] })}>
                    Retry
                  </Button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto">
                    <NotificationIcon className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-neutral-700">No notifications</h3>
                  <p className="mt-1 text-neutral-500">
                    {activeTab === "unread" 
                      ? "You've read all your notifications" 
                      : "You don't have any notifications yet"}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {filteredNotifications.map((notification) => (
                    <li 
                      key={notification.id}
                      className={`py-4 cursor-pointer hover:bg-neutral-50 transition-colors ${!notification.read ? 'bg-blue-50/40' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.read ? 'bg-blue-100' : 'bg-neutral-100'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                              {notification.title}
                            </p>
                            <span className="text-xs text-neutral-500">
                              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className={`text-sm ${!notification.read ? 'text-neutral-700' : 'text-neutral-600'}`}>
                            {notification.message}
                          </p>
                          {notification.provider && (
                            <div className="mt-2 flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback className="text-xs">
                                  {notification.provider.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-neutral-500">{notification.provider.name}</span>
                            </div>
                          )}
                          {!notification.read && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                                New
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <p className="text-neutral-600 mb-4">
            Customize your notification settings to control which notifications you receive and how they're delivered.
          </p>
          <Button variant="outline" onClick={() => window.location.href = "/settings?tab=notifications"}>
            Manage Notification Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}