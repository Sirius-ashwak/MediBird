import { useCallback, useState } from 'react';
import { useToast } from './use-toast';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useApi(options: UseApiOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const request = useCallback(
    async <T>(url: string, method: string = 'GET', body?: any): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);

        // Make sure URL starts with a slash if not a full URL
        const apiUrl = url.startsWith('http') ? url : url.startsWith('/') ? url : `/${url}`;

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        const fetchOptions: RequestInit = {
          method,
          headers,
          credentials: 'include',
        };

        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          fetchOptions.body = JSON.stringify(body);
        }

        // Add retry logic for network issues
        let response;
        let retries = 3;
        while (retries > 0) {
          try {
            response = await fetch(apiUrl, fetchOptions);
            break;
          } catch (err) {
            retries--;
            if (retries === 0) throw err;
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        if (!response) {
          throw new Error('Failed to connect to server');
        }

        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || `Request failed with status ${response.status}`;
          } catch (e) {
            errorMessage = `Request failed with status ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        options.onSuccess?.(data);
        return data as T;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        
        // Show toast with error message
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options, toast]
  );

  const get = useCallback(<T>(url: string) => request<T>(url, 'GET'), [request]);
  
  const post = useCallback(
    <T>(url: string, body: any) => request<T>(url, 'POST', body),
    [request]
  );
  
  const put = useCallback(
    <T>(url: string, body: any) => request<T>(url, 'PUT', body),
    [request]
  );
  
  const patch = useCallback(
    <T>(url: string, body: any) => request<T>(url, 'PATCH', body),
    [request]
  );
  
  const del = useCallback(<T>(url: string) => request<T>(url, 'DELETE'), [request]);

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    request,
    isLoading,
    error,
  };
}