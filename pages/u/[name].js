import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FaRegMinusSquare, FaRegPlusSquare, FaBed } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";
import NoSsr from "../../components/NoSsr";
import UserCard from "../../components/userCard";
import Posts from "../../components/posts";
import CreatePost from "../../components/createPost";
import { Container, Box, Grid } from "@mui/material";

export default function Page() {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [userName, setUserName] = useState("");
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

  async function getPosts() {
    try {
      const response = await fetch("/api/posts", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPostData(data);
      showToast("Posts fetched successfully!");
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to fetch posts", "error");
    }
  }

  async function getUsers(userName) {
    console.log("userName", userName);
    try {
      const response = await fetch(
        `/api/users/${encodeURIComponent(userName)}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserData(data);
      console.log("userData", data);
      showToast("User data fetched successfully!");
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to fetch user data", "error");
    }
  }

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        if (router.query.name) {
          console.log(router.query.name);
          // await getUsers(router.query.name);
          setUserName(router.query.name);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPageData();
  }, [router.query.name]);

  return (
    <Container>
      <Head>
        <title>Taimurain</title>
        <link rel="icon" href="/favicon.ico" />
        <Script>0</Script>
      </Head>
      <main>
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
        <Box sx={{ display: "flex", margin: 2 }}>
          <UserCard userName={userName} />
          <Grid container spacing={2} sx={{ flexGrow: 1, marginX: 2 }}>
            <Grid item xs={12}>
              <CreatePost userId={userData.id} getPosts={getPosts} />
            </Grid>
            <Grid item xs={12}>
              <Posts userName={userName} />
            </Grid>
          </Grid>
          <UserCard userName={userName} />
        </Box>
      </main>
      <Analytics />
      <SpeedInsights />
    </Container>
  );
}
