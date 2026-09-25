"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import { VideoPreview } from "./VideoPreview";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_VIDEOS = 4;

export function ZentryHero() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextVdRef = useRef<HTMLVideoElement>(null);
  const currentVdRef = useRef<HTMLVideoElement>(null);
  const bgVdRef = useRef<HTMLVideoElement>(null);

  // Handle mini-video click to expand into main video
  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % TOTAL_VIDEOS) + 1);
  };

  // GSAP animation for video swap expansion
  useEffect(() => {
    if (!hasClicked) return;

    gsap.set("#next-video", { visibility: "visible" });

    gsap.to("#next-video", {
      transformOrigin: "center center",
      scale: 1,
      width: "100%",
      height: "100%",
      duration: 1,
      ease: "power2.inOut",
      onStart: () => {
        if (nextVdRef.current) {
          nextVdRef.current.play().catch(() => {});
        }
      },
    });

    gsap.from("#current-video", {
      transformOrigin: "center center",
      scale: 0.3,
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [currentIndex, hasClicked]);

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

  const getVideoSrc = (index: number) => `/videos/hero-${index}.mp4`;

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
        <div>
          {/* Central Interactive Mini Video Portal */}
          <div className="absolute left-1/2 top-1/2 z-50 h-52 w-52 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-2xl sm:h-64 sm:w-64 border border-accent/40 shadow-2xl shadow-accent/20 group">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="relative size-full origin-center transition-all duration-500 ease-out hover:scale-105"
              >
                <video
                  ref={currentVdRef}
                  src={getVideoSrc((currentIndex % TOTAL_VIDEOS) + 1)}
                  loop
                  muted
                  autoPlay
                  playsInline
                  id="current-video"
                  className="size-full object-cover object-center"
                />

                {/* Overlay badge on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg transition-transform group-hover:scale-110">
                    <Play size={20} className="fill-accent-ink ml-0.5" />
                  </div>
                  <span className="mt-2 text-[11px] font-bold tracking-widest uppercase text-ink">
                    Click to Expand
                  </span>
                </div>
              </div>
            </VideoPreview>
          </div>

          {/* Next Video (expands on click) */}
          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted={isMuted}
            playsInline
            id="next-video"
            className="invisible absolute left-1/2 top-1/2 z-20 h-64 w-64 -translate-x-1/2 -translate-y-1/2 object-cover object-center"
          />

          {/* Background Video */}
          <video
            ref={bgVdRef}
            src={getVideoSrc(currentIndex === TOTAL_VIDEOS ? 1 : currentIndex)}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute left-0 top-0 size-full object-cover object-center"
          />

          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-black/50 z-30 pointer-events-none" />
        </div>

        {/* Big Stylized Background Watermark */}
        <h1 className="pointer-events-none absolute bottom-5 right-5 sm:right-10 z-40 text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-ink/20 select-none">
          HIGGSFIELD
        </h1>

        {/* Hero Content Overlay */}
        <div className="absolute left-0 top-0 z-40 size-full flex flex-col justify-between p-6 sm:p-12 lg:p-16">
          <div className="mt-16 sm:mt-20 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/70 px-3.5 py-1 text-xs font-semibold text-accent tracking-[0.14em] uppercase backdrop-blur-md">
              <Sparkles size={13} />
              AI Video &amp; Image Studio
            </div>

            <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[1.02] text-balance">
              Every shot you can imagine, <br />
              <span className="text-accent">in one studio.</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm sm:text-base text-muted/90 text-pretty leading-relaxed">
              Generate cinematic clips, high-converting product visual assets, and recast motion from any reference video in real-time.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm sm:text-base font-semibold text-accent-ink transition-all duration-200 hover:bg-accent-hover hover:scale-[1.02] shadow-lg shadow-accent/20"
              >
                Start creating
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/ai/video"
                className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong bg-surface/60 px-6 text-sm sm:text-base font-semibold text-ink backdrop-blur-md transition-colors duration-200 hover:bg-surface-2 hover:border-accent/40"
              >
                Open the studio
              </Link>
            </div>
          </div>

          {/* Bottom Bar Controls & Video Switcher */}
          <div className="flex items-center justify-between z-50">
            {/* Active video pill indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setHasClicked(true);
                    setCurrentIndex(index);
                  }}
                  aria-label={`Switch to video ${index}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "w-8 bg-accent"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Mute/Unmute audio control */}
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/70 text-ink backdrop-blur-md transition-colors hover:bg-surface-2"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-accent" />}
            </button>
          </div>
        </div>
      </div>

      {/* Background Bottom Heading for Parallax Reveal */}
      <h1 className="pointer-events-none absolute bottom-5 right-5 sm:right-10 text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-accent/15 select-none -z-10">
        HIGGSFIELD
      </h1>
    </div>
  );
}

export default ZentryHero;
