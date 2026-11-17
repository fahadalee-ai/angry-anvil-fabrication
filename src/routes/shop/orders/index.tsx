import { createFileRoute } from "@tanstack/react-router";
import { OrdersScreen } from "@/features/shop";

export const Route = createFileRoute("/shop/orders/")({
  component: OrdersScreen,
});
