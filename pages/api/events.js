import supabase from "./db";

export default async function handler(req, res) {
  // if the request method is POST
  if (req.method === "POST") {
    console.log("POST /api/events");
    console.log("Request body:", req.body);

    const { user_id, title, description, date } = req.body;

    try {
      // Get the session from the request headers
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          error: "Authentication required",
          redirect: "/login",
        });
      }

      // Extract the token from the Bearer header
      const token = authHeader.replace("Bearer ", "");
      console.log("Token received:", token ? "Yes" : "No");

      // Verify the token and get the user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(token);
      console.log("User from token:", user ? "Valid" : "Invalid");

      if (userError) {
        console.error("User error:", userError);
        return res.status(401).json({
          error: "Authentication failed",
          redirect: "/login",
        });
      }

      if (!user) {
        return res.status(401).json({
          error: "Session expired",
          redirect: "/login",
        });
      }

      // Verify the user_id matches the token user
      if (user.id !== user_id) {
        return res.status(403).json({
          error: "Unauthorized access",
        });
      }

      // Log the data we're trying to insert
      const insertData = {
        user_id,
        title,
        message: description,
        date,
      };
      console.log("Attempting to insert:", insertData);

      const { data, error } = await supabase
        .from("events")
        .insert([insertData]);

      if (error) {
        console.error("Supabase error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log("Successfully inserted data:", data);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({
        error: "Failed to create event",
        details: {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        },
      });
    }
  } else if (req.method === "GET") {
    console.log("GET /api/events");
    try {
      // Get the session from the request headers
      const authHeader = req.headers.authorization;
      console.log("Auth header present:", !!authHeader);

      if (!authHeader) {
        return res.status(401).json({
          error: "Authentication required",
          redirect: "/login",
        });
      }

      // Extract the token from the Bearer header
      const token = authHeader.replace("Bearer ", "");
      console.log("Token received:", token ? "Yes" : "No");
      console.log("Token length:", token?.length || 0);

      // Verify the token and get the user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(token);
      console.log("User from token:", user ? "Valid" : "Invalid");
      console.log("User ID:", user?.id);
      console.log("User error:", userError?.message);

      if (userError) {
        console.error("User error:", userError);
        return res.status(401).json({
          error: "Authentication failed",
          redirect: "/login",
        });
      }

      if (!user) {
        return res.status(401).json({
          error: "Session expired",
          redirect: "/login",
        });
      }

      // Fetch events for the authenticated user
      console.log("Fetching events for user:", user.id);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }

      console.log("Successfully fetched events:", data?.length || 0);
      console.log("Events data:", JSON.stringify(data, null, 2));
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({
        error: "Failed to fetch events",
        details: {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        },
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
