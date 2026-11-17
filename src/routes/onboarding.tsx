import { createFileRoute } from "@tanstack/react-router";
import { OnboardingScreen } from "@/features/account";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingScreen,
});
