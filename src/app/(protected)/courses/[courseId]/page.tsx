interface Props {
  params: Promise<{
    courseId: string;
  }>;
}
import { getUser } from "@/hooks/get-user";
import { redirect } from "next/navigation";

export default async function Page({ params }: Props) {
  const data = await getUser();

  if (!data) {
    redirect("/sign-in");
  }

  const { courseId } = await params;

  return (
    <div className="flex w-full h-[480px] md:h-[600px] lg:h-[800px] px-4 items-center justify-center">
      <h1 className="text-2xl font-bold">Assignments for: {courseId}</h1>
    </div>
  );
}
