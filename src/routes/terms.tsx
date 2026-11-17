import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/features/account";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});
