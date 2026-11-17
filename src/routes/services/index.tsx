import { createFileRoute } from "@tanstack/react-router";
import { ServicesHome } from "@/features/services";

export const Route = createFileRoute("/services/")({
  component: ServicesHome,
});
