import supabase from "../db";

export default async function handler(req, res) {
  const { userName } = req.query;
  console.log(`GET /api/users/${userName}`);

  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("userName", userName)
      .single();

    if (error) {
      throw error;
    }
    console.log("data", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}
