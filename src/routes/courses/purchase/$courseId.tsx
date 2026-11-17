import { createFileRoute } from "@tanstack/react-router";
import { PurchaseScreen } from "@/features/courses";

export const Route = createFileRoute("/courses/purchase/$courseId")({
  component: function Page() {
    const { courseId } = Route.useParams();
    return <PurchaseScreen courseId={courseId} />;
  },
});
