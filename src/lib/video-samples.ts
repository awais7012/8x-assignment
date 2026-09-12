import type { ArtVariant } from "@/components/ui/ArtPanel";

/*
 * There is no free, no-signup, reliable text-to-video API. Pollinations' public
 * API documents image/text/audio only - its /video path returns an image, which
 * was verified rather than assumed. So video resolves to a curated sample,
 * labelled in the UI. Disclosed simulation, not a silent fake.
 */
export const SAMPLE_DISCLOSURE =
  "Sample output — live video generation runs on limited free capacity.";

export type VideoCategory = "portrait" | "product" | "landscape" | "action";

const RULES: { category: VideoCategory; pattern: RegExp }[] = [
  {
    category: "portrait",
    pattern: /\b(portrait|face|person|people|woman|man|character|selfie|headshot|avatar)\b/i,
  },
  {
    category: "product",
    pattern: /\b(product|bottle|shoe|packaging|unbox|device|gadget|logo|brand|advert)\b/i,
  },
  {
    category: "landscape",
    pattern: /\b(landscape|mountain|ocean|sea|forest|city|street|sky|sunset|sunrise|nature|rain|alley)\b/i,
  },
  {
    category: "action",
    pattern: /\b(action|run|running|jump|dance|drive|driving|chase|sport|fly|flying|motion)\b/i,
  },
];

export function categorizePrompt(prompt: string): VideoCategory {
  for (const rule of RULES) {
    if (rule.pattern.test(prompt)) return rule.category;
  }
  return "action";
}

export const SAMPLE_ART: Record<VideoCategory, ArtVariant> = {
  portrait: "portrait",
  product: "product",
  landscape: "film",
  action: "reel",
};

export const SAMPLE_CAPTION: Record<VideoCategory, string> = {
  portrait: "Portrait sample",
  product: "Product sample",
  landscape: "Landscape sample",
  action: "Action sample",
};
