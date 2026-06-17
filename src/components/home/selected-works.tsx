"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { usePortfolio, Artwork } from "@/components/providers/portfolio-context";
import { ProjectDetailsModal } from "./project-details-modal";

gsap.registerPlugin(ScrollTrigger);

export function SelectedWorks() {
  const { artworks } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [activeProject, setActiveProject] = useState<Artwork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const section = scrollSectionRef.current;
    if (!section || artworks.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const totalWidth = section.scrollWidth - window.innerWidth;
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${totalWidth}`,
            invalidateOnRefresh: true,
          }
        });

        tl.to(section, {
          x: -totalWidth,
          ease: "none",
        });

        // Sync visual progress bar
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: true,
          }
        });
      });

      // Heading animate in
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [artworks]);

  const openProjectDetails = (project: Artwork) => {
    setActiveProject(project);
    setIsModalOpen(true);
  };

  return (
    <section 
      id="works"
      ref={containerRef}
      className="relative bg-[var(--color-background)] overflow-hidden lg:h-screen lg:flex lg:flex-col lg:justify-between py-24 lg:py-0 border-b border-white/[0.03]"
    >
      {/* Top Header - Sticky layout on desktop */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 lg:pt-28 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10 lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2">
        <div>
          <span className="text-xs font-sans tracking-[0.3em] text-[var(--color-accent)] uppercase block mb-3">
            PORTFOLIO SHOWCASE
          </span>
          <h2 
            ref={headingRef}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white uppercase tracking-tighter"
          >
            SELECTED <span className="text-[var(--color-accent)]">WORKS.</span>
          </h2>
        </div>
        
        {/* Progress bar container (only visible on desktop) */}
        <div className="hidden lg:flex flex-col gap-2 w-64">
          <div className="flex justify-between text-[10px] tracking-widest text-[var(--color-muted)] uppercase">
            <span>01 / PREVIEW</span>
            <span>{artworks.length.toString().padStart(2, "0")} / END</span>
          </div>
          <div className="w-full h-[2px] bg-white/[0.08] relative overflow-hidden">
            <div 
              ref={progressRef}
              className="absolute top-0 left-0 h-full w-full bg-[var(--color-accent)] origin-left scale-x-0"
            />
          </div>
        </div>
      </div>

      {/* Horizontally scrolling gallery container */}
      <div className="relative w-full flex-1 flex items-center mt-12 lg:mt-0">
        {artworks.length === 0 ? (
          <div className="w-full text-center py-20 text-[var(--color-muted)] font-sans">
            No artworks posted yet. Visit the Admin panel to upload some!
          </div>
        ) : (
          <div 
            ref={scrollSectionRef}
            className="flex flex-col lg:flex-row gap-12 lg:gap-24 px-6 md:px-12 lg:px-48 w-full lg:w-max"
          >
            {artworks.map((work, idx) => (
              <div
                key={work.id}
                onClick={() => openProjectDetails(work)}
                className="group relative flex flex-col w-full lg:w-[480px] shrink-0 cursor-pointer"
              >
                {/* Media Container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.03]">
                  {/* Overlay layer */}
                  <div className="absolute inset-0 bg-[#030303]/0 group-hover:bg-[#030303]/30 z-10 transition-colors duration-700" />
                  
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover scale-100 group-hover:scale-105 filter blur-[0px] group-hover:blur-[1px] transition-all duration-[1.2s] ease-out"
                  />

                  {/* Floating serial tag */}
                  <div className="absolute top-6 left-6 z-20 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/[0.05]">
                    <span className="text-[10px] tracking-widest text-[var(--color-accent)] font-sans font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Title Content */}
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-white group-hover:text-[var(--color-accent)] transition-colors duration-300">
                      {work.title}
                    </h3>
                    <p className="text-[var(--color-muted)] mt-1 tracking-wider uppercase text-xs font-sans">
                      {work.medium}
                    </p>
                  </div>
                  <span className="text-sm text-[var(--color-accent)] font-sans border-b border-[var(--color-accent)]/20 pb-0.5">
                    {work.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Slide-over Modal */}
      <ProjectDetailsModal
        project={activeProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
