import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center pt-24 min-h-screen py-8 px-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to UM-Tracker!
          </h1>
          <p className="text-gray-600">
            Sign up to start tracking your tasks and projects with ease.
          </p>
        </div>
        <Card>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
