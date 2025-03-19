import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useEvents, { deleteEvent } from "./useEvents";
import NoSsr from "./NoSsr";

// Helper function to format date consistently
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const utcDate = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes()
    )
  );

  return utcDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

export default function Events() {
  const { data: events, isValidating, mutate } = useEvents();

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id, mutate);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <NoSsr>
      <Box>
        {!events || events.length === 0 ? (
          <Box p={3}>
            <Typography variant="body1" color="text.secondary">
              No events yet
            </Typography>
          </Box>
        ) : (
          events.map((event) => (
            <Card
              key={event.id}
              sx={{
                backgroundColor: "#20354b",
                borderRadius: 2,
                mb: 2,
                position: "relative",
                opacity: isValidating ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="text.primary"
                  sx={{
                    mb: 1,
                    fontWeight: "bold",
                  }}
                >
                  {event.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{
                    mb: 1,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {event.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(event.date)}
                </Typography>
                <IconButton
                  onClick={() => handleDelete(event.id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "error.main",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </NoSsr>
  );
}
