import type { NavItem } from "./types";

export const primaryNav: NavItem[] = [
  { label: "Explore", href: "/" },
  { label: "Image", href: "/ai/image" },
  { label: "Video", href: "/ai/video" },
  { label: "Audio", href: "/ai/audio" },
  { label: "MCP", href: "/mcp" },
  { label: "ChatGPT Plugin", href: "/chatgpt-plugin", badge: { text: "New", tone: "new" } },
  { label: "Genjutsu", href: "/ai/video?model=genjutsu", badge: { text: "New", tone: "new" } },
  { label: "Effects", href: "/effects", badge: { text: "Free", tone: "free" } },
  { label: "Cinema Studio", href: "/cinema-studio" },
  { label: "Marketing Studio", href: "/marketing-studio" },
  { label: "Pricing", href: "/pricing", badge: { text: "30% off", tone: "discount" } },
  { label: "Enterprise", href: "/enterprise" },
];

export const studioNavExtra: NavItem = { label: "Assets", href: "/assets" };
