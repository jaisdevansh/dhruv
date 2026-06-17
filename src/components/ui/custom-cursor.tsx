"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "hover" | "text">("default");
  const [cursorText, setCursorText] = useState("");
  const cursorRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 300, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    document.documentElement.classList.add("custom-cursor-active");

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    // Event listeners for custom cursor state changes
    const handleCursorChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ type: "default" | "hover" | "text"; text?: string }>;
      if (customEvent.detail) {
        setCursorType(customEvent.detail.type || "default");
        setCursorText(customEvent.detail.text || "");
      }
    };

    window.addEventListener("set-custom-cursor", handleCursorChange);

    // Hover events for buttons, links and interactives
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isLink = target.closest("a, button, [role='button'], input[type='submit']");
      if (isLink) {
        setCursorType("hover");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isLink = target.closest("a, button, [role='button'], input[type='submit']");
      if (isLink) {
        setCursorType("default");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("set-custom-cursor", handleCursorChange);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  const getVariants = () => {
    switch (cursorType) {
      case "hover":
        return {
          width: 64,
          height: 64,
          backgroundColor: "rgba(255, 255, 255, 1)",
          mixBlendMode: "difference" as const,
        };
      case "text":
        return {
          width: 88,
          height: 88,
          backgroundColor: "#D4AF37",
          border: "none",
          mixBlendMode: "normal" as const,
        };
      default:
        return {
          width: 16,
          height: 16,
          backgroundColor: "rgba(212, 175, 55, 0.4)",
          border: "1px solid #D4AF37",
          mixBlendMode: "normal" as const,
        };
    }
  };

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center text-center overflow-hidden font-heading font-bold uppercase tracking-widest text-[9px]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        color: "#030303",
      }}
      animate={getVariants()}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {cursorType === "text" && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="text-[#030303]"
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}

// Helper functions for components to control cursor
export const setCursorDefault = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("set-custom-cursor", { detail: { type: "default" } }));
  }
};

export const setCursorText = (text: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("set-custom-cursor", { detail: { type: "text", text } }));
  }
};

export const setCursorHover = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("set-custom-cursor", { detail: { type: "hover" } }));
  }
};
