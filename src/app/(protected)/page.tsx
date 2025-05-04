import { redirect } from "next/navigation";
import { getUser } from "@/hooks/get-user";

export default async function Page() {
  const data = await getUser();

  if (!data) {
    redirect("/sign-in");
  }

  const { user, session } = data;

  return (
    <div className="flex w-full h-[480px] md:h-[600px] lg:h-[800px] px-4 items-center justify-center">
      <div>Welcome {user.name}</div>
      <div>{JSON.stringify(session, null, 2)}</div>
    </div>
  );
}
