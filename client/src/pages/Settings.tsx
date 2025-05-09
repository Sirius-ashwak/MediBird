import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ShieldCheckIcon, LockIcon, NotificationIcon, PrivacyIcon, SecurityIcon, UserIcon, UserCircleIcon, UploadIcon, TrashIcon } from "@/lib/icons";

// Schema for profile settings
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Schema for notification settings
const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  appNotifications: z.boolean().default(true),
  consentAlerts: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
  healthUpdates: z.boolean().default(true),
});

// Schema for privacy settings
const privacyFormSchema = z.object({
  dataSharing: z.enum(["minimal", "standard", "comprehensive"]),
  anonymizedDataForResearch: z.boolean().default(false),
  blockchainVerification: z.boolean().default(true),
});

// Schema for security settings
const securityFormSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  biometricLogin: z.boolean().default(false),
  sessionTimeout: z.enum(["15", "30", "60", "never"]),
});

export default function Settings() {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Notification form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      appNotifications: true,
      consentAlerts: true,
      securityAlerts: true,
      healthUpdates: true,
    },
  });

  // Privacy form
  const privacyForm = useForm<z.infer<typeof privacyFormSchema>>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      dataSharing: "standard",
      anonymizedDataForResearch: false,
      blockchainVerification: true,
    },
  });

  // Security form
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorAuth: false,
      biometricLogin: false,
      sessionTimeout: "30",
    },
  });

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof profileFormSchema>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return values;
    },
    onSuccess: (data) => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      // Only update if user exists
      if (user) {
        // Create a properly typed updated user object
        const updatedUser = {
          id: user.id,
          username: user.username,
          password: user.password,
          name: data.name,
          email: data.email,
          walletId: user.walletId,
          profileImage: user.profileImage,
          role: user.role,
          createdAt: user.createdAt
        };
        
        updateUser(updatedUser);
      }
    },
  });

  // Notification settings mutation
  const notificationMutation = useMutation({
    mutationFn: async (values: z.infer<typeof notificationFormSchema>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    },
  });

  // Privacy settings mutation
  const privacyMutation = useMutation({
    mutationFn: async (values: z.infer<typeof privacyFormSchema>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    },
  });

  // Security settings mutation
  const securityMutation = useMutation({
    mutationFn: async (values: z.infer<typeof securityFormSchema>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Security settings updated",
        description: "Your security preferences have been saved.",
      });
    },
  });

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    profileMutation.mutate(values);
  }

  function onNotificationSubmit(values: z.infer<typeof notificationFormSchema>) {
    notificationMutation.mutate(values);
  }

  function onPrivacySubmit(values: z.infer<typeof privacyFormSchema>) {
    privacyMutation.mutate(values);
  }

  function onSecuritySubmit(values: z.infer<typeof securityFormSchema>) {
    securityMutation.mutate(values);
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800">Settings</h1>
        </div>

        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-8"
        >
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-white p-1 shadow-sm border border-gray-200">
            <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-2.5 rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 px-4 py-2.5 rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
              <NotificationIcon className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 px-4 py-2.5 rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
              <PrivacyIcon className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 px-4 py-2.5 rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700">
              <SecurityIcon className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-sm border border-gray-200 overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-neutral-800">
                <UserCircleIcon className="h-5 w-5 text-primary-600" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-neutral-600">
                Update your personal information and how it appears on your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-gray-100">
                <Avatar className="w-24 h-24 rounded-lg border-2 border-white shadow-md">
                  <AvatarImage src={user?.profileImage || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="text-xl bg-primary-100 text-primary-700">{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-medium text-neutral-800">{user?.name || "Your Name"}</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-md border-gray-300 hover:bg-gray-50">
                      <UploadIcon className="h-4 w-4 mr-1.5" /> Change Avatar
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-md text-red-600 hover:bg-red-50 hover:text-red-700">
                      <TrashIcon className="h-4 w-4 mr-1.5" /> Remove
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700">Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-primary-50 border border-primary-100 text-primary-800">
                    <ShieldCheckIcon className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                    <p className="text-sm">
                      Your profile information is securely stored and blockchain-verified
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button 
                      type="submit" 
                      disabled={profileMutation.isPending}
                      className="px-6 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium"
                    >
                      {profileMutation.isPending && <Spinner size="sm" className="mr-2" />}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200 overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-neutral-800">
                <ShieldCheckIcon className="h-5 w-5 text-secondary-600" />
                Blockchain Wallet
              </CardTitle>
              <CardDescription className="text-neutral-600">
                Your decentralized identity on the Polkadot network
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-100 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center shadow-sm">
                    <ShieldCheckIcon className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Wallet ID</p>
                    <p className="text-sm text-neutral-600 font-mono mt-1">
                      {user?.walletId ? 
                        `${user.walletId.substring(0, 12)}...${user.walletId.substring(user.walletId.length - 8)}` 
                        : "No Wallet ID"
                      }
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-md border-gray-300 hover:bg-gray-50">
                  <span className="mr-1.5">Copy</span>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <Button variant="outline" className="rounded-md border-gray-300 hover:bg-gray-50 flex items-center justify-center">
                  <span>Regenerate Wallet</span>
                </Button>
                <Button variant="outline" className="rounded-md border-secondary-200 bg-secondary-50 text-secondary-700 hover:bg-secondary-100 flex items-center justify-center">
                  <LockIcon className="h-4 w-4 mr-1.5" /> 
                  <span>Export Keys</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm border border-gray-200 overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-neutral-800">
                <NotificationIcon className="h-5 w-5 text-primary-600" />
                Notification Settings
              </CardTitle>
              <CardDescription className="text-neutral-600">
                Configure how and when you receive notifications about your healthcare data.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="grid gap-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">Email Notifications</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Receive email notifications about important updates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="appNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">App Notifications</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Receive in-app notifications and alerts
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="consentAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">Consent Alerts</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Get notified when a provider requests access to your data
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="securityAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">Security Alerts</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Be alerted about important security events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="healthUpdates"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">Health Updates</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Receive notifications about your health records
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 mt-6">
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={notificationMutation.isPending}
                        className="px-6 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium"
                      >
                        {notificationMutation.isPending && <Spinner size="sm" className="mr-2" />}
                        Save Notification Settings
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="shadow-sm border border-gray-200 overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-neutral-800">
                <PrivacyIcon className="h-5 w-5 text-primary-600" />
                Privacy Settings
              </CardTitle>
              <CardDescription className="text-neutral-600">
                Control how your data is shared and used across the MediBridge platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...privacyForm}>
                <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <FormField
                      control={privacyForm.control}
                      name="dataSharing"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div>
                            <FormLabel className="text-base font-medium text-neutral-800">Data Sharing Level</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Choose how much of your health data can be shared with providers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid gap-3"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 bg-white">
                                <FormControl>
                                  <RadioGroupItem value="minimal" className="text-primary-600" />
                                </FormControl>
                                <div className="space-y-1 flex-1">
                                  <FormLabel className="font-medium text-neutral-800">
                                    Minimal
                                  </FormLabel>
                                  <FormDescription className="text-neutral-600">
                                    Share only essential information with healthcare providers
                                  </FormDescription>
                                </div>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 bg-white">
                                <FormControl>
                                  <RadioGroupItem value="standard" className="text-primary-600" />
                                </FormControl>
                                <div className="space-y-1 flex-1">
                                  <FormLabel className="font-medium text-neutral-800">
                                    Standard
                                  </FormLabel>
                                  <FormDescription className="text-neutral-600">
                                    Balanced data sharing with your regular providers
                                  </FormDescription>
                                </div>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 bg-white">
                                <FormControl>
                                  <RadioGroupItem value="comprehensive" className="text-primary-600" />
                                </FormControl>
                                <div className="space-y-1 flex-1">
                                  <FormLabel className="font-medium text-neutral-800">
                                    Comprehensive
                                  </FormLabel>
                                  <FormDescription className="text-neutral-600">
                                    Share detailed health information with all approved providers
                                  </FormDescription>
                                </div>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={privacyForm.control}
                      name="anonymizedDataForResearch"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">Research Contribution</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Allow anonymized data to be used for medical research
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={privacyForm.control}
                      name="blockchainVerification"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">Blockchain Verification</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Enable blockchain verification for enhanced security
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 mt-4 bg-blue-50 rounded-lg border border-blue-100">
                    <LockIcon className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-700">
                      Your privacy settings are protected and enforced with blockchain contracts
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 mt-6">
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={privacyMutation.isPending}
                        className="px-6 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium"
                      >
                        {privacyMutation.isPending && <Spinner size="sm" className="mr-2" />}
                        Save Privacy Settings
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-sm border border-gray-200 overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-neutral-800">
                <SecurityIcon className="h-5 w-5 text-primary-600" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-neutral-600">
                Configure security options to protect your healthcare data.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="twoFactorAuth"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">Two-Factor Authentication</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Add an extra layer of security to your account
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="biometricLogin"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium text-neutral-800">Biometric Authentication</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Use fingerprint or face recognition for login
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div>
                            <FormLabel className="text-base font-medium text-neutral-800">Session Timeout</FormLabel>
                            <FormDescription className="text-neutral-600">
                              Configure how long until your session expires due to inactivity
                            </FormDescription>
                          </div>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid gap-3"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 bg-white">
                                <FormControl>
                                  <RadioGroupItem value="15" className="text-primary-600" />
                                </FormControl>
                                <div className="space-y-1 flex-1">
                                  <FormLabel className="font-medium text-neutral-800">
                                    15 minutes
                                  </FormLabel>
                                  <FormDescription className="text-neutral-600">
                                    Recommended for high security (HIPAA compliant)
                                  </FormDescription>
                                </div>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 bg-white">
                                <FormControl>
                                  <RadioGroupItem value="30" className="text-primary-600" />
                                </FormControl>
                                <div className="space-y-1 flex-1">
                                  <FormLabel className="font-medium text-neutral-800">
                                    30 minutes
                                  </FormLabel>
                                  <FormDescription className="text-neutral-600">
                                    Standard security timeout
                                  </FormDescription>
                                </div>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 bg-white">
                                <FormControl>
                                  <RadioGroupItem value="60" className="text-primary-600" />
                                </FormControl>
                                <div className="space-y-1 flex-1">
                                  <FormLabel className="font-medium text-neutral-800">
                                    60 minutes
                                  </FormLabel>
                                  <FormDescription className="text-neutral-600">
                                    Extended session length
                                  </FormDescription>
                                </div>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-gray-200 p-4 bg-white">
                                <FormControl>
                                  <RadioGroupItem value="never" className="text-primary-600" />
                                </FormControl>
                                <div className="space-y-1 flex-1">
                                  <FormLabel className="font-medium text-neutral-800">
                                    Never
                                  </FormLabel>
                                  <FormDescription className="text-neutral-600">
                                    Not recommended for sensitive health data
                                  </FormDescription>
                                </div>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center space-x-3 p-4 mt-4 bg-green-50 rounded-lg border border-green-100">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-green-700">
                      Your account is protected with advanced security measures
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 mt-6">
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        type="button"
                        className="border-gray-300 hover:bg-gray-50 text-neutral-700"
                      >
                        Change Password
                      </Button>
                      
                      <Button 
                        type="submit" 
                        disabled={securityMutation.isPending}
                        className="px-6 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-medium"
                      >
                        {securityMutation.isPending && <Spinner size="sm" className="mr-2" />}
                        Save Security Settings
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}