import { Navbar } from "@/components/layout/Navbar";
import { AuthNotConfigured } from "@/components/auth/AuthNotConfigured";
import { QuizFlow } from "@/components/quiz/QuizFlow";
import { clerkEnabled, getViewer } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = { title: "Set up your workspace" };

export default async function QuizPage() {
  if (!clerkEnabled) return <AuthNotConfigured />;

  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");

  const profile = await prisma.userProfile.findUnique({
    where: { userId: viewer.id },
  });

  return (
    <>
      <Navbar variant="marketing" />
      <main id="main">
        <QuizFlow
          initialUsage={profile?.usageContext}
          initialGoal={profile?.goal}
        />
      </main>
    </>
  );
}
