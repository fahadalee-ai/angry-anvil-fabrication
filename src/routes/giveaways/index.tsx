import { createFileRoute } from "@tanstack/react-router";
import { GiveawaysScreen } from "@/features/community";

export const Route = createFileRoute("/giveaways/")({
  component: GiveawaysScreen,
});
