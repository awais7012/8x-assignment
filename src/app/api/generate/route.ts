import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getViewer } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  DEMO_LIMITS,
  imageSampleForPrompt,
  videoSampleForSubmission,
} from "@/lib/demo-media";
import { toGenerationDTO } from "@/lib/serialize";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  type: z.enum(["image", "video"]),
  prompt: z.string().trim().min(3).max(1500),
});

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json(
      { error: "Sign in to generate." },
      { status: 401 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Describe what you want to generate (at least 3 characters)." },
      { status: 400 },
    );
  }

  const { type, prompt } = parsed.data;
  const submissionCount = await prisma.generation.count({
    where: {
      userId: viewer.id,
      type,
      provider: "demo-local",
      status: "complete",
    },
  });
  const submissionLimit = DEMO_LIMITS[type];
  if (submissionCount >= submissionLimit) {
    return NextResponse.json(
      {
        error: `Demo limit reached: up to ${submissionLimit} ${type} submissions.`,
        submissionCount,
        submissionLimit,
      },
      { status: 429, headers: { "x-request-id": requestId } },
    );
  }

  const pending = await prisma.generation.create({
    data: {
      userId: viewer.id,
      type,
      prompt,
      refImageUrl: null,
      status: "processing",
      provider: "demo-local",
      creditsCost: 0,
    },
  });

  console.info(
    JSON.stringify({
      event: "generation.started",
      requestId,
      generationId: pending.id,
      type,
    }),
  );

  try {
    const resultUrl =
      type === "image"
        ? imageSampleForPrompt(prompt)
        : videoSampleForSubmission(submissionCount);
    const generation = await prisma.generation.update({
      where: { id: pending.id },
      data: { status: "complete", provider: "demo-local", resultUrl },
    });

    console.info(
      JSON.stringify({
        event: "generation.completed",
        requestId,
        generationId: generation.id,
        type,
        provider: generation.provider,
        durationMs: Date.now() - startedAt,
      }),
    );

    return NextResponse.json(
      {
        generation: toGenerationDTO(generation),
        submissionCount: submissionCount + 1,
        submissionLimit,
        requestId,
      },
      { headers: { "x-request-id": requestId } },
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "generation.failed",
        requestId,
        generationId: pending.id,
        type,
        provider: "demo-local",
        durationMs: Date.now() - startedAt,
        errorName: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : "Unknown generation error",
      }),
    );
    const failed = await prisma.generation.update({
      where: { id: pending.id },
      data: {
        status: "failed",
        provider: "demo-local",
      },
    });

    return NextResponse.json(
      {
        generation: toGenerationDTO(failed),
        error: "Could not save this demo submission. Please try again.",
        requestId,
      },
      {
        status: 500,
        headers: { "x-request-id": requestId },
      },
    );
  }
}
