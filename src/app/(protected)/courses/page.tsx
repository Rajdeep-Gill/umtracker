import { getUser } from "@/app/hooks/get-user";
import { redirect } from "next/navigation";
import { CourseDashboard } from "./course-dashboard";

export default async function Page() {
  const data = await getUser();

  if (!data) {
    redirect("/sign-in");
  }

  // TODO: Fetch all courses and add a button to redirect to each course page
  return <CourseDashboard />;
}
