import { createFileRoute } from "@tanstack/react-router";
import { ChatThread } from "@/features/account";

export const Route = createFileRoute("/chat/$threadId")({
  component: function Page() {
    const { threadId } = Route.useParams();
    return <ChatThread threadId={threadId} />;
  },
});
