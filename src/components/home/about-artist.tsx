"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Magnetic } from "@/components/ui/magnetic";
import { CldImage } from "next-cloudinary";
import { usePortfolio } from "@/components/providers/portfolio-context";

gsap.registerPlugin(ScrollTrigger);

const paragraph2 = "Every brushstroke is a deliberate step in a larger choreography of storytelling. I aim to create pieces that don't just hang on a wall, but exist as immersive experiences.";

export function AboutArtist() {
  const { artistName } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const paragraph1 = `I am ${artistName}, a Fine Arts student exploring the intersection of traditional mediums and contemporary narratives. My work delves deep into the human psyche, capturing ephemeral moments of urban decay and ethereal silence.`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split-word highlighting scroll animation
      const words = textContainerRef.current?.querySelectorAll(".scroll-word");
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: "top 75%",
              end: "bottom 55%",
              scrub: true,
            },
          }
        );
      }

      // Parallax zoom scroll on image
      gsap.fromTo(
        imageRef.current,
        { scale: 1.15, filter: "grayscale(1) brightness(0.6)" },
        {
          scale: 1,
          filter: "grayscale(0.1) brightness(0.9)",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [artistName]);

  return (
    <section 
      id="about"
      ref={containerRef}
      className="py-32 px-6 md:px-12 lg:px-24 bg-[var(--color-surface)] relative overflow-hidden border-b border-white/[0.03]"
    >
      {/* Decorative vertical divider line */}
      <div className="absolute top-0 right-[15%] w-[1px] h-full bg-white/[0.02] hidden lg:block" />

      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-32 relative z-10">
        
        {/* Left: Interactive Image container */}
        <div className="w-full lg:w-1/2 aspect-[4/5] relative overflow-hidden rounded-2xl border border-white/[0.05] group">
          <div ref={imageRef} className="absolute inset-0 w-full h-full">
            <CldImage
              src="portfolio/about-bg"
              alt="Artist studio painting workspace"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              format="auto"
              quality="auto"
              className="object-cover transition-transform duration-[1.5s]"
            />
          </div>
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/90 via-transparent to-transparent opacity-60 z-10" />
          
          <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1.5 font-sans uppercase">
            <span className="text-[10px] tracking-[0.25em] text-[var(--color-accent)] font-bold">CREATIVE VISION</span>
            <span className="text-xs text-white tracking-widest font-medium">BFA candidate / visual artist</span>
          </div>
        </div>

        {/* Right: Splitted highlighted text details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <span className="text-xs font-sans tracking-[0.3em] text-[var(--color-accent)] uppercase mb-6 block font-bold">
            ABOUT THE ARTIST
          </span>
          <h3 className="text-3xl md:text-5xl font-heading font-black text-white leading-tight mb-8 uppercase tracking-tighter">
            TRANSFORMING EMOTION <br />
            INTO VISUAL <span className="text-[var(--color-accent)]">POETRY.</span>
          </h3>

          <div 
            ref={textContainerRef}
            className="text-lg md:text-xl font-sans text-[var(--color-foreground)] leading-relaxed mb-12 space-y-6"
          >
            <p className="flex flex-wrap">
              {paragraph1.split(" ").map((word, index) => (
                <span 
                  key={index} 
                  className="scroll-word mr-1.5 inline-block"
                >
                  {word}
                </span>
              ))}
            </p>
            <p className="flex flex-wrap">
              {paragraph2.split(" ").map((word, index) => (
                <span 
                  key={index} 
                  className="scroll-word mr-1.5 inline-block"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>
          
          {/* Inquiry Button */}
          <div className="flex">
            <Magnetic strength={25}>
              <a 
                href="mailto:contact@dhruv.art?subject=Discovering Vision" 
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#030303] hover:bg-[var(--color-accent)] hover:text-[#030303] font-sans font-bold text-sm tracking-widest uppercase rounded-full transition-all duration-300 shadow-lg"
              >
                Discover My Vision
              </a>
            </Magnetic>
          </div>
        </div>

      </div>
    </section>
  );
}
