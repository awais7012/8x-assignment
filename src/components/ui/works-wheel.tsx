"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Sparkles, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  id: string;
  title: string;
  category?: string;
  prompt?: string;
  image: string;
  previewVideo?: string;
  badge?: string;
}

/*
 * TODO: Swap in real generation thumbnails from dev DB /api/history post-launch.
 * Curated high-aesthetic AI-style outputs representing the Higgsfield Studio capabilities.
 */
export const SAMPLE_GENERATIONS: WorksWheelItem[] = [
  {
    id: "sample-1",
    title: "Neon Rain Samurai",
    category: "Cinematic Film",
    prompt: "A cybernetic ronin standing under glowing holographic rainfall, 35mm anamorphic lens, ray tracing, cinematic atmosphere",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    previewVideo: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-at-night-41589-large.mp4",
    badge: "Video · 4 cr",
  },
  {
    id: "sample-2",
    title: "Ethereal Porcelain Muse",
    category: "Studio Avatar",
    prompt: "Haute couture studio portrait of a woman with delicate gold leaf accents, porcelain texture, soft dramatic Rembrandt lighting",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    badge: "Image · 1 cr",
  },
  {
    id: "sample-3",
    title: "Bioluminescent Abyssal Flora",
    category: "Macro Nature",
    prompt: "Deep sea glowing crystalline plant with glowing spores, macro lens, hyperdetailed, 8k resolution, organic luminescence",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80",
    previewVideo: "https://assets.mixkit.co/videos/preview/mixkit-bright-light-particles-in-motion-41885-large.mp4",
    badge: "Video · 4 cr",
  },
  {
    id: "sample-4",
    title: "Cosmic Nebula Portal",
    category: "Sci-Fi Space",
    prompt: "An interstellar rift swirling with stardust and violet auroras, cinematic lighting, ultra-realistic celestial photography",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    badge: "Image · 1 cr",
  },
  {
    id: "sample-5",
    title: "Minimalist Architectural Noir",
    category: "Architecture",
    prompt: "Brutalist concrete villa overlooking misty Nordic pine forest at twilight, volumetric lighting, architectural digest cover",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    badge: "Image · 1 cr",
  },
  {
    id: "sample-6",
    title: "Iridescent Fluid Dynamic",
    category: "3D Motion",
    prompt: "Hyper-glossy chromatic ribbons suspended in gravity-free chamber, soft studio reflections, Octane render 8k",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    previewVideo: "https://assets.mixkit.co/videos/preview/mixkit-colorful-liquid-motion-in-slow-motion-42624-large.mp4",
    badge: "Video · 4 cr",
  },
  {
    id: "sample-7",
    title: "Solarpunk Greenhouse Metropolis",
    category: "Environment Concept",
    prompt: "Futuristic vertical gardens wrapped around solar glass skyscrapers, golden hour sunbeams, atmospheric haze",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    badge: "Image · 1 cr",
  },
  {
    id: "sample-8",
    title: "Obsidian Luxury Fragrance",
    category: "Product Shot",
    prompt: "Matte black geometric perfume bottle resting on raw travertine marble with delicate water ripples, high key studio rim light",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
    badge: "Image · 1 cr",
  },
];

