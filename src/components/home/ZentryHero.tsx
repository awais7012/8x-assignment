"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight, Play, Volume2, VolumeX, Wand2, Film, Clapperboard, Eye } from "lucide-react";
import { VideoPreview } from "./VideoPreview";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroVideoItem {
  id: number;
  title: string;
  category: string;
  model: string;
  src: string;
  prompt: string;
}

export const HERO_VIDEOS: HeroVideoItem[] = [
  {
    id: 1,
    title: "Cybernetic Neo-Tokyo",
    category: "Seedance 2.5 Cinema",
    model: "Seedance 2.5 Pro",
    // Original confirmed-working 21st.dev CDN — subway cinematic sequence
    src: "https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4",
    prompt: "Cinematic drone dolly through neon-lit skyscraper canyons at midnight, volumetric rain reflections, 8k anamorphic film",
  },
  {
    id: 2,
    title: "Liquid Chromatic Dynamics",
    category: "3D Motion Recasting",
    model: "Genjutsu Motion",
    // Pexels #3571264 — city time-lapse, 200 OK confirmed
    src: "https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4",
    prompt: "Hyperspeed iridescent liquid chrome splashing in zero gravity, dynamic studio lighting, Octane render 120fps",
  },
  {
    id: 3,
    title: "Astra Sky Metropolis",
    category: "AI Worldbuilder",
    model: "Nano Banana Pro",
    // Pexels #3045163 — futuristic urban, 200 OK confirmed
    src: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4",
    prompt: "Flying vehicle traffic over futuristic glass architectural pyramids at twilight, cinematic golden hour lens flare",
  },
  {
    id: 4,
    title: "Bioluminescent Astral Warp",
    category: "Neural Space Engine",
    model: "Supercomputer Astra",
    // Pexels #2278095 — neon city night, 200 OK confirmed
    src: "https://videos.pexels.com/video-files/2278095/2278095-hd_1920_1080_30fps.mp4",
    prompt: "Deep space warp tunnel with glowing cyan and gold celestial dust, macro light particles accelerating at lightspeed",
  },
];




