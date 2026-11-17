import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/features/services";

export const Route = createFileRoute("/services/$serviceId")({
  component: function Page() {
    const { serviceId } = Route.useParams();
    return <ServiceDetail serviceId={serviceId} />;
  },
});
