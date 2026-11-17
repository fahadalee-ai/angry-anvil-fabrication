import { createFileRoute } from "@tanstack/react-router";
import { BibleOffer } from "@/features/community";

export const Route = createFileRoute("/bible/offer")({
  component: BibleOffer,
});
