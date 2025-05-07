import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => false,
  logout: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to handle fetch with retries
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3): Promise<Response> => {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (retries <= 1) throw err;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setError(null);
        console.log("Checking authentication status...");
        
        const res = await fetch("/api/user", { 
          method: "GET",
          credentials: "include",
          headers: {
            "Accept": "application/json"
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log("User authenticated:", data.user);
          setUser(data.user);
        } else {
          console.log("User not authenticated, status:", res.status);
          // If not authenticated, explicitly set user to null
          setUser(null);
          
          if (res.status === 401) {
            // Only show toast for unexpected logouts
            const currentPath = window.location.pathname;
            if (currentPath !== "/" && currentPath !== "/login" && currentPath !== "/auth") {
              toast({
                title: "Session expired",
                description: "Please log in again to continue.",
                variant: "destructive",
              });
            }
          }
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        // Set user to null on error
        setUser(null);
        // Don't show toast for initial auth check errors
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Use a direct fetch here instead of apiRequest to avoid response consumption issues
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Login failed with status: ${res.status}`);
      }
      
      const data = await res.json();
      setUser(data.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name || username}!`,
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      console.error("Login error:", err);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Use direct fetch instead of apiRequest
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include"
      });
      
      // Even if the request fails, we still want to log out locally
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      console.error("Logout error:", err);
      
      // Still set user to null even if the API call fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