export function ZentryHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const centerPortalRef = useRef<HTMLDivElement>(null);

  // Next video to display in the mini center portal
  const nextIndex = (currentIndex + 1) % HERO_VIDEOS.length;
  const currentItem = HERO_VIDEOS[currentIndex];
  const nextItem = HERO_VIDEOS[nextIndex];

  // Trigger video swap & smooth GSAP expansion
  const switchVideo = (targetIdx: number) => {
    if (targetIdx === currentIndex) return;

    const portal = centerPortalRef.current;
    if (portal) {
      gsap.fromTo(
        portal,
        { scale: 0.85, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }

    if (mainVideoRef.current) {
      gsap.fromTo(
        mainVideoRef.current,
        { opacity: 0.4, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }

    setCurrentIndex(targetIdx);
  };

  // GSAP ScrollTrigger clip-path morph effect
  useEffect(() => {
    const videoFrame = document.getElementById("video-frame");
    if (!videoFrame) return;

    const ctx = gsap.context(() => {
      gsap.set(videoFrame, {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 30% 10%",
      });

      gsap.from(videoFrame, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: videoFrame,
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-dvh w-full overflow-x-hidden bg-bg"
    >
      {/* Main Video Frame */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-full overflow-hidden bg-surface-2"
      >
        {/* Fullscreen Background Video */}
        <video
          ref={mainVideoRef}
          key={currentItem.src}
          src={currentItem.src}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 size-full object-cover object-center transition-all duration-700"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/35 to-black/60 z-20 pointer-events-none" />

        {/* Central Interactive Mini Video Portal */}
        <div
          ref={centerPortalRef}
          className="absolute left-1/2 top-1/2 z-40 h-56 w-56 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-3xl sm:h-72 sm:w-72 border-2 border-accent/60 shadow-[0_0_50px_rgba(221,247,82,0.25)] group"
          onClick={() => switchVideo(nextIndex)}
        >
          <VideoPreview>
            <div className="relative size-full origin-center">
              <video
                key={`mini-${nextItem.src}`}
                src={nextItem.src}
                loop
                muted
                autoPlay
                playsInline
                className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Badge & Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-between p-4 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300">
                <span className="self-start rounded-full bg-accent/90 px-2.5 py-0.5 text-[10px] font-bold text-accent-ink uppercase tracking-wider">
                  Next Reel
                </span>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink shadow-xl transition-transform duration-300 group-hover:scale-115">
                    <Play size={20} className="fill-accent-ink ml-0.5" />
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-widest text-ink drop-shadow-md">
                    Click to Expand
                  </span>
                </div>

                <p className="text-[11px] font-medium text-accent truncate max-w-full">
                  {nextItem.title}
                </p>
              </div>
            </div>
          </VideoPreview>
        </div>

        {/* Big Stylized Background Watermark */}
        <h1 className="pointer-events-none absolute bottom-6 right-6 sm:right-12 z-30 text-5xl sm:text-7xl md:text-9xl lg:text-[11.5rem] font-black uppercase tracking-tighter text-white/10 select-none">
          HIGGSFIELD
        </h1>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 z-40 size-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 pointer-events-none">
          {/* Top Left Title Block */}
          <div className="mt-16 sm:mt-20 max-w-2xl pointer-events-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface/80 px-4 py-1 text-xs font-semibold text-accent tracking-[0.16em] uppercase backdrop-blur-md shadow-lg">
              <Sparkles size={13} className="animate-pulse" />
              {currentItem.category} · {currentItem.model}
            </div>

            <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[1.02] text-balance drop-shadow-xl">
              Every shot you can imagine, <br />
              <span className="text-accent underline decoration-accent/40 decoration-wavy">in one studio.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm sm:text-base text-muted/95 text-pretty leading-relaxed bg-bg/40 p-3 rounded-2xl border border-line/40 backdrop-blur-sm">
              &ldquo;{currentItem.prompt}&rdquo;
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm sm:text-base font-semibold text-accent-ink transition-all duration-200 hover:bg-accent-hover hover:scale-[1.02] shadow-[0_0_30px_rgba(221,247,82,0.3)]"
              >
                Start creating
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/ai/image?prompt=${encodeURIComponent(currentItem.prompt)}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-strong bg-surface/75 px-6 text-sm sm:text-base font-semibold text-ink backdrop-blur-md transition-colors duration-200 hover:bg-surface-2 hover:border-accent"
              >
                <Wand2 size={16} className="text-accent" />
                Generate This Style
              </Link>
            </div>
          </div>

          {/* Bottom Bar: Switcher Controls & Audio Toggle */}
          <div className="flex flex-wrap items-end justify-between gap-4 z-50 pointer-events-auto">
            {/* Direct Model Video Switcher */}
            <div className="flex items-center gap-2 rounded-full border border-line/70 bg-bg/85 p-1.5 backdrop-blur-xl">
              {HERO_VIDEOS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchVideo(idx)}
                  className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                    currentIndex === idx
                      ? "bg-accent text-accent-ink shadow-md"
                      : "text-muted hover:text-ink hover:bg-surface-2"
                  }`}
                >
                  <span className="hidden sm:inline">{item.title}</span>
                  <span className="sm:hidden">0{item.id}</span>
                </button>
              ))}
            </div>

            {/* Mute/Unmute audio control */}
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/85 text-ink backdrop-blur-md transition-colors hover:bg-surface-2 hover:border-accent"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-accent animate-pulse" />}
            </button>
          </div>
        </div>
      </div>

      {/* Background Bottom Heading for Parallax Reveal */}
      <h1 className="pointer-events-none absolute bottom-6 right-6 sm:right-12 text-5xl sm:text-7xl md:text-9xl lg:text-[11.5rem] font-black uppercase tracking-tighter text-accent/15 select-none -z-10">
        HIGGSFIELD
      </h1>
    </div>
  );
}

export default ZentryHero;
