import { createFileRoute } from "@tanstack/react-router";
import { AddressesScreen } from "@/features/account";

export const Route = createFileRoute("/profile/addresses")({
  component: AddressesScreen,
});
