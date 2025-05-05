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
import { use } from "react";

export const syncFormSchema = z.object({
  url: z
    .string()
    .url("Please input the valid UM Learn calendar URL")
    .refine((val) => val.includes("universityofmanitoba.desire2learn.com")),
});

export const SyncForm = () => {
  const { data: sync, isLoading, isError } = useCheckSync();
  console.log("SYNC", sync);
  console.log("IS LOADING", isLoading);
  console.log("IS ERROR", isError);
  const router = useRouter();
  if (!isLoading && sync) {
    // Already synced, redirect to the home page
    router.push("/");
    return null; // Prevent rendering the component
  }

  const form = useForm<z.infer<typeof syncFormSchema>>({
    resolver: zodResolver(syncFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const mutation = useUpdateSync();

  const onSubmit = (values: z.infer<typeof syncFormSchema>) => {
    console.log("Syncing...");
    console.log(values);
    mutation(values.url);
  };

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
        <p className="text-sm">
          Sync Status:{" "}
          {isLoading ? "Loading..." : sync ? "Synced" : "Not Synced"}
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sync Calendar
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Don't know where to find the URL?
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
