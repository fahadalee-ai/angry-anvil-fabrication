import { createFileRoute } from "@tanstack/react-router";
import { CommunityHub } from "@/features/account";

export const Route = createFileRoute("/profile/community")({
  component: CommunityHub,
});
