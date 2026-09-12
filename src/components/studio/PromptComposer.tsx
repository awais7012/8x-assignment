"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PromptComposer({
  type,
  prompt,
  onPromptChange,
  refImageUrl,
  onRefImageUrlChange,
  onSubmit,
  busy,
  cost,
  placeholder,
  starterPrompts,
  error,
}: {
  type: "image" | "video";
  prompt: string;
  onPromptChange: (value: string) => void;
  refImageUrl: string;
  onRefImageUrlChange: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
  cost: number;
  placeholder: string;
  starterPrompts: string[] | null;
  error: string | null;
}) {
  return (
    <form
      className="rounded-panel border border-line bg-surface/60 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label
        htmlFor="prompt"
        className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase"
      >
        Prompt
      </label>
      <textarea
        id="prompt"
        name="prompt"
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        maxLength={1500}
        disabled={busy}
        className="mt-3 w-full resize-y rounded-card border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-dim focus:border-line-strong focus:outline-none disabled:opacity-60"
      />

      {type === "image" ? (
        <div className="mt-4">
          <label
            htmlFor="refImageUrl"
            className="text-[13px] font-medium text-muted"
          >
            Reference image URL{" "}
            <span className="text-dim">(optional, image-to-image)</span>
          </label>
          <input
            id="refImageUrl"
            name="refImageUrl"
            type="url"
            value={refImageUrl}
            onChange={(event) => onRefImageUrlChange(event.target.value)}
            placeholder="https://…"
            disabled={busy}
            className="mt-2 w-full rounded-card border border-line bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-dim focus:border-line-strong focus:outline-none disabled:opacity-60"
          />
        </div>
      ) : null}

      {starterPrompts?.length ? (
        <div className="mt-4">
          <p className="text-[13px] text-muted">Not sure where to start?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {starterPrompts.map((starter) => (
              <button
                key={starter}
                type="button"
                disabled={busy}
                onClick={() => onPromptChange(starter)}
                className="rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[12px] text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-60"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-[12px] text-dim">
          {type === "video"
            ? "Video resolves to a labelled sample on the free tier."
            : "Served by Gemini when configured, Pollinations otherwise."}
        </p>
        <Button
          type="submit"
          disabled={busy}
          className="shrink-0"
          aria-busy={busy}
        >
          <Sparkles aria-hidden size={16} />
          {busy ? "Generating…" : `Generate · ${cost}`}
        </Button>
      </div>
    </form>
  );
}
