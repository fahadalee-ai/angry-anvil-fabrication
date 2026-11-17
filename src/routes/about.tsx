import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/features/account";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
