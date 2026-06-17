"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Frame, Maximize2, MapPin } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  medium: string;
  image: string;
  year: string;
  dimensions?: string;
  location?: string;
  description?: string;
}

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Details Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-2xl bg-[#070707]/90 backdrop-blur-xl border-l border-white/[0.05] shadow-2xl flex flex-col h-full overflow-hidden"
          >
            {/* Header: Close button and controls */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/[0.05]">
              <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase text-[var(--color-accent)]">
                Project Showcase / Artworks
              </span>
              <Magnetic strength={20}>
                <button
                  onClick={onClose}
                  className="p-3 bg-white/[0.03] hover:bg-white/[0.08] text-white rounded-full transition-colors duration-300"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </Magnetic>
            </div>

            {/* Scrollable details container */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
              {/* Main Image Frame */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.05]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              {/* Title & Medium */}
              <div>
                <span className="text-sm font-sans tracking-widest text-[var(--color-accent)] block mb-1">
                  {project.year}
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight">
                  {project.title}
                </h2>
                <div className="h-[2px] w-20 bg-[var(--color-accent)] mt-4 mb-2" />
                <p className="text-[var(--color-muted)] text-base font-sans tracking-wider uppercase mt-2">
                  {project.medium}
                </p>
              </div>

              {/* Metadata Attributes List */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.05] py-6 my-6 text-sm font-sans">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/[0.03] text-[var(--color-accent)] rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Year Created</p>
                    <p className="font-semibold text-white mt-0.5">{project.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/[0.03] text-[var(--color-accent)] rounded-lg">
                    <Frame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Medium / Style</p>
                    <p className="font-semibold text-white mt-0.5">{project.medium}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/[0.03] text-[var(--color-accent)] rounded-lg">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Dimensions</p>
                    <p className="font-semibold text-white mt-0.5">{project.dimensions || "30 x 40 inches"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/[0.03] text-[var(--color-accent)] rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider">Current Location</p>
                    <p className="font-semibold text-white mt-0.5">{project.location || "Artist Studio (Mumbai)"}</p>
                  </div>
                </div>
              </div>

              {/* Description context */}
              <div className="space-y-4 text-base font-sans text-[var(--color-muted)] leading-relaxed">
                <p>
                  {project.description || 
                    "This artwork explores the subtle intersection of urban decay and emotional resilience. Created over several months of research, the piece utilizes contrasting visual elements to reflect the complex inner dialogue between raw architecture and the digital psyche."}
                </p>
                <p>
                  The textured layering creates a sense of tactile realism, encouraging viewers to stand at various distances to perceive the details. Part of the solo exhibition series capturing modern transitions.
                </p>
              </div>
            </div>

            {/* Sticky footer inquiry panel */}
            <div className="p-6 md:p-8 bg-[#040404]/90 border-t border-white/[0.05] flex gap-4">
              <a
                href={`mailto:contact@dhruv.art?subject=Inquiry regarding "${project.title}"`}
                className="flex-1 py-4 bg-[var(--color-accent)] text-[#030303] font-bold text-center rounded-xl hover:opacity-90 active:scale-95 transition-all duration-300"
              >
                Inquire About Purchase
              </a>
              <button
                onClick={onClose}
                className="px-6 py-4 bg-white/[0.03] text-white border border-white/[0.05] font-semibold rounded-xl hover:bg-white/[0.08] active:scale-95 transition-all duration-300"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
