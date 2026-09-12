import type { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "usage",
    question: "How do you plan to use Higgsfield?",
    helper: "Helps us set up the right workspace for you",
    ambient: "ambient-warm",
    options: [
      {
        value: "personal",
        label: "For personal use",
        description: "For your own projects, at your own pace",
      },
      {
        value: "team",
        label: "For my team/organization",
        description: "For teams that create and ship together",
      },
    ],
  },
  {
    id: "goal",
    question: "What do you want to achieve with Higgsfield?",
    helper: "We'll tailor features and AI tools to your goals",
    ambient: "ambient-cool",
    options: [
      { value: "avatars", label: "Create avatars & product visuals" },
      { value: "films", label: "Cinematic visuals & AI films" },
      { value: "exploring", label: "Just exploring" },
      { value: "marketing", label: "High-converting marketing" },
      { value: "ugc", label: "Viral content & UGC videos" },
      {
        value: "automation",
        label: "Automate workflows with Supercomputer & MCP/CLI",
      },
    ],
  },
];

export const defaultReturnTo = "/";
