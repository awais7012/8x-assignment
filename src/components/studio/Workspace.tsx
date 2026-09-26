"use client";

import { useState } from "react";
import { DEMO_LIMITS } from "@/lib/demo-media";
import type { GenerationDTO } from "@/lib/serialize";
import { GenerationResult } from "./GenerationResult";
import { HistoryGrid } from "./HistoryGrid";
import { PromptComposer } from "./PromptComposer";
import { WorkspaceTabs } from "./WorkspaceTabs";

export function Workspace({
  type,
  initialGenerations,
  initialPrompt = "",
  placeholder,
  starterPrompts,
}: {
  type: "image" | "video";
  initialGenerations: GenerationDTO[];
  initialPrompt?: string;
  placeholder: string;
  starterPrompts: string[] | null;
}) {
  const [generations, setGenerations] = useState(initialGenerations);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submissionLimit = DEMO_LIMITS[type];
  const submissionCount = generations.filter(
    (generation) =>
      generation.type === type &&
      generation.provider === "demo-local" &&
      generation.status === "complete",
  ).length;
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
        body: JSON.stringify({ type, prompt: trimmed }),
      });

      const body = await response.json().catch(() => ({}));

      if (body.generation) {
        const generation = body.generation as GenerationDTO;
        setGenerations((previous) => [
          generation,
          ...previous.filter((item) => item.id !== generation.id),
        ]);
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
              ? "Local image samples for your demo submission. No external generation or credits."
              : "Local video samples for your demo submission. No external generation or credits."}
          </p>
        </div>
        <WorkspaceTabs active={type} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <PromptComposer
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={generate}
            busy={busy}
            submissionCount={submissionCount}
            submissionLimit={submissionLimit}
            placeholder={placeholder}
            starterPrompts={starterPrompts}
            error={error}
          />
          <GenerationResult
            generation={latest}
            busy={busy}
            onRetry={generate}
          />
        </div>

        <aside className="space-y-4">
          <section aria-labelledby="history-heading">
            <h2
              id="history-heading"
              className="mb-3 text-sm font-semibold tracking-tight"
            >
              History
            </h2>
            <HistoryGrid
              generations={generations}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
