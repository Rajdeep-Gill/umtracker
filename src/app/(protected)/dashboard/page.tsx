import { CalendarDisplay } from "@/components/calendar";

import { getUser } from "@/app/hooks/get-user";
import { redirect } from "next/navigation";

export default async function Page() {
  const data = await getUser();

  if (!data) {
    redirect("/sign-in");
  }
  return (
    <div className="flex w-full md:h-[calc(100vh-8rem)] px-4 items-center justify-center">
      <CalendarDisplay />
    </div>
  );
}
