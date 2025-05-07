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

  if (!isAuthenticated) {
    return (
      <Route path={path}>
        <Redirect to="/login" />
      </Route>
    );
  }

  // Support both exact and nested paths
  // This ensures "/", "/records", etc. all work properly
  return (
    <>
      <Route path={path} component={Component} />
      <Route path={`${path}/*`} component={Component} />
    </>
  );
}