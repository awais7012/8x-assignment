import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toGenerationDTO } from "@/lib/serialize";

export const runtime = "nodejs";

export async function GET() {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const generations = await prisma.generation.findMany({
    where: { userId: viewer.id },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return NextResponse.json({
    generations: generations.map(toGenerationDTO),
    creditsBalance: viewer.creditsBalance,
  });
}
