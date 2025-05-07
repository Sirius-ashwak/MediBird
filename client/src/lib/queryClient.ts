import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorText;
    try {
      const errorData = await res.json();
      errorText = errorData.message || res.statusText;
    } catch (e) {
      errorText = await res.text() || res.statusText;
    }
    throw new Error(`${res.status}: ${errorText}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
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
        },
        body: data ? JSON.stringify(data) : undefined,
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

  await throwIfResNotOk(res);
  return res;
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

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 2,
      retryDelay: 1000,
    },
  },
});
