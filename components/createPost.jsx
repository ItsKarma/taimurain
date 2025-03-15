import React, { useState } from "react";

export default function CreatePost({ userId, getPosts }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const postPost = async (message) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, message }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (event) => {
    // Prevent the default form submission
    event.preventDefault();
    // Disable the submit button
    setPending(true);
    // Submit a new post
    await postPost(message);
    // Fetch posts after submitting a new post
    await getPosts();
    // Clear the message input after submitting
    setMessage("");
    // Enable the submit button
    setPending(false);
  };

  return (
    <div className="flex flex-col mb-4">
      <form
        className="w-full bg-[#20354b] rounded-2xl shadow-lg flex"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l-xl bg-[#20354b] text-white focus:outline-none"
          placeholder="Write a post..."
        />
        <button
          type="submit"
          className={`p-2 ${
            pending ? "bg-gray-600" : "bg-blue-600"
          } text-white rounded-r-xl`}
          disabled={!message.trim()} // Disable button if message is empty or only whitespace
        >
          Submit
        </button>
      </form>
    </div>
  );
}
