"use client";

import React, { createContext, useContext, useState } from "react";
import {
  updateArtistName,
  updateAccentColor,
  addDbArtwork,
  editDbArtwork,
  deleteDbArtwork,
  getPortfolioData,
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



interface InitialData {
  artistName: string;
  accentColor: string;
  artworks: Artwork[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: InitialData;
}) {
  const [artistName, setArtistNameState] = useState(
    initialData?.artistName ?? "Dhruv Chaurasia"
  );
  const [accentColor, setAccentColorState] = useState(
    initialData?.accentColor ?? "#D4AF37"
  );
  const [artworks, setArtworksState] = useState<Artwork[]>(
    initialData?.artworks ?? []
  );

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
        artistName,
        accentColor,
        artworks,
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
