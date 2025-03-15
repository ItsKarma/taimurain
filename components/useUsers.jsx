import useSWR from "swr";

export default function getUsers(userName) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, isLoading, error } = useSWR(
    userName ? `/api/users/${userName}` : null,
    fetcher
  );

  return {
    userData: data,
    isLoading,
    isError: error,
  };
}
