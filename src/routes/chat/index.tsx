import { createFileRoute } from "@tanstack/react-router";
import { ChatList } from "@/features/account";

export const Route = createFileRoute("/chat/")({
  component: ChatList,
});
