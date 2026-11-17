import { createFileRoute } from "@tanstack/react-router";
import { BibleHome } from "@/features/community";

export const Route = createFileRoute("/bible/")({
  component: BibleHome,
});
