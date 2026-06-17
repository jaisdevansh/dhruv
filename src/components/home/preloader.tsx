"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { usePortfolio } from "@/components/providers/portfolio-context";

export function Preloader() {
  const { artistName } = usePortfolio();
  const [progress, setProgress] = useState(0);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentProgress = 0;
    let speed = 100;
    let timeoutId: NodeJS.Timeout;

    const animateExit = () => {
      const tl = gsap.timeline();
      tl.to(textRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power4.inOut",
      })
      .to(progressRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.6")
      .to(preloaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
      }, "-=0.2")
      .set(preloaderRef.current, { display: "none" });
    };

    const tick = () => {
      currentProgress += Math.floor(Math.random() * 12) + 6;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        animateExit();
      } else {
        setProgress(currentProgress);
        timeoutId = setTimeout(tick, speed);
      }
    };

    timeoutId = setTimeout(tick, speed);

    const handleLoad = () => {
      speed = 15; // Accelerate load progress once everything is ready
    };

    if (document.readyState === "complete") {
      speed = 15;
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background)]"
    >
      <div className="overflow-hidden">
        <h1 
          ref={textRef}
          className="text-4xl md:text-6xl font-bold tracking-widest text-[var(--color-accent)] font-heading uppercase"
        >
          {artistName}
        </h1>
      </div>
      
      <div 
        ref={progressRef}
        className="mt-8 flex flex-col items-center w-64"
      >
        <div className="w-full h-[1px] bg-[var(--color-surface)] relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[var(--color-accent)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 text-[var(--color-muted)] font-sans text-sm tracking-widest">
          {progress}%
        </div>
      </div>
    </div>
  );
}
