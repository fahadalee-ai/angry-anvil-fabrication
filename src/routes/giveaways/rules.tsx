import { createFileRoute } from "@tanstack/react-router";
import { RulesScreen } from "@/features/community";

export const Route = createFileRoute("/giveaways/rules")({
  component: RulesScreen,
});
