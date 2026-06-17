"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const exhibitions = [
  {
    year: "2024",
    title: "Echoes of Silence",
    location: "Mumbai Art Gallery",
    description: "A solo exhibition exploring the concept of urban isolation through mixed media installations and large-scale charcoal drawings."
  },
  {
    year: "2023",
    title: "Visions of Tomorrow",
    location: "National Gallery of Modern Art, Delhi",
    description: "Group exhibition featuring emerging digital artists blending traditional Indian motifs with cyberpunk aesthetics."
  },
  {
    year: "2022",
    title: "The Raw Canvas",
    location: "Student Biennale",
    description: "First public showing of early oil paintings focusing on hyper-realistic portraiture and emotional depth."
  }
];

export function ExhibitionTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line drawing scroll animation
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: itemsContainerRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          }
        }
      );

      // Staggered reveal of timeline items
      itemsRef.current.forEach((item) => {
        if (!item) return;

        const content = item.querySelector(".timeline-content");
        const dot = item.querySelector(".timeline-dot");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          }
        });

        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
        ).fromTo(
          content,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="exhibitions"
      ref={containerRef}
      className="py-32 px-6 md:px-12 lg:px-24 bg-[var(--color-background)] relative overflow-hidden border-b border-white/[0.03]"
    >
      <div className="max-w-4xl mx-auto">
        <span className="text-xs font-sans tracking-[0.3em] text-[var(--color-accent)] uppercase block mb-3 text-center font-bold">
          JOURNEY AND EXHIBITIONS
        </span>
        <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-24 text-center uppercase tracking-tighter">
          EXHIBITION <span className="text-[var(--color-accent)]">HISTORY.</span>
        </h2>

        {/* Timeline wrapper */}
        <div ref={itemsContainerRef} className="relative ml-4 md:ml-12">
          {/* Base timeline line */}
          <div className="absolute w-[2px] bg-white/[0.03] h-full left-4 top-2 z-0" />
          
          {/* Animated scroll-drawn line */}
          <div 
            ref={lineRef}
            className="absolute w-[2px] bg-gradient-to-b from-[var(--color-accent)] to-[#8E8E93] h-full left-4 top-2 z-10 origin-top shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          />

          {/* Exhibition items */}
          {exhibitions.map((exhibition, index) => (
            <div 
              key={index} 
              ref={el => { itemsRef.current[index] = el; }}
              className="mb-20 last:mb-0 pl-12 md:pl-20 relative group"
            >
              {/* Timeline Dot with pulsing outer ring */}
              <div 
                className="timeline-dot absolute left-[9px] top-1.5 z-20 w-4 h-4 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-accent)] flex items-center justify-center transition-all duration-500 group-hover:scale-125"
              >
                <div className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full group-hover:bg-white transition-colors duration-300" />
                {/* Glowing ring overlay on hover */}
                <div className="absolute inset-0 rounded-full scale-100 group-hover:scale-[2] bg-[var(--color-accent)]/15 group-hover:opacity-100 opacity-0 transition-all duration-500" />
              </div>
              
              {/* Contents block */}
              <div className="timeline-content bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/[0.06] rounded-2xl p-6 md:p-8 transition-all duration-300 shadow-xl">
                <span className="text-xs font-sans tracking-widest text-[var(--color-accent)] font-bold mb-3 block">
                  {exhibition.year}
                </span>
                
                <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {exhibition.title}
                </h3>
                
                <p className="text-[var(--color-muted)] mb-5 text-xs font-sans font-bold uppercase tracking-wider">
                  {exhibition.location}
                </p>
                
                <p className="text-[var(--color-muted)] font-sans text-sm md:text-base leading-relaxed">
                  {exhibition.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
