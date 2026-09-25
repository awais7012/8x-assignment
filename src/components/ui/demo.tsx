"use client";

import React, { useState } from "react";
import { WorksWheel, type WorksWheelItem } from "./works-wheel";

// Reference demo data — for documentation and standalone preview only
const DEMO_WORKS: WorksWheelItem[] = [
  {
    id: "demo-1",
    title: "Cyberpunk Alley",
    category: "Cinematic Film",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    previewVideo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-at-night-41589-large.mp4",
  },
  {
    id: "demo-2",
    title: "Ethereal Portrait",
    category: "Studio Avatar",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "demo-3",
    title: "Cosmic Nebula",
    category: "Sci-Fi Space",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "demo-4",
    title: "Botanical Glass",
    category: "Macro Nature",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "demo-5",
    title: "Architectural Noir",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "demo-6",
    title: "Neon Genesis",
    category: "3D Motion",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  },
];

export function WorksWheelDemo() {
  const [selected, setSelected] = useState<WorksWheelItem | null>(null);

  return (
    <div className="w-full min-h-screen bg-bg text-ink flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">WorksWheel Demo Reference</h2>
        <p className="text-sm text-muted">Standalone demo component for reference.</p>
      </div>

      <WorksWheel items={DEMO_WORKS} />

      {selected && (
        <p className="mt-4 text-xs text-muted">
          Selected: {selected.title} ({selected.category})
        </p>
      )}
    </div>
  );
}

export default WorksWheelDemo;
