import { createFileRoute } from "@tanstack/react-router";
import { ShippingPage } from "@/features/account";

export const Route = createFileRoute("/shipping")({
  component: ShippingPage,
});
