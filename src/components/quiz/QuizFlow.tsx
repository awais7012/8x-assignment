"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArtPanel } from "@/components/ui/ArtPanel";
import { Button } from "@/components/ui/Button";
import { defaultsForGoal } from "@/lib/defaults";
import { quizQuestions } from "@/lib/quiz";
import { QuizOption } from "./QuizOption";
import { QuizProgress } from "./QuizProgress";

interface Answers {
  usage?: string;
  goal?: string;
}

export function QuizFlow({
  initialUsage,
  initialGoal,
}: {
  initialUsage?: string;
  initialGoal?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    usage: initialUsage,
    goal: initialGoal,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = quizQuestions[step];
  const key = question.id === "usage" ? "usage" : "goal";
  const selected = answers[key];

  async function submit(final: Answers) {
    if (!final.usage || !final.goal) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          usageContext: final.usage,
          goal: final.goal,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Could not save your answers.");
      }

      const defaults = defaultsForGoal(final.goal);
      router.push(defaults.tab === "video" ? "/ai/video" : "/ai/image");
    } catch (caught) {
      setError((caught as Error).message);
      setSubmitting(false);
    }
  }

  async function choose(value: string) {
    const next: Answers = { ...answers, [key]: value };
    setAnswers(next);

    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
      return;
    }
    await submit(next);
  }

  return (
    <div className="relative isolate mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col justify-center px-4 py-16">
      <ArtPanel
        variant={question.ambient}
        dim={false}
        className="-z-10 opacity-40"
      />

      <QuizProgress step={step} total={quizQuestions.length} />

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {question.question}
      </h1>
      <p className="mt-2 text-sm text-muted">{question.helper}</p>

      <div
        role="radiogroup"
        aria-label={question.question}
        className="mt-8 flex flex-col gap-3"
      >
        {question.options.map((option) => (
          <QuizOption
            key={option.value}
            option={option}
            selected={selected === option.value}
            disabled={submitting}
            onSelect={choose}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        {step > 0 ? (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={submitting}
          >
            Back
          </Button>
        ) : null}
        {submitting ? (
          <p className="text-sm text-muted" role="status">
            Saving your setup…
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
