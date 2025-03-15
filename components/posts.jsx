import useSWR from "swr";
import getPosts from "./usePosts";

export default function Posts({ userName }) {
  const { data: user } = useSWR(`/api/users/${userName}`);
  const { postData, isLoading, isError } = getPosts(user ? user.id : null);

  const formatDate = (date) => {
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", options);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString("en-US", options)}`;
    } else {
      return `${date.getMonth() + 1}/${date
        .getDate()
        .toString()
        .padStart(2, "0")}/${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Fetch posts after deleting to update the UI
        await getPosts();
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      {isLoading || !postData ? (
        <div className="w-full bg-[#20354b] rounded-2xl px-6 py-4 shadow-lg mb-4">
          <div className="flex flex-col animate-pulse space-y-3">
            <div>
              <div className="w-1/4 bg-gray-500 h-3 rounded-md inline-block mr-2"></div>
              <div className="w-1/6 bg-gray-500 h-2 rounded-md inline-block"></div>
            </div>
            <div className="w-1/2 bg-gray-500 h-2 rounded-md"></div>
            <div className="w-1/3 bg-gray-500 h-2 rounded-md"></div>
            <div className="w-1/6 bg-gray-500 h-3 rounded-md ml-auto"></div>
          </div>
        </div>
      ) : (
        postData.map((post) => {
          const createdAt = new Date(post.createdAt);
          const formattedDate = formatDate(createdAt);

          return (
            <section
              key={post.id}
              className="w-full bg-[#20354b] rounded-2xl px-6 py-4 shadow-lg mb-4"
            >
              <div>
                <div>
                  <span className="text-lg text-gray-400 font-semibold mr-2">
                    {post.user.displayName}
                  </span>
                  <span className="text-sm text-gray-400 font-semibold">
                    {formattedDate}
                  </span>
                </div>
                <div className="mb-2">
                  <h2 className="ml-2 text-white text-md tracking-wide">
                    {post.message}
                  </h2>
                </div>
                <div className="flex justify-end">
                  <button
                    className="text-red-500 mr-2"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                  <button className="text-red-500">Reply</button>
                </div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
