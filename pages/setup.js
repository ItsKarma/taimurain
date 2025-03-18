import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import supabase from "../pages/api/db";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from "@mui/material";

// Function to validate display name
const validateDisplayName = (name) => {
  if (!name) {
    return {
      isValid: false,
      message: "Display name is required",
    };
  }

  if (name.length < 3) {
    return {
      isValid: false,
      message: "Display name must be at least 3 characters long",
    };
  }

  if (name.length > 30) {
    return {
      isValid: false,
      message: "Display name must be less than 30 characters",
    };
  }

  // Check for spaces
  if (name.includes(" ")) {
    return {
      isValid: false,
      message: "Display name cannot contain spaces",
    };
  }

  // Check for allowed characters (alphanumeric, hyphens, underscores)
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    return {
      isValid: false,
      message:
        "Display name can only contain letters, numbers, hyphens (-), and underscores (_)",
    };
  }

  // Check for consecutive hyphens or underscores
  if (/[-_]{2,}/.test(name)) {
    return {
      isValid: false,
      message: "Display name cannot contain consecutive hyphens or underscores",
    };
  }

  // Check for leading/trailing hyphens or underscores
  if (/^[-_]|[-_]$/.test(name)) {
    return {
      isValid: false,
      message: "Display name cannot start or end with a hyphen or underscore",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

export default function Setup() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: "",
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [validation, setValidation] = useState({
    isValid: false,
    message: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        // Get the session from Supabase auth.users
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("No active session found");
        }

        // Get user data from users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select()
          .eq("id", session.user.id)
          .single();

        if (userError) {
          throw userError;
        }

        if (!userData) {
          throw new Error("User data not found");
        }

        setUser(userData);
        setFormData((prev) => ({
          ...prev,
          displayName: userData.display_name || "",
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
        showToast(error.message || "Failed to load user data", "error");
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDisplayNameChange = (e) => {
    const newValue = e.target.value;
    setFormData({ ...formData, displayName: newValue });
    setValidation(validateDisplayName(newValue));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update user in users table
      const { error } = await supabase
        .from("users")
        .update({
          display_name: formData.displayName,
          onboarded: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      showToast("Settings saved successfully!");
      router.push(`/u/${formData.displayName}`);
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Failed to save settings", "error");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "white",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            py: 4,
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 500,
              backgroundColor: "#20354b",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                color="error"
                fontWeight="bold"
              >
                Error
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Unable to load your profile. Please try signing in again.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/login")}
                sx={{
                  backgroundColor: "#4285f4",
                  "&:hover": {
                    backgroundColor: "#357abd",
                  },
                }}
              >
                Return to Sign In
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Head>
        <title>Setup - Taimurain</title>
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
              maxWidth: 500,
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
                Let's set up your profile
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={formData.displayName}
                  onChange={handleDisplayNameChange}
                  margin="normal"
                  required
                  error={!validation.isValid && formData.displayName !== ""}
                  helperText={validation.message}
                  placeholder="e.g., john_doe or john-doe"
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!validation.isValid}
                  sx={{
                    backgroundColor: "#4285f4",
                    "&:hover": {
                      backgroundColor: "#357abd",
                    },
                  }}
                >
                  Complete Setup
                </Button>
              </form>
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
    </Container>
  );
}
