import { put } from "@vercel/blob";
import { ProviderError, type ProviderResult } from "./types";

/*
 * Gemini returns image bytes inline, so they have to be persisted somewhere.
 * Vercel Blob when a token is configured; otherwise a data URL in Postgres,
 * which works everywhere but is heavier - fine for a demo, called out in the UI.
 */
async function persistInlineImage(
  data: string,
  mimeType: string,
  signal: AbortSignal,
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return `data:${mimeType};base64,${data}`;

  const bytes = Buffer.from(data, "base64");
  const blob = await put(`generated/${crypto.randomUUID()}.png`, bytes, {
    access: "public",
    contentType: mimeType,
    token,
    abortSignal: signal,
  });
  return blob.url;
}

export async function generateWithGemini({
  prompt,
  signal,
}: {
  prompt: string;
  signal: AbortSignal;
}): Promise<ProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ProviderError("GEMINI_API_KEY is not set.", "gemini");
  }

  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image-preview";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
      signal,
    });
  } catch (error) {
    throw new ProviderError(
      `Gemini request failed: ${(error as Error).message}`,
      "gemini",
    );
  }

  if (response.status === 429) {
    throw new ProviderError(
      "Gemini's free-tier quota is exhausted for this project.",
      "gemini",
      true,
    );
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new ProviderError(
      `Gemini returned HTTP ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`,
      "gemini",
    );
  }

  const json = (await response.json()) as {
    candidates?: { content?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] } }[];
  };

  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part?.inlineData?.data) {
    throw new ProviderError("Gemini returned no image data.", "gemini");
  }

  const mimeType = part.inlineData.mimeType || "image/png";
  const url = await persistInlineImage(part.inlineData.data, mimeType, signal);

  return { provider: `gemini:${model}`, url };
}
