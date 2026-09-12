import type { GenerationType } from "./costs";

/*
 * The quiz is two multiple-choice questions, so the mapping is a lookup - no
 * inference pipeline. `exploring` gets a starter gallery because a blank prompt
 * box is the main activation killer for a first-time user.
 */
export type GoalKey =
  | "avatars"
  | "films"
  | "exploring"
  | "marketing"
  | "ugc"
  | "automation";

export interface WorkspaceDefaults {
  tab: GenerationType;
  placeholder: string;
  starterPrompts: string[] | null;
}

const DEFAULTS: Record<GoalKey, WorkspaceDefaults> = {
  avatars: {
    tab: "image",
    placeholder: "A studio portrait of a ceramicist, soft rim light, 50mm",
    starterPrompts: null,
  },
  films: {
    tab: "video",
    placeholder: "A slow dolly through a rain-soaked neon alley at night",
    starterPrompts: null,
  },
  exploring: {
    tab: "image",
    placeholder: "Describe anything you want to see",
    starterPrompts: [
      "A hot air balloon over a frozen lake at dawn",
      "Isometric cutaway of a tiny recording studio",
      "Bioluminescent tide pool, macro, long exposure",
      "A 1970s library with warm afternoon light",
    ],
  },
  marketing: {
    tab: "image",
    placeholder: "A matte black bottle on travertine, hard key light, product shot",
    starterPrompts: null,
  },
  ugc: {
    tab: "video",
    placeholder: "Handheld selfie-style clip, unboxing on a kitchen counter",
    starterPrompts: null,
  },
  automation: {
    tab: "image",
    placeholder: "A flat-lay of an automatable workflow, top-down, clean",
    starterPrompts: null,
  },
};

export function defaultsForGoal(goal: string | null | undefined): WorkspaceDefaults {
  if (goal && goal in DEFAULTS) return DEFAULTS[goal as GoalKey];
  return DEFAULTS.exploring;
}

export function isGoalKey(value: unknown): value is GoalKey {
  return typeof value === "string" && value in DEFAULTS;
}
