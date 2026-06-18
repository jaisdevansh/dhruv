"use client";

import { useState, useEffect } from "react";
import { m as motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { Magnetic } from "@/components/ui/magnetic";
import { usePortfolio } from "@/components/providers/portfolio-context";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { artistName } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          scrolled 
            ? "py-4 bg-[#030303]/75 backdrop-blur-lg border-b border-white/[0.05]" 
            : "py-8 bg-transparent"
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo / Brand Name */}
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "#")}
            className="text-lg md:text-xl font-heading font-black tracking-[0.25em] text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors duration-300 uppercase"
          >
            {artistName}<span className="text-[var(--color-accent)]">.</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="relative text-xs font-sans font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors duration-300 group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle button */}
          <div className="md:hidden">
            <Magnetic strength={20}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#030303]/95 backdrop-blur-2xl md:hidden flex flex-col justify-center px-12"
          >
            <nav className="flex flex-col gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-4xl font-heading font-bold uppercase tracking-[0.1em] text-[var(--color-muted)] hover:text-[var(--color-accent)] active:text-[var(--color-accent)] transition-colors duration-300 block"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </nav>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-12 left-12 flex gap-6 text-[var(--color-muted)] uppercase tracking-wider text-xs font-sans"
            >
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors duration-300">Instagram</a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors duration-300">ArtStation</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
