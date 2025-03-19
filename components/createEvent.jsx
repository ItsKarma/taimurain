import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import supabase from "../pages/api/db";

export default function CreateEvent({ userId, getEvents }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", {
      userId,
      title,
      description: message,
      date,
    });

    if (!message.trim() || !title.trim()) return;

    setIsSubmitting(true);
    try {
      // Get the current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("No active session");

      console.log("Current session:", session ? "Valid" : "Invalid");
      console.log(
        "Session token:",
        session?.access_token ? "Present" : "Missing"
      );

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          title: title.trim(),
          description: message,
          date: new Date(date).toISOString(),
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 && data.redirect) {
          setSnackbar({
            open: true,
            message: "Please log in again",
            severity: "warning",
          });
          router.push(data.redirect);
          return;
        }
        throw new Error(data.error || "Failed to create event");
      }

      setTitle("");
      setMessage("");
      setDate(new Date().toISOString().split("T")[0]);
      setSnackbar({
        open: true,
        message: "Event created successfully!",
        severity: "success",
      });
      await getEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to create event",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: "#20354b",
        borderRadius: 2,
        mb: 3,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What happened?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
          <TextField
            type="date"
            label="When did it happen?"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={!message.trim() || !title.trim() || isSubmitting}
              sx={{
                backgroundColor: "#4285f4",
                "&:hover": {
                  backgroundColor: "#357abd",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Event"
              )}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
}
