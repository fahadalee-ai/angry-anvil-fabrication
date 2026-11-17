import { createFileRoute } from "@tanstack/react-router";
import { RegisterScreen } from "@/features/account";

export const Route = createFileRoute("/register")({
  component: RegisterScreen,
});
