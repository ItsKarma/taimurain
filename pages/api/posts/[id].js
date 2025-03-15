import supabase from "../db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    console.log(`GET /api/posts/${id}`);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
        *,
        user:userId (displayName)
      `
        )
        .eq("userId", id)
        .order("id", { ascending: false });
      if (error) {
        throw error;
      }
      console.debug("data", data);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  } else if (req.method === "DELETE") {
    console.log(`DELETE /api/posts/${id}`);
    try {
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);
      if (error) {
        throw error;
      }
      console.debug("data", data);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
