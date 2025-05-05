"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { syncFormSchema } from "@/app/(protected)/sync/sync-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateSync } from "@/features/sync/use-update-sync";
import { toast } from "sonner";

interface CalendarUrlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalendarUrlModal({
  open,
  onOpenChange,
}: CalendarUrlModalProps) {
  const form = useForm<z.infer<typeof syncFormSchema>>({
    resolver: zodResolver(syncFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const mutation = useUpdateSync();

  const onSubmit = (values: z.infer<typeof syncFormSchema>) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Calendar URL updated successfully");
        onOpenChange(false);
        form.reset();
      },
      onError: () => {
        toast.error("Failed to update calendar URL");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Calendar URL</DialogTitle>
          <DialogDescription>
            Enter your UM Learn calendar URL to update your schedule
          </DialogDescription>
        </DialogHeader>
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
              Update Calendar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
