import { createFileRoute } from "@tanstack/react-router";
import { LessonScreen } from "@/features/courses";

export const Route = createFileRoute("/courses/$courseId/lessons/$lessonId")({
  component: function Page() {
    const { courseId, lessonId } = Route.useParams();
    return <LessonScreen courseId={courseId} lessonId={lessonId} />;
  },
});
