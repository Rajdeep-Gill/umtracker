"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const SignInForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setIsLoading(true);
          //show loading
          toast("Logging into your account...");
        },
        onSuccess: () => {
          // redirect to the sign in page
          router.push("/");
          toast("Logged in successfully");
          setIsLoading(false);
        },
        onError: (ctx) => {
          setIsLoading(false);
          // display the error message
          toast(
            "Error creating account. Please try again." + ctx.error.message
          );
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Email</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" {...field} />
              </FormControl>
              <FormDescription>
                This is the email you will use to log in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                Enter your password to access your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
        <div className="flex items-center justify-center w-full text-sm gap-x-2">
          <p className="text-gray-600">Don&apos;t have an account?</p>
          <Button disabled={isLoading} variant="link" size="sm">
            <Link href="/sign-up" className="hover:underline">
              Sign Up
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
