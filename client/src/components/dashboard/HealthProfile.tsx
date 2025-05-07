import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { EditIcon } from "@/lib/icons";
import { useAuth } from "@/context/AuthContext";

export default function HealthProfile() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  const profileDetails = [
    { label: "Blood Type", value: profile?.bloodType || "O+" },
    { label: "Height", value: profile?.height || "5'6\" (168 cm)" },
    { label: "Weight", value: profile?.weight || "135 lbs (61 kg)" },
    { label: "Allergies", value: profile?.allergies || "Penicillin, Peanuts" },
    { label: "Emergency Contact", value: profile?.emergencyContact || "John Johnson" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Health Profile</CardTitle>
        <Button variant="ghost" size="icon">
          <EditIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-3 pt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-primary-100">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-neutral-800">{user?.name || "Sarah Johnson"}</h4>
                <p className="text-sm text-neutral-500">{profile?.age || "32"} years old, {profile?.gender || "Female"}</p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full text-xs flex items-center">
                    <i className="ri-user-3-line mr-1"></i>
                    <span>Patient ID: #{profile?.patientId || "8724531"}</span>
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {profileDetails.map((detail, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">{detail.label}:</span>
                  <span className="text-sm font-medium text-neutral-800">{detail.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <Button className="w-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors">
                View Complete Profile
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
