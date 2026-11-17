import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailScreen } from "@/features/account";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailScreen,
});
