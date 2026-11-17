import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetail } from "@/features/community";

export const Route = createFileRoute("/gallery/$projectId")({
  component: function Page() {
    const { projectId } = Route.useParams();
    return <ProjectDetail id={projectId} />;
  },
});
