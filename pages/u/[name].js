// Importing necessary modules and components
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Snackbar, Alert } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NoSsr from "../../components/NoSsr";
import UserCard from "../../components/userCard";
import Posts from "../../components/posts";
import CreatePost from "../../components/createPost";
import supabase from "../api/db";

// Main page component
export default function Page() {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Function to show a toast notification
  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to fetch posts from the API
  async function getPosts() {
    try {
      const response = await fetch("/api/posts", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
      showToast("Posts fetched successfully!");
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to fetch posts", "error");
    }
  }

  // Function to fetch user data based on the ID
  async function getUserData() {
    try {
      // Get the current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session) throw new Error("No active session");

      // Get user data from users table
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("User data not found");

      setUserData(data);
      showToast("User data fetched successfully!");
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Failed to fetch user data", "error");
      // Redirect to login if there's no session
      if (error.message === "No active session") {
        router.push("/login");
      }
    }
  }

  // Effect to fetch data when the page loads
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Container>
      {/* Head section for metadata */}
      <Head>
        <title>Taimurain</title>
        <link rel="icon" href="/favicon.ico" />
        <Script>0</Script>
      </Head>
      <main>
        {/* Snackbar for notifications */}
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
        {/* Main content layout */}
        <Box sx={{ display: "flex", margin: 2 }}>
          <UserCard userData={userData} /> {/* User card component */}
          <Grid container spacing={2} sx={{ flexGrow: 1, marginX: 2 }}>
            <Grid>
              <CreatePost userId={userData.id} getPosts={getPosts} />{" "}
              {/* Create post component */}
            </Grid>
            <Grid>
              <Posts posts={posts} /> {/* Posts component */}
            </Grid>
          </Grid>
        </Box>
      </main>
      {/* Analytics and performance insights */}
      <Analytics />
      <SpeedInsights />
    </Container>
  );
}
