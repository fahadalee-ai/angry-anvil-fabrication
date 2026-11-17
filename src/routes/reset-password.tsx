import { createFileRoute } from "@tanstack/react-router";
import { ResetScreen } from "@/features/account";

export const Route = createFileRoute("/reset-password")({
  component: ResetScreen,
});
