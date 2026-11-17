import { createFileRoute } from "@tanstack/react-router";
import { ForgotScreen } from "@/features/account";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotScreen,
});
