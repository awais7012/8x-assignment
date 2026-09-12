import { ProviderError, type ProviderResult } from "./types";

const BASE = "https://image.pollinations.ai/prompt";

/*
 * No key, no signup. Anonymous access is limited to roughly one request every
 * 15 seconds, so a 429 is an expected outcome rather than an exceptional one -
 * it is surfaced as a quota error so the UI can say so plainly.
 *
 * The returned URL is lazy: without a fixed `seed` the service regenerates a
 * different image on every fetch, so callers must pass a stable seed or the
 * stored result would change under the user.
 */
export async function generateWithPollinations({
  prompt,
  refImageUrl,
  seed,
  signal,
}: {
  prompt: string;
  refImageUrl?: string | null;
  seed: number;
  signal: AbortSignal;
}): Promise<ProviderResult> {
  const params = new URLSearchParams({
    width: "1024",
    height: "1024",
    nologo: "true",
    seed: String(seed),
  });

  if (refImageUrl) {
    // kontext is Pollinations' image-to-image model.
    params.set("model", "kontext");
    params.set("image", refImageUrl);
  } else if (process.env.POLLINATIONS_IMAGE_MODEL) {
    params.set("model", process.env.POLLINATIONS_IMAGE_MODEL);
  }

  const url = `${BASE}/${encodeURIComponent(prompt)}?${params.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    throw new ProviderError(
      `Pollinations request failed: ${(error as Error).message}`,
      "pollinations",
    );
  }

  if (response.status === 429) {
    throw new ProviderError(
      "Pollinations is rate limiting anonymous requests (about one every 15 seconds).",
      "pollinations",
      true,
    );
  }
  if (!response.ok) {
    throw new ProviderError(
      `Pollinations returned HTTP ${response.status}.`,
      "pollinations",
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new ProviderError(
      `Pollinations returned ${contentType || "no content type"} instead of an image.`,
      "pollinations",
    );
  }

  // The URL alone proves nothing; pull the bytes so a failure is caught here
  // rather than by an <img> tag in front of the user.
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength < 1024) {
    throw new ProviderError("Pollinations returned an empty image.", "pollinations");
  }

  return { provider: "pollinations", url };
}
