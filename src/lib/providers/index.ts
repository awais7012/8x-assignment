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
}: {
  prompt: string;
  refImageUrl?: string | null;
  seed: number;
  timeoutMs?: number;
}): Promise<ProviderResult> {
  const signal = AbortSignal.timeout(timeoutMs);

  const attempts: (() => Promise<ProviderResult>)[] = [];
  if (!refImageUrl && process.env.GEMINI_API_KEY) {
    attempts.push(() => generateWithGemini({ prompt, signal }));
  }
  attempts.push(() =>
    generateWithPollinations({ prompt, refImageUrl, seed, signal }),
  );

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new ProviderError("Every image provider failed.", "unknown");
}
