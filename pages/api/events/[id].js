import supabase from "../db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    console.log(`GET /api/events/${id}`);
    try {
      const { data, error } = await supabase
        .from("events")
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
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  } else if (req.method === "DELETE") {
    console.log(`DELETE /api/events/${id}`);
    try {
      const { data, error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);
      if (error) {
        throw error;
      }
      console.debug("data", data);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
