import { createFileRoute } from "@tanstack/react-router";
import { UpdatePasswordScreen } from "@/features/account";

export const Route = createFileRoute("/update-password")({
  component: UpdatePasswordScreen,
});
