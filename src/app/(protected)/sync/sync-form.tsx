"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCheckSync } from "@/features/sync/use-check-sync";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useUpdateSync } from "@/features/sync/use-update-sync";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const syncFormSchema = z.object({
  url: z
    .string()
    .url("Please input the valid UM Learn calendar URL")
    .refine((val) => val.includes("universityofmanitoba.desire2learn.com")),
});

export const SyncForm = () => {
  const router = useRouter();
  const { data: { sync } = {}, isLoading } = useCheckSync();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof syncFormSchema>>({
    resolver: zodResolver(syncFormSchema),
    defaultValues: {
      url: "",
    },
  });
  const mutation = useUpdateSync();

  useEffect(() => {
    if (!isLoading && sync) {
      router.push("/");
    }
  }, [isLoading, sync, router]);

  const onSubmit = (values: z.infer<typeof syncFormSchema>) => {
    setIsProcessing(true);
    mutation.mutate(values, {
      onSuccess: (data) => {
        if (typeof data === "object" && "eventsCount" in data) {
          toast.success(
            `Sync successful! Imported ${data.eventsCount} events.`
          );
        } else {
          toast.success("Sync successful!");
        }
        router.push("/");
      },
      onError: (error) => {
        console.error("Sync failed", error);
        toast.error("Sync failed: " + (error.message || "Unknown error"));
        setIsProcessing(false);
      },
    });
  };

  return isLoading ? (
    <SyncFormSkeleton />
  ) : (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Sync your UM Learn calendar
        </h1>
        <p className="text-muted-foreground">
          Enter your UM Learn calendar URL to sync your schedule
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-muted/50">
        <p className="text-sm">Sync Status: </p>
        <p className="text-sm">
          {isLoading ? "Loading..." : sync ? "Already synced" : "Not synced"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calendar URL</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="https://umlearn.ca/calendar/..."
                    {...field}
                    disabled={isProcessing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Sync Calendar"}
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Don&apos;t know where to find the URL?
        </h2>
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="space-y-2">
                <div className="relative h-[480px] w-full">
                  <Image
                    src="/step1.png"
                    alt="Step 1"
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
                <p className="text-md text-center">
                  1. Sign in to UM Learn and click the calendar dropdown on the
                  homepage
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="space-y-2">
                <div className="relative h-[480px] w-full">
                  <Image
                    src="/step2.png"
                    alt="Step 2"
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
                <p className="text-md text-center">
                  2. Click the subscribe option
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="space-y-2">
                <div className="relative h-[480px] w-full">
                  <Image
                    src="/step3.png"
                    alt="Step 3"
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
                <p className="text-sm text-center">3. Copy the Calendar URL</p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

const SyncFormSkeleton = () => {
  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Sync your UM Learn calendar
        </h1>
        <p className="text-muted-foreground">
          Enter your UM Learn calendar URL to sync your schedule
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-muted/50">
        <p className="text-sm">Sync Status: </p>
        <p className="text-sm">Loading...</p>
      </div>

      {/* Form skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-5 w-24 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded" />
        </div>
        <div className="h-10 w-full bg-muted rounded" />
      </div>

      {/* Tutorial section skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-60 bg-muted rounded" />
        <div className="h-[480px] w-full bg-muted rounded" />
      </div>
    </div>
  );
};
