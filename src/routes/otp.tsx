import { createFileRoute } from "@tanstack/react-router";
import { OtpScreen } from "@/features/account";

export const Route = createFileRoute("/otp")({
  component: OtpScreen,
});
