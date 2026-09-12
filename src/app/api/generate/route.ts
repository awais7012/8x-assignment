import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getViewer } from "@/lib/auth";
import { CREDIT_COST } from "@/lib/costs";
import { prisma } from "@/lib/db";
import { ProviderError, generateImage } from "@/lib/providers";
import { toGenerationDTO } from "@/lib/serialize";
import { SAMPLE_DISCLOSURE } from "@/lib/video-samples";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  type: z.enum(["image", "video"]),
  prompt: z.string().trim().min(3).max(1500),
  refImageUrl: z
    .string()
    .trim()
    .max(2000)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "Reference image must be an http(s) URL.",
    })
    .optional()
    .nullable(),
});

export async function POST(request: NextRequest) {
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
  const refImageUrl = parsed.data.refImageUrl || null;
  const creditsCost = CREDIT_COST[type];

  if (viewer.creditsBalance < creditsCost) {
    return NextResponse.json(
      { error: "Not enough credits for this generation." },
      { status: 402 },
    );
  }

  const pending = await prisma.generation.create({
    data: {
      userId: viewer.id,
      type,
      prompt,
      refImageUrl,
      status: "processing",
      provider: "pending",
      creditsCost,
    },
  });

  try {
    // Image goes through the provider chain. Video has no reliable free
    // provider, so it resolves to a disclosed sample in the same shape.
    const result =
      type === "image"
        ? await generateImage({
            prompt,
            refImageUrl,
            seed: Math.floor(Math.random() * 1_000_000_000),
          })
        : { provider: "sample", url: null };

    const [generation] = await prisma.$transaction([
      prisma.generation.update({
        where: { id: pending.id },
        data: {
          status: "complete",
          provider: result.provider,
          resultUrl: result.url,
        },
      }),
      prisma.user.update({
        where: { id: viewer.id },
        data: { creditsBalance: { decrement: creditsCost } },
      }),
    ]);

    return NextResponse.json({
      generation: toGenerationDTO(generation),
      creditsBalance: viewer.creditsBalance - creditsCost,
      disclosure: type === "video" ? SAMPLE_DISCLOSURE : null,
    });
  } catch (error) {
    const quota = error instanceof ProviderError && error.quota;
    const failed = await prisma.generation.update({
      where: { id: pending.id },
      data: {
        status: quota ? "quota_exceeded" : "failed",
        provider: error instanceof ProviderError ? error.provider : "unknown",
      },
    });

    return NextResponse.json(
      {
        generation: toGenerationDTO(failed),
        error:
          error instanceof Error
            ? error.message
            : "Generation failed. Please try again.",
      },
      { status: quota ? 429 : 502 },
    );
  }
}
