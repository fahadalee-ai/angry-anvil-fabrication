import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/features/account";

export const Route = createFileRoute("/login")({
  component: LoginScreen,
});
