import { createFileRoute } from "@tanstack/react-router";
import { CoursesHome } from "@/features/courses";

export const Route = createFileRoute("/courses/")({
  component: CoursesHome,
});
