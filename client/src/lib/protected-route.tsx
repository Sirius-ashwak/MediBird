import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { isAuthenticated, loading } = useAuth();

  // Display a loading spinner while checking authentication
  if (loading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-primary-600">Loading...</span>
        </div>
      </Route>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Route path={path}>
        <Redirect to="/login" />
      </Route>
    );
  }

  // Handle route depending on whether it's the root path or not
  if (path === "/") {
    return (
      <Route path={path} component={Component} />
    );
  }

  // For non-root paths, handle both the exact path and any child routes
  return (
    <Route path={path} component={Component} />
  );
}