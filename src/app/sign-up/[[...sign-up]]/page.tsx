import { SignUp } from "@clerk/nextjs";
import { AuthNotConfigured } from "@/components/auth/AuthNotConfigured";
import { clerkEnabled } from "@/lib/auth";

export default function SignUpPage() {
  if (!clerkEnabled) return <AuthNotConfigured />;

  return (
    <main
      id="main"
      className="flex min-h-dvh items-center justify-center px-4 py-16"
    >
      <SignUp />
    </main>
  );
}
