import type { LucideIcon } from "lucide-react";
import type { ArtVariant } from "@/components/ui/ArtPanel";
import type { BadgeTone } from "@/components/ui/Badge";

export interface BadgeSpec {
  text: string;
  tone: BadgeTone;
}

export interface NavItem {
  label: string;
  href: string;
  badge?: BadgeSpec;
}

export interface HeroCard {
  id: string;
  title: string;
  description: string;
  art: ArtVariant;
  badge?: BadgeSpec;
  href: string;
}

export interface PromoPanel {
  title: string;
  benefits: string[];
  cta: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  art: ArtVariant;
  badge?: BadgeSpec;
  href: string;
}

export interface QuizOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  helper: string;
  ambient: ArtVariant;
  options: QuizOption[];
}

export interface StudioModeHint {
  label: string;
}

export interface StudioMode {
  id: string;
  label: string;
  hints: StudioModeHint[];
  promptLabel: string;
  promptPlaceholder: string;
  emptyError: string;
  result: string;
}

export interface Clip {
  id: string;
  caption: string;
  art: ArtVariant;
  duration: string;
}
