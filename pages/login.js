import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
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

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to initiate Google sign-in");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No redirect URL received");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to initiate Google sign-in", "error");
    }
  };

  return (
    <Container>
      <Head>
        <title>Login - Taimurain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            py: 4,
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 400,
              backgroundColor: "#20354b",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                textAlign="center"
                color="text.primary"
                fontWeight="bold"
              >
                Welcome to Taimurain
              </Typography>
              <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Sign in to continue
              </Typography>
              <Button
                fullWidth
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                sx={{
                  backgroundColor: "#4285f4",
                  "&:hover": {
                    backgroundColor: "#357abd",
                  },
                }}
              >
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        </Box>
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
      </main>
      <Analytics />
      <SpeedInsights />
    </Container>
  );
}
