"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getPortfolioData,
  updateArtistName,
  updateAccentColor,
  addDbArtwork,
  editDbArtwork,
  deleteDbArtwork,
} from "@/app/actions";

export interface Artwork {
  id: number;
  title: string;
  medium: string;
  image: string;
  year: string;
  dimensions: string;
  location: string;
  description: string;
}

interface PortfolioContextType {
  artistName: string;
  accentColor: string;
  artworks: Artwork[];
  setArtistName: (name: string) => Promise<void>;
  setAccentColor: (color: string) => Promise<void>;
  addArtwork: (artwork: Omit<Artwork, "id">) => Promise<void>;
  editArtwork: (id: number, artwork: Partial<Artwork>) => Promise<void>;
  deleteArtwork: (id: number) => Promise<void>;
}

const defaultArtworks: Artwork[] = [
  {
    id: 1,
    title: "Ethereal Silence",
    medium: "Oil on Canvas",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1972&auto=format&fit=crop",
    year: "2024",
    dimensions: "36 x 48 inches",
    location: "Mumbai Gallery",
    description: "Captures a landscape of total quietude, using detailed oil layering to create soft light transitions. The composition invites the viewer to reflect on transient spaces."
  },
  {
    id: 2,
    title: "Urban Decay",
    medium: "Charcoal & Acrylic",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1945&auto=format&fit=crop",
    year: "2023",
    dimensions: "40 x 40 inches",
    location: "Studio Collection",
    description: "An intense exploration of texture and contrast, depicting architectural structures crumbling into abstraction. Charcoal is layered with raw acrylic gestures."
  },
  {
    id: 3,
    title: "Neon Synthesis",
    medium: "Digital Art / Giclée",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
    year: "2024",
    dimensions: "30 x 45 inches",
    location: "Digital Archives",
    description: "A hybrid piece synthesizing classical geometry with vibrant cyberpunk colors, representing a digital playground of floating light spheres."
  },
  {
    id: 4,
    title: "Primal Shadows",
    medium: "Mixed Media & Gold Leaf",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop",
    year: "2023",
    dimensions: "24 x 36 inches",
    location: "Private Collector (Delhi)",
    description: "Using raw pigments, gold leaf, and structural gels, this artwork is an organic dance of light and shadow, reminding us of nature's primal forces."
  },
  {
    id: 5,
    title: "Architectural Mirage",
    medium: "Giclée on Archival Paper",
    image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?q=80&w=1974&auto=format&fit=crop",
    year: "2024",
    dimensions: "36 x 36 inches",
    location: "London Exhibition Hall",
    description: "A spatial illusion where architecture meets floating mirages, rendering depth and reflection with detailed vector precision."
  },
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [artistName, setArtistNameState] = useState("Dhruv Chaurasia");
  const [accentColor, setAccentColorState] = useState("#D4AF37");
  const [artworks, setArtworksState] = useState<Artwork[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from Neon Database
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPortfolioData();
        setArtistNameState(data.artistName);
        setAccentColorState(data.accentColor);
        setArtworksState(data.artworks);
      } catch (e) {
        console.error("Failed to load portfolio database data", e);
        setArtworksState(defaultArtworks);
      }
      setHydrated(true);
    };

    const frame = requestAnimationFrame(() => {
      loadData();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Update Database & Local State helper wrappers
  const setArtistName = async (name: string) => {
    setArtistNameState(name);
    const res = await updateArtistName(name);
    if (!res.success) {
      console.error("Failed to update artist name in database:", res.error);
    }
  };

  const setAccentColor = async (color: string) => {
    setAccentColorState(color);
    const res = await updateAccentColor(color);
    if (!res.success) {
      console.error("Failed to update accent color in database:", res.error);
    }
  };

  const addArtwork = async (artwork: Omit<Artwork, "id">) => {
    const res = await addDbArtwork(artwork);
    if (res.success) {
      const data = await getPortfolioData();
      setArtworksState(data.artworks);
    } else {
      console.error("Failed to add artwork to database:", res.error);
    }
  };

  const editArtwork = async (id: number, updatedFields: Partial<Artwork>) => {
    // Optimistic Update
    setArtworksState(prev => prev.map((w) => (w.id === id ? { ...w, ...updatedFields } : w)));
    const res = await editDbArtwork(id, updatedFields);
    if (!res.success) {
      console.error("Failed to edit artwork in database:", res.error);
      const data = await getPortfolioData();
      setArtworksState(data.artworks);
    }
  };

  const deleteArtwork = async (id: number) => {
    // Optimistic Update
    setArtworksState(prev => prev.filter((w) => w.id !== id));
    const res = await deleteDbArtwork(id);
    if (!res.success) {
      console.error("Failed to delete artwork in database:", res.error);
      const data = await getPortfolioData();
      setArtworksState(data.artworks);
    }
  };

  // Prevent SSR flicker by showing children with default settings, updating once hydrated
  return (
    <PortfolioContext.Provider
      value={{
        artistName: hydrated ? artistName : "Dhruv Chaurasia",
        accentColor: hydrated ? accentColor : "#D4AF37",
        artworks: hydrated ? artworks : defaultArtworks,
        setArtistName,
        setAccentColor,
        addArtwork,
        editArtwork,
        deleteArtwork,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}

export function ThemeStyles() {
  const { accentColor } = usePortfolio();

  // Helper to convert hex color to RGB opacity string
  const getGlowColor = (hex: string) => {
    let r = 212, g = 175, b = 55; // default gold
    if (hex && hex.startsWith("#")) {
      const h = hex.replace("#", "");
      if (h.length === 3) {
        r = parseInt(h[0] + h[0], 16);
        g = parseInt(h[1] + h[1], 16);
        b = parseInt(h[2] + h[2], 16);
      } else if (h.length === 6) {
        r = parseInt(h.substring(0, 2), 16);
        g = parseInt(h.substring(2, 4), 16);
        b = parseInt(h.substring(4, 6), 16);
      }
    }
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };

  const glowColor = getGlowColor(accentColor);

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        :root {
          --theme-accent: ${accentColor} !important;
          --theme-accent-glow: ${glowColor} !important;
        }
      `
    }} />
  );
}
