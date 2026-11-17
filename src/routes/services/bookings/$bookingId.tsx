import { createFileRoute } from "@tanstack/react-router";
import { BookingDetail } from "@/features/services";

export const Route = createFileRoute("/services/bookings/$bookingId")({
  validateSearch: (search: Record<string, unknown>) => ({
    confirmed: search.confirmed === "1",
  }),
  component: function Page() {
    const { bookingId } = Route.useParams();
    const { confirmed } = Route.useSearch();
    return <BookingDetail bookingId={bookingId} confirmed={confirmed} />;
  },
});
