interface Props {
  params: Promise<{
    courseId: string;
  }>;
}

import { getUser } from "@/app/hooks/get-user";
import { redirect } from "next/navigation";
import { AssignmentDetails } from "./assignment-card";
import { Badge } from "@/components/ui/badge";

export default async function Page({ params }: Props) {
  const data = await getUser();

  if (!data) {
    redirect("/sign-in");
  }

  const { courseId } = await params;

  return (
    <div className="py-8 space-y-8 px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Course Assignments</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Course Code:</span>
          <Badge variant="outline" className="text-sm font-medium">
            {courseId}
          </Badge>
        </div>
      </div>
      <div className="rounded-lg border bg-card">
        <div className="p-8 w-full">
          <AssignmentDetails courseCode={courseId} />
        </div>
      </div>
    </div>
  );
}
