"use client";
import { useCheckSync } from "@/features/sync/use-check-sync";
import Link from "next/link";
import { Button } from "./ui/button";

export const SyncRedirectButton = () => {
  const { data: { sync } = {}, isLoading } = useCheckSync();

  if (isLoading) {
    return null;
  }

  if (sync) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      Don&apos;t see any data? Sync your calendar with UM Learn to get started.
      <Button asChild className="w-fit">
        <Link href="/sync">Sync</Link>
      </Button>
    </div>
  );
};
