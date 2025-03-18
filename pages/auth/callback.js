import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../pages/api/db";
import { Snackbar, Alert } from "@mui/material";

export default function AuthCallback() {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // First, check if we have a hash in the URL
        if (window.location.hash) {
          // If we have a hash, we need to wait for Supabase to process it
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Get the session from Supabase auth.users
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          throw new Error("No session found");
        }

        // Check if user exists in our users table
        const { data: existingUser, error: userError } = await supabase
          .from("users")
          .select()
          .eq("id", session.user.id)
          .single();

        if (userError && userError.code !== "PGRST116") {
          // PGRST116 is "not found"
          throw userError;
        }

        // If user doesn't exist, create them in users table
        if (!existingUser) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: session.user.id,
              email: session.user.email,
              userName: session.user.email.split("@")[0], // Use email prefix as username
              display_name:
                session.user.user_metadata.full_name ||
                session.user.email.split("@")[0],
              avatarUrl: session.user.user_metadata.avatar_url,
              onboarded: false, // Set onboarded to false for new users
            },
          ]);

          if (insertError) {
            showToast(`Error creating user: ${insertError.message}`, "error");
            router.replace("/login?error=user_creation_failed");
          } else {
            // Redirect to setup page for new users
            router.replace("/setup");
          }
        } else if (!existingUser.onboarded) {
          // Redirect to setup page for existing users who haven't completed onboarding
          router.replace("/setup");
        } else {
          // Redirect to user's profile page for onboarded users
          router.replace(`/u/${existingUser.display_name}`);
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        showToast(error.message || "Authentication failed", "error");
        router.replace("/login?error=auth_failed");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "white",
        }}
      >
        Completing sign in...
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
