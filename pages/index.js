import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FaRegMinusSquare, FaRegPlusSquare, FaBed } from "react-icons/fa";
import {
  Snackbar,
  Alert,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
} from "@mui/material";

export default function Home() {
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

  async function incrementRounds() {
    try {
      await fetch("/api/incrementRounds", {
        method: "POST",
      });
      showToast("Rounds incremented successfully!");
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to increment rounds", "error");
    }
  }

  return (
    <Container>
      <Head>
        <title>Taimurain</title>
        <link rel="icon" href="/favicon.ico" />
        {/* to prevent Firefox FOUC, this must be here */}
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
        <Box
          sx={{
            backgroundColor: "#071e34",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Card
            sx={{
              width: 300,
              backgroundColor: "#20354b",
              borderRadius: 2,
              boxShadow: 3,
              padding: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                2d ago
              </Typography>
              <Typography color="success.main">
                <FaRegMinusSquare />
              </Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <Avatar
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
                sx={{ width: 72, height: 72 }}
              />
            </Box>
            <CardContent>
              <Typography
                variant="h5"
                color="text.primary"
                textAlign="center"
                fontWeight="bold"
              >
                Matt Karmazyn
              </Typography>
              <Typography
                variant="body1"
                color="success.main"
                textAlign="center"
                mt={1}
              >
                Active
              </Typography>
              <Box mt={2}>
                <LinearProgress
                  variant="determinate"
                  value={40}
                  sx={{
                    backgroundColor: "black",
                    "& .MuiLinearProgress-bar": { backgroundColor: "yellow" },
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mt={1}
              >
                <strong>Storage:</strong> 40%
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </main>
      <Analytics />
      <SpeedInsights />
    </Container>
  );
}
