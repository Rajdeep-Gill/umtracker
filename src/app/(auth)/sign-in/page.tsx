import { Card, CardContent } from "@/components/ui/card";
import { SignInForm } from "./sign-in-form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center pt-24 min-h-screen py-8 px-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Sign back in to access your account</p>
        </div>
        <Card>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
