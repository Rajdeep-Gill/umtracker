import { getUser } from "@/app/hooks/get-user";
import { redirect } from "next/navigation";
import { SyncForm } from "./sync-form";

export default async function SyncPage() {
  const data = await getUser();
  if (!data) {
    redirect("/sign-in");
  }

  return <SyncForm />;
}
