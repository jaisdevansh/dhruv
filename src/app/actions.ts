"use server";

import { prisma } from "@/lib/prisma";
import { Artwork } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

const defaultArtworks = [
  {
    title: "Ethereal Silence",
    medium: "Oil on Canvas",
    image: "/images/artwork1.jpg",
    year: "2024",
    dimensions: "36 x 48 inches",
    location: "Mumbai Gallery",
    description: "Captures a landscape of total quietude, using detailed oil layering to create soft light transitions. The composition invites the viewer to reflect on transient spaces."
  },
  {
    title: "Urban Decay",
    medium: "Charcoal & Acrylic",
    image: "/images/artwork2.jpg",
    year: "2023",
    dimensions: "40 x 40 inches",
    location: "Studio Collection",
    description: "An intense exploration of texture and contrast, depicting architectural structures crumbling into abstraction. Charcoal is layered with raw acrylic gestures."
  },
  {
    title: "Neon Synthesis",
    medium: "Digital Art / Giclée",
    image: "/images/artwork3.jpg",
    year: "2024",
    dimensions: "30 x 45 inches",
    location: "Digital Archives",
    description: "A hybrid piece synthesizing classical geometry with vibrant cyberpunk colors, representing a digital playground of floating light spheres."
  },
  {
    title: "Primal Shadows",
    medium: "Mixed Media & Gold Leaf",
    image: "/images/artwork4.jpg",
    year: "2023",
    dimensions: "24 x 36 inches",
    location: "Private Collector (Delhi)",
    description: "Using raw pigments, gold leaf, and structural gels, this artwork is an organic dance of light and shadow, reminding us of nature's primal forces."
  },
  {
    title: "Architectural Mirage",
    medium: "Giclée on Archival Paper",
    image: "/images/artwork5.jpg",
    year: "2024",
    dimensions: "36 x 36 inches",
    location: "London Exhibition Hall",
    description: "A spatial illusion where architecture meets floating mirages, rendering depth and reflection with detailed vector precision."
  },
];

export async function getPortfolioData() {
  try {
    // 1. Fetch Config
    let config = await prisma.portfolioConfig.findUnique({
      where: { id: 1 }
    });

    if (!config) {
      config = await prisma.portfolioConfig.create({
        data: {
          id: 1,
          artistName: "Dhruv Chaurasia",
          accentColor: "#D4AF37",
        }
      });
    }

    // 2. Fetch Artworks
    let artworks = await prisma.artwork.findMany({
      orderBy: { createdAt: "asc" }
    });

    // 3. Seed default artworks if empty
    if (artworks.length === 0) {
      await prisma.artwork.createMany({
        data: defaultArtworks
      });
      artworks = await prisma.artwork.findMany({
        orderBy: { createdAt: "asc" }
      });
    }

    return {
      artistName: config.artistName,
      accentColor: config.accentColor,
      artworks: artworks.map((w: Artwork) => ({
        id: w.id,
        title: w.title,
        medium: w.medium,
        image: w.image,
        year: w.year,
        dimensions: w.dimensions,
        location: w.location,
        description: w.description
      }))
    };
  } catch (error) {
    console.error("Error fetching portfolio data from DB:", error);
    // Return defaults as fallback if DB isn't initialized yet
    return {
      artistName: "Dhruv Chaurasia",
      accentColor: "#D4AF37",
      artworks: []
    };
  }
}

export async function updateArtistName(name: string) {
  try {
    await prisma.portfolioConfig.upsert({
      where: { id: 1 },
      update: { artistName: name },
      create: { id: 1, artistName: name }
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update artist name:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateAccentColor(color: string) {
  try {
    await prisma.portfolioConfig.upsert({
      where: { id: 1 },
      update: { accentColor: color },
      create: { id: 1, accentColor: color }
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update accent color:", error);
    return { success: false, error: String(error) };
  }
}

export async function addDbArtwork(artwork: {
  title: string;
  medium: string;
  image: string;
  year: string;
  dimensions: string;
  location: string;
  description: string;
}) {
  try {
    await prisma.artwork.create({
      data: {
        title: artwork.title,
        medium: artwork.medium,
        image: artwork.image,
        year: artwork.year,
        dimensions: artwork.dimensions,
        location: artwork.location,
        description: artwork.description
      }
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to add artwork:", error);
    return { success: false, error: String(error) };
  }
}

export async function editDbArtwork(id: number, data: {
  title?: string;
  medium?: string;
  image?: string;
  year?: string;
  dimensions?: string;
  location?: string;
  description?: string;
}) {
  try {
    await prisma.artwork.update({
      where: { id },
      data: {
        title: data.title,
        medium: data.medium,
        image: data.image,
        year: data.year,
        dimensions: data.dimensions,
        location: data.location,
        description: data.description
      }
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to edit artwork:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteDbArtwork(id: number) {
  try {
    await prisma.artwork.delete({
      where: { id }
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete artwork:", error);
    return { success: false, error: String(error) };
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const config = await prisma.portfolioConfig.findUnique({
      where: { id: 1 }
    });
    
    // Default fallback is the hash of the ENV variable or "dhruv123"
    const defaultPass = process.env.ADMIN_PASSWORD || "dhruv123";
    const expectedHash = config?.passwordHash || hashPassword(defaultPass);
    
    return hashPassword(password) === expectedHash;
  } catch (error) {
    console.error("Error verifying admin password:", error);
    const fallbackPassword = process.env.ADMIN_PASSWORD || "dhruv123";
    return password === fallbackPassword;
  }
}

export async function changeAdminPassword(oldPassword: string, newPassword: string) {
  try {
    const config = await prisma.portfolioConfig.findUnique({
      where: { id: 1 }
    });
    
    const defaultPass = process.env.ADMIN_PASSWORD || "dhruv123";
    const currentHash = config?.passwordHash || hashPassword(defaultPass);
    
    if (hashPassword(oldPassword) !== currentHash) {
      return { success: false, error: "Incorrect current passcode." };
    }

    const newHash = hashPassword(newPassword);
    
    await prisma.portfolioConfig.upsert({
      where: { id: 1 },
      update: { passwordHash: newHash },
      create: { 
        id: 1, 
        passwordHash: newHash,
        artistName: "Dhruv Chaurasia",
        accentColor: "#D4AF37"
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to change admin password:", error);
    return { success: false, error: String(error) };
  }
}

