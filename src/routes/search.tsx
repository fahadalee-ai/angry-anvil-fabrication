import { createFileRoute } from "@tanstack/react-router";
import { SearchScreen } from "@/features/account";

export const Route = createFileRoute("/search")({
  component: SearchScreen,
});
