import { createFileRoute } from "@tanstack/react-router";
import { BibleRequest } from "@/features/community";

export const Route = createFileRoute("/bible/request")({
  component: BibleRequest,
});
