import { createFileRoute } from "@tanstack/react-router";
import { BibleHow } from "@/features/community";

export const Route = createFileRoute("/bible/how")({
  component: BibleHow,
});
