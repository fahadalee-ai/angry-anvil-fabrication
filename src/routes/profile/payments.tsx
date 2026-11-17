import { createFileRoute } from "@tanstack/react-router";
import { PaymentsScreen } from "@/features/account";

export const Route = createFileRoute("/profile/payments")({
  component: PaymentsScreen,
});
