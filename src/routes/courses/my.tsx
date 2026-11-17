import { createFileRoute } from "@tanstack/react-router";
import { MyCourses } from "@/features/courses";

export const Route = createFileRoute("/courses/my")({
  component: MyCourses,
});
