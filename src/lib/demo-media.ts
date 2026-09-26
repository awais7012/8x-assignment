const IMAGE_SAMPLES = [
  "/art/hero-genjutsu.jpg",
  "/art/promo-landscape.jpg",
  "/art/hero-motion.jpg",
  "/art/hero-effects.jpg",
] as const;

export const VIDEO_SAMPLES = [
  "/videos/feature-2.mp4",
  "/videos/feature-3.mp4",
] as const;

export const DEMO_LIMITS = {
  image: 4,
  video: 2,
} as const;

export function imageSampleForPrompt(prompt: string) {
  const hash = Array.from(prompt).reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
  return IMAGE_SAMPLES[hash % IMAGE_SAMPLES.length];
}

export function videoSampleForSubmission(submissionIndex: number) {
  return VIDEO_SAMPLES[submissionIndex % VIDEO_SAMPLES.length];
}