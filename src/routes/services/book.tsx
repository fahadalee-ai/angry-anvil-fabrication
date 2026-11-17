import { createFileRoute } from "@tanstack/react-router";
import { BookScreen } from "@/features/services";

export const Route = createFileRoute("/services/book")({
  component: BookScreen,
});
