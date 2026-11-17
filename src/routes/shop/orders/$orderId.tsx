import { createFileRoute } from "@tanstack/react-router";
import { OrderDetail } from "@/features/shop";

export const Route = createFileRoute("/shop/orders/$orderId")({
  component: function Page() {
    const { orderId } = Route.useParams();
    return <OrderDetail orderId={orderId} />;
  },
});
