"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export function VideoPreview({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent<HTMLDivElement>) => {
    const rect = currentTarget.getBoundingClientRect();
    const xOffset = clientX - (rect.left + rect.width / 2);
    const yOffset = clientY - (rect.top + rect.height / 2);

    if (isHovering && sectionRef.current && contentRef.current) {
      gsap.to(sectionRef.current, {
        x: xOffset * 0.8,
        y: yOffset * 0.8,
        rotationY: xOffset / 3,
        rotationX: -yOffset / 3,
        transformPerspective: 600,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(contentRef.current, {
        x: -xOffset * 0.4,
        y: -yOffset * 0.4,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  useEffect(() => {
    if (!isHovering && sectionRef.current && contentRef.current) {
      gsap.to(sectionRef.current, {
        x: 0,
        y: 0,
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [isHovering]);

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`absolute z-50 size-full overflow-hidden rounded-2xl ${className}`}
      style={{ perspective: "600px" }}
    >
      <div
        ref={contentRef}
        className="origin-center rounded-2xl size-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}

export default VideoPreview;
