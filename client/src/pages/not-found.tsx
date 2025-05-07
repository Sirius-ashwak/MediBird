import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="default">
          <Link href="/">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/records">View Records</Link>
        </Button>
      </div>
    </div>
  );
}