import { createFileRoute } from "@tanstack/react-router";
import { BookingsScreen } from "@/features/services";

export const Route = createFileRoute("/services/bookings/")({
  component: BookingsScreen,
});
