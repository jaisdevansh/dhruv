"use client";

import { useEffect, useState } from "react";
import { usePortfolio } from "@/components/providers/portfolio-context";

export function Preloader() {
  const { artistName } = usePortfolio();
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    let speed = 100;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      currentProgress += Math.floor(Math.random() * 12) + 6;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setIsLoaded(true);
        setTimeout(() => setIsHidden(true), 1200); // Wait for exit animation
      } else {
        setProgress(currentProgress);
        timeoutId = setTimeout(tick, speed);
      }
    };

    timeoutId = setTimeout(tick, speed);

    const handleLoad = () => {
      speed = 15;
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

  if (isHidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-background)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isLoaded ? "-translate-y-full delay-200" : ""}`}
    >
      <div className="overflow-hidden">
        <h1 
          className={`text-4xl md:text-6xl font-bold tracking-widest text-[var(--color-accent)] font-heading uppercase transition-all duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isLoaded ? "-translate-y-[50px] opacity-0" : ""}`}
        >
          {artistName}
        </h1>
      </div>
      
      <div 
        className={`mt-8 flex flex-col items-center w-64 transition-opacity duration-500 ${isLoaded ? "opacity-0" : "opacity-100"}`}
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
