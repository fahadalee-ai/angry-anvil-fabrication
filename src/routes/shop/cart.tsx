import { createFileRoute } from "@tanstack/react-router";
import { CartScreen } from "@/features/shop";

export const Route = createFileRoute("/shop/cart")({
  component: CartScreen,
});
