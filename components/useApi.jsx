import useSWR from "swr";
import supabase from "../pages/api/db";

const fetcher = async (...args) => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }
  if (!session) {
    throw new Error("No active session");
  }

  // Add authorization header to the request
  const [url, config = {}] = args;
  const headers = {
    ...config.headers,
    Authorization: `Bearer ${session.access_token}`,
  };

  const response = await fetch(url, { ...config, headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch data");
  }

  return response.json();
};

export default function useApi(route, options = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    route ? `/api/${route}` : null,
    fetcher,
    options
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Convenience hooks for common routes
export function useEvents() {
  return useApi("events");
}

export function useUser(userName) {
  return useApi(userName ? `users/${userName}` : null);
}
