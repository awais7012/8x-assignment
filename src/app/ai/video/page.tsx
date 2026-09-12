import { redirect } from "next/navigation";
import { AuthNotConfigured } from "@/components/auth/AuthNotConfigured";
import { Navbar } from "@/components/layout/Navbar";
import { Workspace } from "@/components/studio/Workspace";
import { clerkEnabled, getViewer } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultsForGoal } from "@/lib/defaults";
import { toGenerationDTO } from "@/lib/serialize";

export const metadata = { title: "Video studio" };

export default async function VideoStudioPage() {
  if (!clerkEnabled) return <AuthNotConfigured />;

  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");

  const [profile, generations] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId: viewer.id } }),
    prisma.generation.findMany({
      where: { userId: viewer.id },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ]);

  const defaults = defaultsForGoal(profile?.goal);
  const isDefaultTab = defaults.tab === "video";

  return (
    <>
      <Navbar variant="studio" />
      <main id="main">
        <Workspace
          type="video"
          initialGenerations={generations.map(toGenerationDTO)}
          initialCredits={viewer.creditsBalance}
          placeholder={
            isDefaultTab
              ? defaults.placeholder
              : "Describe the shot you want to see"
          }
          starterPrompts={null}
          geminiConfigured={Boolean(process.env.GEMINI_API_KEY)}
        />
      </main>
    </>
  );
}
