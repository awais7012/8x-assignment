import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getViewer } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isGoalKey } from "@/lib/defaults";

export const runtime = "nodejs";

const bodySchema = z.object({
  usageContext: z.enum(["personal", "team"]),
  goal: z.string().refine(isGoalKey, { message: "Unknown goal." }),
});

export async function POST(request: NextRequest) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Answer both questions before continuing." },
      { status: 400 },
    );
  }

  const { usageContext, goal } = parsed.data;

  await prisma.userProfile.upsert({
    where: { userId: viewer.id },
    update: { usageContext, goal },
    create: { userId: viewer.id, usageContext, goal },
  });

  return NextResponse.json({ ok: true, goal });
}
