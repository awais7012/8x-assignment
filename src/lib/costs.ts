/*
 * Credits are cosmetic (no billing wiring, per the spec's scope cuts), but the
 * cost of each request is real enough to drive the balance display.
 */
export const CREDIT_COST = {
  image: 1,
  video: 4,
} as const;

export type GenerationType = keyof typeof CREDIT_COST;

export function isGenerationType(value: unknown): value is GenerationType {
  return value === "image" || value === "video";
}
