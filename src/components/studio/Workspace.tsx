"use client";

import { useState } from "react";
import { CREDIT_COST } from "@/lib/costs";
import type { GenerationDTO } from "@/lib/serialize";
import { CreditMeter } from "./CreditMeter";
import { GenerationResult } from "./GenerationResult";
import { HistoryGrid } from "./HistoryGrid";
import { PromptComposer } from "./PromptComposer";
import { WorkspaceTabs } from "./WorkspaceTabs";

export function Workspace({
  type,
  initialGenerations,
  initialCredits,
  placeholder,
  starterPrompts,
  geminiConfigured,
}: {
  type: "image" | "video";
  initialGenerations: GenerationDTO[];
  initialCredits: number;
  placeholder: string;
  starterPrompts: string[] | null;
  geminiConfigured: boolean;
}) {
  const [generations, setGenerations] = useState(initialGenerations);
  const [credits, setCredits] = useState(initialCredits);
  const [prompt, setPrompt] = useState("");
  const [refImageUrl, setRefImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cost = CREDIT_COST[type];
  const latest =
    generations.find(
      (generation) => generation.type === type && generation.status !== "processing",
    ) ?? null;

  async function generate() {
    const trimmed = prompt.trim();
    if (trimmed.length < 3) {
      setError("Describe what you want to generate — at least 3 characters.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          prompt: trimmed,
          refImageUrl:
            type === "image" ? refImageUrl.trim() || null : null,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (body.generation) {
        const generation = body.generation as GenerationDTO;
        setGenerations((previous) => [
          generation,
          ...previous.filter((item) => item.id !== generation.id),
        ]);
      }
      if (typeof body.creditsBalance === "number") {
        setCredits(body.creditsBalance);
      }
      if (!response.ok) {
        setError(body.error || "Generation failed. Please try again.");
      } else {
        setPrompt("");
      }
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {type === "image" ? "Image studio" : "Video studio"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {type === "image"
              ? "Text to image, with optional reference-image conditioning."
              : "Text to video. Free capacity is limited — samples are labelled."}
          </p>
        </div>
        <WorkspaceTabs active={type} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <PromptComposer
            type={type}
            prompt={prompt}
            onPromptChange={setPrompt}
            refImageUrl={refImageUrl}
            onRefImageUrlChange={setRefImageUrl}
            onSubmit={generate}
            busy={busy}
            cost={cost}
            placeholder={placeholder}
            starterPrompts={starterPrompts}
            error={error}
          />
          <GenerationResult
            generation={latest}
            busy={busy}
            geminiConfigured={geminiConfigured}
            onRetry={generate}
          />
        </div>

        <aside className="space-y-4">
          <CreditMeter credits={credits} cost={cost} />
          <section aria-labelledby="history-heading">
            <h2
              id="history-heading"
              className="mb-3 text-sm font-semibold tracking-tight"
            >
              History
            </h2>
            <HistoryGrid
              generations={generations}
              geminiConfigured={geminiConfigured}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
