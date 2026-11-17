import { createFileRoute } from "@tanstack/react-router";
import { WishlistScreen } from "@/features/shop";

export const Route = createFileRoute("/shop/wishlist")({
  component: WishlistScreen,
});
