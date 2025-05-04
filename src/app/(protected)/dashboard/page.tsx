import { CalendarDisplay } from "@/components/calendar";

import { getUser } from "@/hooks/get-user";
import { redirect } from "next/navigation";

export default async function Page() {
  const data = await getUser();

  if (!data) {
    redirect("/sign-in");
  }
  return (
    <div className="flex w-full h-[480px] md:h-[600px] lg:h-[800px] px-4 items-center justify-center">
      <CalendarDisplay />
    </div>
  );
}
