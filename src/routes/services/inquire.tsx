import { createFileRoute } from "@tanstack/react-router";
import { InquireScreen } from "@/features/services";

export const Route = createFileRoute("/services/inquire")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  component: function Page() {
    const { service } = Route.useSearch();
    return <InquireScreen serviceId={service} />;
  },
});
