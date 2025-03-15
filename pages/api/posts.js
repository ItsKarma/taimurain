import supabase from "./db";

export default async function handler(req, res) {
  // if the request method is POST
  if (req.method === "POST") {
    console.log("POST /api/posts");

    const { userId, message } = req.body;

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ userId: userId, message: message }]);
      if (error) {
        throw error;
      }
      console.debug("data", data);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to post post" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
