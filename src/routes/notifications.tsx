import { createFileRoute } from "@tanstack/react-router";
import { NotificationsScreen } from "@/features/account";

export const Route = createFileRoute("/notifications")({
  component: NotificationsScreen,
});
