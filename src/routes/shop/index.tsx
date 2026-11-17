import { createFileRoute } from "@tanstack/react-router";
import { ShopHome, parseShopSearch } from "@/features/shop";

export const Route = createFileRoute("/shop/")({
  validateSearch: parseShopSearch,
  component: function Page() {
    return <ShopHome search={Route.useSearch()} />;
  },
});
