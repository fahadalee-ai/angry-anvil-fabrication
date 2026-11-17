import { createFileRoute } from "@tanstack/react-router";
import { CheckoutScreen } from "@/features/shop";

export const Route = createFileRoute("/shop/checkout")({
  component: CheckoutScreen,
});
