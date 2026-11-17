import { createFileRoute } from "@tanstack/react-router";
import { DevotionalDetail } from "@/features/community";

export const Route = createFileRoute("/devotionals/$devotionalId")({
  component: function Page() {
    const { devotionalId } = Route.useParams();
    return <DevotionalDetail id={devotionalId} />;
  },
});
