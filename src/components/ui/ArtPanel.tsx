import { cn } from "@/lib/cn";

/*
  The reference screenshots use AI-generated photography, which we have no source
  files for. ArtPanel renders layered CSS gradients plus a grain pass at the same
  aspect ratios, so every "photo" area stays vector, themeable and swappable for a
  real <Image> later.
*/
export type ArtVariant =
  | "motion"
  | "effects"
  | "genjutsu"
  | "seedance"
  | "nano"
  | "cinema"
  | "agent"
  | "reel"
  | "portrait"
  | "product"
  | "film"
  | "ambient-warm"
  | "ambient-cool";

const recipes: Record<ArtVariant, string> = {
  motion:
    "radial-gradient(90% 80% at 18% 12%, #6d4bd6 0%, transparent 58%), radial-gradient(70% 60% at 82% 30%, #ff7a4d 0%, transparent 55%), radial-gradient(80% 90% at 60% 100%, #14213d 0%, transparent 60%), linear-gradient(160deg, #1a1030 0%, #0b0b12 100%)",
  effects:
    "radial-gradient(70% 70% at 25% 25%, #ff2e63 0%, transparent 55%), radial-gradient(60% 70% at 78% 68%, #ffb020 0%, transparent 52%), radial-gradient(90% 90% at 50% 110%, #2a0a2e 0%, transparent 62%), linear-gradient(150deg, #2a0d1f 0%, #0a0a10 100%)",
  genjutsu:
    "radial-gradient(70% 65% at 70% 22%, #34d1c4 0%, transparent 56%), radial-gradient(60% 60% at 22% 62%, #7b5cff 0%, transparent 54%), radial-gradient(100% 80% at 50% 108%, #06121c 0%, transparent 64%), linear-gradient(170deg, #0c1a24 0%, #070a10 100%)",
  seedance:
    "radial-gradient(75% 70% at 30% 18%, #2f6bff 0%, transparent 56%), radial-gradient(65% 75% at 80% 76%, #12d3a0 0%, transparent 52%), linear-gradient(155deg, #0a1430 0%, #070a12 100%)",
  nano:
    "radial-gradient(70% 70% at 32% 28%, #ffd166 0%, transparent 55%), radial-gradient(65% 65% at 74% 66%, #ff6b9a 0%, transparent 54%), linear-gradient(150deg, #2b1a12 0%, #0c0a0c 100%)",
  cinema:
    "radial-gradient(80% 70% at 22% 24%, #f0a35e 0%, transparent 54%), radial-gradient(80% 80% at 76% 74%, #35518f 0%, transparent 56%), linear-gradient(160deg, #191410 0%, #08080c 100%)",
  agent:
    "radial-gradient(70% 70% at 26% 24%, #7ee787 0%, transparent 52%), radial-gradient(70% 70% at 76% 72%, #3d6bff 0%, transparent 54%), linear-gradient(150deg, #0b1a16 0%, #06080c 100%)",
  reel:
    "radial-gradient(60% 60% at 30% 24%, #ddf752 0%, transparent 50%), radial-gradient(70% 70% at 72% 74%, #2b6b8f 0%, transparent 56%), linear-gradient(160deg, #131a1a 0%, #07090c 100%)",
  portrait:
    "radial-gradient(55% 60% at 50% 28%, #e8b48a 0%, transparent 52%), radial-gradient(90% 70% at 50% 100%, #22303c 0%, transparent 60%), linear-gradient(180deg, #1b2430 0%, #0a0d12 100%)",
  product:
    "radial-gradient(50% 50% at 42% 40%, #f4f1e8 0%, transparent 48%), radial-gradient(80% 70% at 70% 80%, #6b5cff 0%, transparent 58%), linear-gradient(170deg, #1a1726 0%, #0a0a10 100%)",
  film:
    "radial-gradient(70% 60% at 30% 30%, #c98f4a 0%, transparent 54%), radial-gradient(70% 70% at 74% 70%, #1f4b5e 0%, transparent 56%), linear-gradient(160deg, #16120e 0%, #08090c 100%)",
  "ambient-warm":
    "radial-gradient(70% 70% at 80% 10%, #7a4a2e 0%, transparent 60%), radial-gradient(60% 60% at 10% 80%, #4a2f24 0%, transparent 62%), linear-gradient(180deg, #120e0c 0%, #080908 100%)",
  "ambient-cool":
    "radial-gradient(70% 70% at 78% 12%, #1d3a52 0%, transparent 60%), radial-gradient(60% 60% at 12% 82%, #2a2350 0%, transparent 62%), linear-gradient(180deg, #0a0e14 0%, #07090c 100%)",
};

export function ArtPanel({
  variant,
  className,
  dim = true,
}: {
  variant: ArtVariant;
  className?: string;
  dim?: boolean;
}) {
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: recipes[variant] }}
      />
      <div className="grain absolute inset-0 opacity-[0.14] mix-blend-overlay" />
      {dim ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
      ) : null}
    </div>
  );
}
