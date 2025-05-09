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
import { ShieldCheckIcon, LockIcon, NotificationIcon, PrivacyIcon, SecurityIcon, UserIcon } from "@/lib/icons";

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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-800">Settings</h1>
      </div>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="grid grid-cols-4 gap-2 md:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-1.5">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1.5">
            <NotificationIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1.5">
            <PrivacyIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1.5">
            <SecurityIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how it appears on your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profileImage || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="text-lg">{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-neutral-500 mt-1">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center space-x-3 pt-4 border-t border-neutral-100">
                    <ShieldCheckIcon className="text-secondary-600" />
                    <p className="text-sm text-neutral-600">
                      Your profile information is securely stored and blockchain-verified
                    </p>
                  </div>
                  <Button type="submit" disabled={profileMutation.isPending}>
                    {profileMutation.isPending && <Spinner size="sm" className="mr-2" />}
                    Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Wallet</CardTitle>
              <CardDescription>
                Your decentralized identity on the Polkadot network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                    <ShieldCheckIcon className="text-secondary-600" />
                  </div>
                  <div>
                    <p className="font-medium">Wallet ID</p>
                    <p className="text-sm text-neutral-500 font-mono">
                      {user?.walletId ? 
                        `${user.walletId.substring(0, 12)}...${user.walletId.substring(user.walletId.length - 8)}` 
                        : "No Wallet ID"
                      }
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="outline">Regenerate Wallet</Button>
                <Button variant="outline" className="border-secondary-200 bg-secondary-50 text-secondary-700 hover:bg-secondary-100">
                  Export Keys (Advanced)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NotificationIcon className="text-primary-600" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications about your healthcare data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive email notifications about important updates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="appNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">App Notifications</FormLabel>
                            <FormDescription>
                              Receive in-app notifications and alerts
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="consentAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Consent Alerts</FormLabel>
                            <FormDescription>
                              Get notified when a provider requests access to your data
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="securityAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Security Alerts</FormLabel>
                            <FormDescription>
                              Be alerted about important security events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="healthUpdates"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Health Updates</FormLabel>
                            <FormDescription>
                              Receive notifications about your health records
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={notificationMutation.isPending}>
                    {notificationMutation.isPending && <Spinner size="sm" className="mr-2" />}
                    Save Notification Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PrivacyIcon className="text-primary-600" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control how your data is shared and used across the MediBridge platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...privacyForm}>
                <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                  <FormField
                    control={privacyForm.control}
                    name="dataSharing"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Data Sharing Level</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="minimal" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Minimal - Share only essential information
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="standard" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Standard - Balanced data sharing
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="comprehensive" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Comprehensive - Share detailed health information
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={privacyForm.control}
                    name="anonymizedDataForResearch"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Research Contribution</FormLabel>
                          <FormDescription>
                            Allow anonymized data to be used for medical research
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={privacyForm.control}
                    name="blockchainVerification"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Blockchain Verification</FormLabel>
                          <FormDescription>
                            Enable blockchain verification for enhanced security
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center space-x-3 pt-4 border-t border-neutral-100">
                    <LockIcon className="text-secondary-600" />
                    <p className="text-sm text-neutral-600">
                      Your privacy settings are protected and enforced with blockchain contracts
                    </p>
                  </div>
                  <Button type="submit" disabled={privacyMutation.isPending}>
                    {privacyMutation.isPending && <Spinner size="sm" className="mr-2" />}
                    Save Privacy Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SecurityIcon className="text-primary-600" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security options to protect your healthcare data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="twoFactorAuth"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            Add an extra layer of security to your account
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="biometricLogin"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Biometric Authentication</FormLabel>
                          <FormDescription>
                            Use fingerprint or face recognition for login
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Session Timeout</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="15" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                15 minutes (Recommended)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="30" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                30 minutes
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="60" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                60 minutes
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="never" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Never (Not recommended)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center space-x-3 pt-4 border-t border-neutral-100">
                    <ShieldCheckIcon className="text-secondary-600" />
                    <p className="text-sm text-neutral-600">
                      Your account is protected with advanced security measures
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Button type="submit" disabled={securityMutation.isPending}>
                      {securityMutation.isPending && <Spinner size="sm" className="mr-2" />}
                      Save Security Settings
                    </Button>
                    <Button variant="outline" type="button">
                      Change Password
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}