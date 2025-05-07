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
        const res = await fetchWithRetry("/api/user", { 
          credentials: "include",
          headers: {
            "Accept": "application/json"
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        // Don't show toast for initial auth check errors
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await apiRequest("POST", "/api/login", { username, password });
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
      
      await apiRequest("POST", "/api/logout", {});
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
