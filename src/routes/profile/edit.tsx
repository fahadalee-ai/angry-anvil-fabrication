import { createFileRoute } from "@tanstack/react-router";
import { EditProfile } from "@/features/account";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfile,
});
