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
import Events from "../../components/events";
import CreateEvent from "../../components/createEvent";
import supabase from "../api/db";

// Main page component
export default function Page() {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [events, setEvents] = useState([]);
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

  // Function to fetch events from the API
  async function getEvents() {
    try {
      const response = await fetch("/api/events", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
      showToast("Events fetched successfully!");
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to fetch events", "error");
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
    <Container maxWidth={false} disableGutters>
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
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "transparent",
            gap: 2,
            padding: 2,
          }}
        >
          {/* Left column - UserCard */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              height: "100vh",
              padding: 1,
            }}
          >
            <UserCard userData={userData} />
          </Box>

          {/* Center column - Events */}
          <Box
            sx={{
              flexGrow: 1,
              padding: 1,
              maxWidth: "calc(100% - 800px)", // Account for side columns
            }}
          >
            <Events events={events} />
          </Box>

          {/* Right column - CreateEvent */}
          <Box
            sx={{
              width: 400,
              padding: 1,
            }}
          >
            <CreateEvent userId={userData.id} getEvents={getEvents} />
          </Box>
        </Box>
      </main>
      {/* Analytics and performance insights */}
      <Analytics />
      <SpeedInsights />
    </Container>
  );
}
