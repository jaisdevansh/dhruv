"use client";

import { useEffect, useState, useRef } from "react";
import { m as motion, LazyMotion, domAnimation, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { usePortfolio } from "@/components/providers/portfolio-context";
const title1 = "FINE ART";
const title2 = "EXHIBITION";

export function Hero() {
  const { artistName } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D tilt effect on the background and grid
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth movement
  const springX = useSpring(mouseX, { damping: 50, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 150 });

  // Map mouse positions to tilt values
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const translateX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  // Glow position mapping
  const glowX = useTransform(springX, [-0.5, 0.5], ["30%", "70%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["30%", "70%"]);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized coordinates (-0.5 to 0.5)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Framer Motion Animation Variants for character reveal
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.6,
      },
    },
  };

  const charVariants = {
    hidden: { y: "100%", rotateX: 45 },
    visible: {
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const, // Custom easeOutExpo
      },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={containerRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[var(--color-background)]"
      >
      {/* 3D Parallax Background Card */}
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 md:inset-8 z-0 rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.01] to-white/[0.03] border border-white/[0.03] transition-shadow duration-300"
      >
        {/* Spot/Glow following cursor */}
        <motion.div
          style={{
            left: glowX,
            top: glowY,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-10"
        />

        {/* Ambient background artwork via Cloudinary for massive performance boost */}
        <CldImage
          src="portfolio/hero-bg"
          alt="Ambient background artwork"
          fill
          priority
          sizes="100vw"
          format="auto"
          quality="auto"
          className="object-cover mix-blend-luminosity opacity-[0.15] scale-105 select-none pointer-events-none"
        />

        {/* Fine grid pattern layer */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />
      </motion.div>

      {/* Typography Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 text-center select-none pointer-events-none">
        {/* Subtitle tag */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-xs font-sans tracking-[0.4em] text-[var(--color-accent)] uppercase mb-6"
        >
          FINE ART BY {artistName.toUpperCase()}
        </motion.span>

        {/* Heading 1: FINE ART */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tighter text-[var(--color-foreground)] uppercase leading-none flex flex-wrap justify-center overflow-hidden"
          style={{ perspective: 1000 }}
        >
          {title1.split("").map((char, index) => (
            <span key={index} className="inline-block overflow-hidden">
              <motion.span
                variants={charVariants}
                className="inline-block origin-bottom"
                style={{ display: char === " " ? "inline" : "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Heading 2: EXHIBITION */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tighter text-[var(--color-accent)] uppercase leading-none flex flex-wrap justify-center overflow-hidden mt-2"
          style={{ perspective: 1000 }}
        >
          {title2.split("").map((char, index) => (
            <span key={index} className="inline-block overflow-hidden">
              <motion.span
                variants={charVariants}
                className="inline-block origin-bottom"
                style={{ display: char === " " ? "inline" : "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Dynamic scroll text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6, ease: "easeOut" }}
          className="mt-10 text-xs md:text-sm tracking-[0.25em] uppercase text-[var(--color-muted)] max-w-md font-sans leading-relaxed pointer-events-auto"
        >
          Exploring the friction between urban raw decay and ethereal modern synthesis.
        </motion.p>
      </div>

      {/* Floating coordinates or visual details for gallery texture */}
      <div className="absolute bottom-8 left-8 hidden md:block text-[var(--color-muted)] font-sans text-[10px] tracking-[0.3em] uppercase opacity-50 select-none">
        LAT: 18.9220° N / LON: 72.8347° E
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 right-8 flex items-center gap-4 select-none cursor-pointer"
        onClick={() => {
          document.getElementById("works")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-[var(--color-muted)] text-[10px] tracking-[0.3em] uppercase hover:text-[var(--color-accent)] transition-colors duration-300">
          Scroll Down
        </span>
        <div className="w-12 h-[1px] bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-1/2 h-full bg-[var(--color-accent)]"
          />
        </div>
      </motion.div>
      </section>
    </LazyMotion>
  );
}

