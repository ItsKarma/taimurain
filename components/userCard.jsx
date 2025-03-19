import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import supabase from "../pages/api/db";

export default function UserCard({ userData }) {
  const [sessionStatus, setSessionStatus] = useState("Checking...");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          setSessionStatus("Online");
        } else {
          setSessionStatus("Offline");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setSessionStatus("Error");
      }
    };

    checkSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionStatus(session ? "Online" : "Offline");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!userData) {
    return null;
  }

  return (
    <Card
      sx={{
        width: 256,
        backgroundColor: "#20354b",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="center" mb={4}>
          <Avatar
            src={
              userData.avatar_url ||
              "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"
            }
            sx={{
              width: 96,
              height: 96,
              border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        </Box>

        <Tooltip title={userData.display_name} placement="top">
          <Typography
            variant="body1"
            sx={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            @{userData.display_name}
          </Typography>
        </Tooltip>

        <Typography
          variant="body2"
          sx={{
            color:
              sessionStatus === "Online" ? "success.main" : "text.secondary",
            textAlign: "center",
            fontWeight: "semibold",
            mb: 2,
          }}
        >
          {sessionStatus}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            maxHeight: "4.5em",
          }}
        >
          {userData.description || "No description yet"}
        </Typography>
      </CardContent>
    </Card>
  );
}
