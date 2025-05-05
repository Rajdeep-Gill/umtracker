import { redirect } from "next/navigation";
import { getUser } from "@/app/hooks/get-user";
import { SyncRedirectButton } from "@/components/sync-redirect-button";

export default async function Page() {
  const data = await getUser();

  if (!data) {
    redirect("/sign-in");
  }

  const { user, session } = data;

  return (
    <div className="flex w-full h-[480px] md:h-[600px] lg:h-[800px] px-4 items-center justify-center">
      <SyncRedirectButton />
    </div>
  );
}
