import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, MapPinIcon, VideoIcon } from "@/lib/icons";
import { Appointment } from "@shared/schema";

export default function UpcomingAppointments() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
        <Button variant="link" size="sm" className="text-sm text-primary-600 flex items-center">
          <i className="ri-add-line mr-1"></i>
          <span>Add new</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between">
                  <Skeleton className="h-3 w-32" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="p-3 bg-primary-50 border border-primary-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-primary-600 font-medium">Tomorrow, 10:00 AM</span>
                    <h4 className="font-medium text-neutral-800">Dr. Emily Chen</h4>
                    <p className="text-sm text-neutral-600">General Checkup</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-primary-100 flex justify-between items-center">
                  <div className="flex items-center space-x-1 text-xs text-neutral-600">
                    <MapPinIcon />
                    <span>Northwest Medical Center</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="link" size="sm" className="text-primary-600 text-xs hover:text-primary-700 p-0 h-auto">
                      <VideoIcon className="mr-1" />Join
                    </Button>
                    <Button variant="link" size="sm" className="text-neutral-500 text-xs hover:text-neutral-700 p-0 h-auto">
                      <CalendarIcon className="mr-1" />Reschedule
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-neutral-500 font-medium">Jul 25, 2:30 PM</span>
                    <h4 className="font-medium text-neutral-800">Dr. Robert Wilson</h4>
                    <p className="text-sm text-neutral-600">Dermatology Consultation</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between items-center">
                  <div className="flex items-center space-x-1 text-xs text-neutral-600">
                    <MapPinIcon />
                    <span>Telehealth Appointment</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="link" size="sm" className="text-primary-600 text-xs hover:text-primary-700 p-0 h-auto">
                      <CalendarIcon className="mr-1" />Reschedule
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
