import useApi from "./useApi";
import supabase from "../pages/api/db";

export default function useEvents() {
  return useApi("events");
}

export async function deleteEvent(id, mutate) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(`/api/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }

  await mutate();
}
