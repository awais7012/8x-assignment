import {
  Clapperboard,
  Film,
  ImageIcon,
  Sparkles,
  Terminal,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import type { FeatureCard, HeroCard, PromoPanel } from "./types";

export const heroCards: HeroCard[] = [
  {
    id: "motion-designer",
    title: "Higgsfield AI Motion Designer",
    description: "ChatGPT can now do motion design in After Effects.",
    art: "motion",
    href: "/chatgpt-plugin",
  },
  {
    id: "effects",
    title: "Higgsfield Effects",
    description: "Viral video presets now in ChatGPT, with free generations.",
    art: "effects",
    badge: { text: "Free trial", tone: "free" },
    href: "/effects",
  },
  {
    id: "genjutsu",
    title: "Higgsfield Genjutsu",
    description: "One upload in. Endless new visions out.",
    art: "genjutsu",
    badge: { text: "New", tone: "new" },
    href: "/ai/video?model=genjutsu",
  },
];

export const promo: PromoPanel = {
  title: "Sign up and get your extra discount",
  benefits: [
    "Get unlimited Nano Banana Pro",
    "Unlock your extra discount",
    "Access to Seedance 2.5",
  ],
  cta: "Sign up and get your discount",
};

const icons: Record<string, LucideIcon> = {
  video: Clapperboard,
  image: ImageIcon,
  wand: Wand2,
  terminal: Terminal,
  film: Film,
  sparkles: Sparkles,
};

export const featureCards: FeatureCard[] = [
  {
    id: "seedance",
    title: "Seedance 2.5",
    description: "The most advanced video model",
    icon: icons.video,
    art: "seedance",
    badge: { text: "Top", tone: "top" },
    href: "/ai/video",
  },
  {
    id: "nano-banana",
    title: "Nano Banana Pro",
    description: "Generate high-quality visuals",
    icon: icons.image,
    art: "nano",
    href: "/ai/image",
  },
  {
    id: "genjutsu",
    title: "Higgsfield Genjutsu",
    description: "One video, many versions",
    icon: icons.wand,
    art: "genjutsu",
    badge: { text: "New", tone: "new" },
    href: "/ai/video?model=genjutsu",
  },
  {
    id: "mcp",
    title: "MCP & CLI",
    description: "Turn Claude into a creative engine",
    icon: icons.terminal,
    art: "agent",
    href: "/mcp",
  },
  {
    id: "cinema-studio",
    title: "Cinema Studio 4.0",
    description: "Create cinematic scenes effortlessly",
    icon: icons.film,
    art: "cinema",
    href: "/cinema-studio",
  },
  {
    id: "supercomputer",
    title: "Supercomputer",
    description: "Agent powered by GPT-6 Astra",
    icon: icons.sparkles,
    art: "agent",
    href: "/supercomputer",
  },
];
