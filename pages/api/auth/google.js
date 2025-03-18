import supabase from "../db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      throw new Error("NEXT_PUBLIC_SITE_URL environment variable is not set");
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return res.status(200).json({ url: data.url });
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to initiate Google sign-in" });
  }
}