interface WorksWheelProps {
  items?: WorksWheelItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function WorksWheel({
  items = SAMPLE_GENERATIONS,
  title = "Explore what's possible",
  subtitle = "Drag to rotate the studio gallery. Click any style to generate.",
  className,
}: WorksWheelProps) {
  const router = useRouter();

  // Safe Clerk auth state lookup
  let isSignedIn = false;
  try {
    const clerkUser = useUser();
    isSignedIn = Boolean(clerkUser?.isSignedIn);
  } catch {
    isSignedIn = false;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(1000);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Drag bookkeeping
  const dragRef = useRef({
    startX: 0,
    startRotation: 0,
    moved: false,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
  });

  const animFrameRef = useRef<number | null>(null);

  // ResizeObserver for dynamic scaling
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setStageWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const totalItems = items.length;
  const angleStep = 360 / totalItems;

  // Responsive metric calculation based on stage width
  const isMobile = stageWidth < 768;
  const isSmallMobile = stageWidth < 480;

  const cardWidth = isSmallMobile ? 220 : isMobile ? 260 : Math.min(320, stageWidth * 0.28);
  const cardHeight = isSmallMobile ? 310 : isMobile ? 360 : 440;

  // Cylinder radius formula: R = (cardWidth / 2) / tan(PI / totalItems) + padding
  const baseRadius = Math.round(
    (cardWidth / 2) / Math.tan(Math.PI / totalItems)
  );
  const radius = Math.max(isSmallMobile ? 280 : isMobile ? 360 : 480, baseRadius * (isMobile ? 1.05 : 1.15));

  // Friction & momentum physics
  const stopMomentum = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const applyMomentum = useCallback(() => {
    let vel = dragRef.current.velocity;
    const friction = 0.92;
    const minVel = 0.05;

    const step = () => {
      if (Math.abs(vel) > minVel) {
        vel *= friction;
        setRotation((prev) => prev + vel);
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    stopMomentum();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startRotation: rotation,
      moved: false,
      velocity: 0,
      lastX: e.clientX,
      lastTime: performance.now(),
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragRef.current.startX;
    if (Math.abs(deltaX) > 4) {
      dragRef.current.moved = true;
    }

    const now = performance.now();
    const dt = Math.max(1, now - dragRef.current.lastTime);
    const dx = e.clientX - dragRef.current.lastX;
    dragRef.current.velocity = (dx / dt) * 8;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastTime = now;

    // Sensitivity factor
    const sensitivity = isMobile ? 0.35 : 0.22;
    setRotation(dragRef.current.startRotation + deltaX * sensitivity);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    applyMomentum();
  };

  // Wheel scroll interaction
  const handleWheel = (e: React.WheelEvent) => {
    stopMomentum();
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    setRotation((prev) => prev - delta * 0.12);
  };

  // Click card handler (auth gated navigation, prevents action if dragged)
  const handleCardClick = (item: WorksWheelItem) => {
    if (dragRef.current.moved) return;

    if (isSignedIn) {
      router.push(`/ai/image?prompt=${encodeURIComponent(item.prompt || item.title)}`);
    } else {
      router.push("/sign-up");
    }
  };

  // Step rotation controls
  const rotatePrev = () => {
    stopMomentum();
    setRotation((prev) => prev + angleStep);
  };

  const rotateNext = () => {
    stopMomentum();
    setRotation((prev) => prev - angleStep);
  };

  return (
    <section
      ref={containerRef}
      aria-label={title}
      className={cn(
        "relative w-full overflow-hidden select-none py-12 sm:py-20 flex flex-col items-center justify-center min-h-[82vh] lg:min-h-[90vh]",
        className
      )}
      onWheel={handleWheel}
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40 -z-10"
      >
        <div className="h-[380px] w-[600px] rounded-full bg-accent/15 blur-[120px]" />
      </div>

      {/* Header section */}
      <div className="text-center px-4 max-w-2xl mx-auto mb-8 sm:mb-12">
        <p className="animate-fade text-[13px] font-medium tracking-[0.14em] text-accent uppercase">
          Studio Showcase
        </p>
        <h2 className="animate-rise mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-ink text-balance">
          {title}
        </h2>
        <p className="animate-rise mt-3 text-sm sm:text-base text-muted text-pretty">
          {subtitle}
        </p>
      </div>

      {/* 3D Wheel Stage */}
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative w-full max-w-[1440px] flex items-center justify-center touch-none cursor-grab active:cursor-grabbing",
          "h-[380px] sm:h-[480px] lg:h-[540px]"
        )}
        style={{
          perspective: `${Math.max(900, radius * 2.2)}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* 3D Cylinder Container */}
        <div
          className="relative h-full w-full flex items-center justify-center transition-transform duration-75 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
          }}
        >
          {items.map((item, index) => {
            const itemAngle = angleStep * index;
            // Normalized angle relative to viewer front (0 deg)
            const normalizedRot = ((rotation % 360) + 360) % 360;
            const diffAngle = Math.abs(((itemAngle + normalizedRot + 180) % 360) - 180);
            const isFront = diffAngle < angleStep * 0.75;
            const opacity = Math.max(0.28, Math.cos((diffAngle * Math.PI) / 180));
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={`Create style: ${item.title}`}
                onClick={() => handleCardClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(item);
                  }
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "absolute overflow-hidden rounded-panel border transition-all duration-300 group cursor-pointer",
                  isFront
                    ? "border-accent/40 shadow-2xl shadow-accent/10"
                    : "border-line bg-surface/60 hover:border-line-strong",
                  "bg-surface/85 backdrop-blur-md"
                )}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  opacity: isHovered ? 1 : opacity,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Media Container */}
                <div className="relative h-full w-full overflow-hidden">
                  {isHovered && item.previewVideo ? (
                    <video
                      src={item.previewVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover transition-transform duration-500 scale-105"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                  {/* Top badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                    {item.badge ? (
                      <span className="rounded-full bg-bg/80 border border-line px-2.5 py-1 text-[11px] font-semibold text-accent tracking-wide uppercase backdrop-blur-md">
                        {item.badge}
                      </span>
                    ) : null}
                    {item.previewVideo ? (
                      <span className="rounded-full bg-bg/70 border border-line p-1.5 text-muted backdrop-blur-md">
                        <Play size={12} className="fill-muted" />
                      </span>
                    ) : null}
                  </div>

                  {/* Bottom info panel */}
                  <div className="absolute bottom-0 inset-x-0 p-4 z-10 text-left space-y-1.5">
                    {item.category ? (
                      <p className="text-[11px] font-medium tracking-wider text-accent uppercase">
                        {item.category}
                      </p>
                    ) : null}
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-ink line-clamp-1">
                      {item.title}
                    </h3>
                    {item.prompt ? (
                      <p className="text-[12px] text-muted line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    ) : null}

                    <div className="pt-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-accent group-hover:text-accent-hover transition-colors">
                        <Sparkles size={13} />
                        Generate with style
                      </span>
                      <span className="text-[11px] text-dim group-hover:text-muted transition-colors">
                        {isSignedIn ? "Open Studio →" : "Sign up →"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls and Drag Hint */}
      <div className="mt-8 flex items-center justify-center gap-4 z-20">
        <button
          type="button"
          onClick={rotatePrev}
          aria-label="Previous style"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/80 text-ink transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-none"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="text-xs text-dim tracking-wide px-3 py-1 rounded-full border border-line/60 bg-surface/40">
          Drag horizontally or use arrows to spin
        </p>

        <button
          type="button"
          onClick={rotateNext}
          aria-label="Next style"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/80 text-ink transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:outline-none"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

export default WorksWheel;
