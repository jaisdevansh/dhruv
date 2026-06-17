"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "@/components/ui/magnetic";
import Link from "next/link";
import { usePortfolio } from "@/components/providers/portfolio-context";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const { artistName } = usePortfolio();
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer 
      id="contact"
      ref={containerRef} 
      className="bg-[var(--color-surface)] py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden"
    >
      {/* Background visual spotlight glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.03)_0%,rgba(0,0,0,0)_75%)] pointer-events-none z-0" />

      <div className="max-w-screen-2xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
        <span className="text-xs font-sans tracking-[0.3em] text-[var(--color-accent)] uppercase block mb-4 font-bold">
          GET IN TOUCH
        </span>
        <h2 
          ref={textRef} 
          className="text-5xl md:text-8xl font-heading font-black text-white uppercase mb-12 tracking-tighter"
        >
          LET&apos;S <span className="text-[var(--color-accent)]">CREATE.</span>
        </h2>
        
        <p className="text-[var(--color-muted)] max-w-xl font-sans text-sm md:text-base leading-relaxed mb-12 uppercase tracking-wide">
          Open for commissions, gallery representation, and creative collaborations. 
          Reach out to discuss your next visionary project.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-20">
          <Magnetic strength={25}>
            <Link 
              href="mailto:contact@dhruv.art" 
              className="px-10 py-5 border border-white/20 text-white rounded-full hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[#030303] transition-all duration-350 font-sans font-bold uppercase tracking-widest text-xs inline-block"
            >
              Email Me
            </Link>
          </Magnetic>
          <Magnetic strength={25}>
            <Link 
              href="mailto:contact@dhruv.art?subject=Inquiry" 
              className="px-10 py-5 bg-[var(--color-accent)] text-[#030303] rounded-full hover:opacity-90 transition-all duration-350 font-sans font-bold uppercase tracking-widest text-xs inline-block"
            >
              Inquire Now
            </Link>
          </Magnetic>
        </div>

        {/* 'D' Monogram Admin shortcut symbol */}
        <div className="mb-14">
          <Magnetic strength={15}>
            <Link 
              href="/admin"
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center font-heading font-black text-xl text-[var(--color-accent)] bg-white/[0.02] hover:bg-[var(--color-accent)] hover:text-[#030303] hover:border-[var(--color-accent)] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0)] hover:shadow-[0_0_20px_var(--color-accent-glow)] select-none"
              aria-label="Admin Portal"
            >
              D
            </Link>
          </Magnetic>
        </div>

        {/* Footer Base Bottom */}
        <div className="w-full border-t border-white/[0.05] pt-10 flex flex-col md:flex-row justify-between items-center text-[var(--color-muted)] text-[10px] tracking-[0.25em] font-sans font-bold uppercase">
          <p>© {new Date().getFullYear()} {artistName.toUpperCase()}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 mt-6 md:mt-0">
            <Link href="#" className="hover:text-[var(--color-accent)] transition-colors duration-300">Instagram</Link>
            <Link href="#" className="hover:text-[var(--color-accent)] transition-colors duration-300">Behance</Link>
            <Link href="#" className="hover:text-[var(--color-accent)] transition-colors duration-300">ArtStation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
