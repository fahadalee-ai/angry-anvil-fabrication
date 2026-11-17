import { createFileRoute } from "@tanstack/react-router";
import { GalleryScreen } from "@/features/community";

export const Route = createFileRoute("/gallery/")({
  component: GalleryScreen,
});
