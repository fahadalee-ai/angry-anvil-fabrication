import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/features/account";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});
