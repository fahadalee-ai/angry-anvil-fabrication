import { createFileRoute } from "@tanstack/react-router";
import { CourseDetail } from "@/features/courses";

export const Route = createFileRoute("/courses/$courseId/")({
  component: function Page() {
    const { courseId } = Route.useParams();
    return <CourseDetail courseId={courseId} />;
  },
});
