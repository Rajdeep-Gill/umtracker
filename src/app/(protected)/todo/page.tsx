import { getUser } from "@/app/hooks/get-user";
import { redirect } from "next/navigation";

export default async function Page() {
  const data = await getUser();

  if (!data) {
    redirect("/sign-in");
  }

  // TODO: Once the events are imported, allow the user to check/uncheck them here
  return (
    <div className="flex w-full h-[480px] md:h-[600px] lg:h-[800px] px-4 items-center justify-center">
      <h1 className="text-2xl font-bold">Todo</h1>
    </div>
  );
}
