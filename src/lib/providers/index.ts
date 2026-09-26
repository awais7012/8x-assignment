import { generateWithGemini } from "./gemini";
import { generateWithPollinations } from "./pollinations";
import { ProviderError, type ProviderResult } from "./types";

export { ProviderError } from "./types";
export type { ProviderResult } from "./types";

/*
 * Provider chain: Gemini first, Pollinations as automatic fallback. A single
 * rate-limited free tier is the biggest risk to a live demo, so the fallback is
 * the reliability feature, not a nicety.
 *
 * A reference image forces the Pollinations path because kontext is the only
 * image-to-image model in the chain.
 */
export async function generateImage({
  prompt,
  refImageUrl,
  seed,
  timeoutMs = 60_000,
  requestId,
}: {
  prompt: string;
  refImageUrl?: string | null;
  seed: number;
  timeoutMs?: number;
  requestId: string;
}): Promise<ProviderResult> {
  const deadline = Date.now() + timeoutMs;
  const attempts: {
    provider: string;
    run: (signal: AbortSignal) => Promise<ProviderResult>;
  }[] = [];
  if (!refImageUrl && process.env.GEMINI_API_KEY) {
    attempts.push({
      provider: "gemini",
      run: (signal) => generateWithGemini({ prompt, signal }),
    });
  }
  attempts.push({
    provider: "pollinations",
    run: (signal) =>
      generateWithPollinations({ prompt, refImageUrl, seed, signal }),
  });

  let lastError: unknown;
  for (const attempt of attempts) {
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) break;

    const startedAt = Date.now();
    console.info(
      JSON.stringify({
        event: "image_provider.attempt_started",
        requestId,
        provider: attempt.provider,
        hasReferenceImage: Boolean(refImageUrl),
      }),
    );
    try {
      const result = await attempt.run(AbortSignal.timeout(remainingMs));
      console.info(
        JSON.stringify({
          event: "image_provider.attempt_succeeded",
          requestId,
          provider: result.provider,
          durationMs: Date.now() - startedAt,
        }),
      );
      return result;
    } catch (error) {
      lastError = error;
      console.error(
        JSON.stringify({
          event: "image_provider.attempt_failed",
          requestId,
          provider:
            error instanceof ProviderError ? error.provider : attempt.provider,
          durationMs: Date.now() - startedAt,
          quota: error instanceof ProviderError ? error.quota : false,
          errorName: error instanceof Error ? error.name : "UnknownError",
          message: error instanceof Error ? error.message : "Unknown provider error",
        }),
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new ProviderError("Every image provider failed.", "unknown");
}
