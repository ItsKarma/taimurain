import useSWR from "swr";

export default function getPosts(userId) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, isLoading, error } = useSWR(
    userId ? `/api/posts/${userId}` : null,
    fetcher
  );

  return {
    postData: data,
    isLoading,
    isError: error,
  };
}

// export default function deletePosts({ id }) {
//   const fetcher = (...args) => fetch(...args).then((res) => res.json());
//   const { data, isLoading, error } = useSWR("/api/posts", fetcher);

//   return {
//     postData: data,
//     isLoading,
//     isError: error,
//   };
// }
