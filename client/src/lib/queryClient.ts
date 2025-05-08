import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Clone the response before reading its body
    const resClone = res.clone();
    let errorText;
    try {
      const errorData = await resClone.json();
      errorText = errorData.message || res.statusText;
    } catch (e) {
      errorText = await resClone.text() || res.statusText;
    }
    throw new Error(`${res.status}: ${errorText}`);
  }
}

export async function apiRequest<T = any>(
  url: string,
  options: {
    method?: string;
    data?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = 'GET', data, headers = {} } = options;
  
  // Ensure URL is a string and handle it properly
  if (typeof url !== 'string') {
    console.error('Invalid URL provided to apiRequest:', url);
    throw new Error('Invalid URL: URL must be a string');
  }
  
  // Make sure absolute URLs always have a leading slash
  const apiUrl = url.startsWith('http') ? url : url.startsWith('/') ? url : `/${url}`;
  
  // Add retry logic for network issues
  let res;
  let retries = 3;
  
  while (retries > 0) {
    try {
      res = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...headers
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });
      break;
    } catch (err) {
      console.error('Network error in apiRequest:', err);
      retries--;
      if (retries === 0) throw err;
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (!res) {
    throw new Error('Failed to connect to server');
  }

  await throwIfResNotOk(res);
  
  // Parse the response as JSON and return it with the correct type
  const responseData = await res.json();
  return responseData as T;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Make sure absolute URLs always have a leading slash
    const url = queryKey[0] as string;
    const apiUrl = url.startsWith('http') ? url : url.startsWith('/') ? url : `/${url}`;
    
    // Add retry logic for network issues
    let res;
    let retries = 3;
    
    while (retries > 0) {
      try {
        res = await fetch(apiUrl, {
          headers: {
            "Accept": "application/json",
          },
          credentials: "include",
        });
        break;
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!res) {
      throw new Error('Failed to connect to server');
    }

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    // Clone the response before processing it
    const resClone = res.clone();
    await throwIfResNotOk(resClone);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Changed from "throw" to "returnNull" to prevent crashes
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 60000, // Set to 1 minute instead of Infinity to ensure data freshness
      retry: 1, // Reduced retries to improve user experience with failed auth
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});
