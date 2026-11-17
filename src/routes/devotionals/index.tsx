import { createFileRoute } from "@tanstack/react-router";
import { DevotionalList } from "@/features/community";

export const Route = createFileRoute("/devotionals/")({
  component: DevotionalList,
});
