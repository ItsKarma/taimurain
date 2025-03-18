import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";

export default function UserCard({ userData }) {
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
            color: "success.main",
            textAlign: "center",
            fontWeight: "semibold",
            mb: 2,
          }}
        >
          {userData.status || "Active"}
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
