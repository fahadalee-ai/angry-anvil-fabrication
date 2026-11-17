import { createFileRoute } from "@tanstack/react-router";
import { ProductDetail } from "@/features/shop";

export const Route = createFileRoute("/shop/product/$productId")({
  component: function Page() {
    const { productId } = Route.useParams();
    return <ProductDetail productId={productId} />;
  },
});
