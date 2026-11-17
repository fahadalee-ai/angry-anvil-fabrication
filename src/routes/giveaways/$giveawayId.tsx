import { createFileRoute } from "@tanstack/react-router";
import { GiveawayDetail } from "@/features/community";

export const Route = createFileRoute("/giveaways/$giveawayId")({
  component: function Page() {
    const { giveawayId } = Route.useParams();
    return <GiveawayDetail id={giveawayId} />;
  },
});
