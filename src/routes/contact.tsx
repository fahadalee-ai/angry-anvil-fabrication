import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/features/account";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
