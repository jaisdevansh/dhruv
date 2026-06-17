"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio, Artwork } from "@/components/providers/portfolio-context";
import Link from "next/link";
import Image from "next/image";
import { 
  Lock, 
  ChevronLeft, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Palette, 
  Check, 
  X,
  LogOut,
  FolderOpen
} from "lucide-react";

const colorPresets = [
  { name: "Obsidian Gold", hex: "#D4AF37", label: "Gold" },
  { name: "Cyberpunk Cyan", hex: "#00E5FF", label: "Cyan" },
  { name: "Electric Violet", hex: "#8F00FF", label: "Violet" },
  { name: "Crimson Ruby", hex: "#E63946", label: "Crimson" },
  { name: "Emerald Sage", hex: "#10B981", label: "Emerald" },
];

export default function AdminPage() {
  const { 
    artistName, 
    accentColor, 
    artworks, 
    setArtistName, 
    setAccentColor, 
    addArtwork, 
    editArtwork, 
    deleteArtwork 
  } = usePortfolio();

  // Authentication state
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Edit Name State
  const [nameInput, setNameInput] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

  // Edit Artworks Form States
  const [newTitle, setNewTitle] = useState("");
  const [newMedium, setNewMedium] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newDimensions, setNewDimensions] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);

  // Edit Mode state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMedium, setEditMedium] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editDimensions, setEditDimensions] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Sync state inputs once context hydrates
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setNameInput(artistName);
    });
    return () => cancelAnimationFrame(frame);
  }, [artistName]);

  // Handle Admin Authorization
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "dhruv123") {
      setIsAuthenticated(true);
      setLoginError("");
      // Persist auth state during tab session
      sessionStorage.setItem("admin_auth", "true");
    } else {
      setLoginError("Incorrect Passcode. Access Denied.");
    }
  };

  // Keep authenticated state on refresh during session
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth");
    if (isAuth === "true") {
      const frame = requestAnimationFrame(() => {
        setIsAuthenticated(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    setPasscode("");
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setArtistName(nameInput.trim());
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 3000);
    }
  };

  const handleAddArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMedium || !newImage || !newYear) return;

    addArtwork({
      title: newTitle,
      medium: newMedium,
      image: newImage,
      year: newYear,
      dimensions: newDimensions || "30 x 40 inches",
      location: newLocation || "Artist Studio",
      description: newDescription,
    });

    // Reset Form
    setNewTitle("");
    setNewMedium("");
    setNewImage("");
    setNewYear("");
    setNewDimensions("");
    setNewLocation("");
    setNewDescription("");

    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  const startEditing = (work: Artwork) => {
    setEditingId(work.id);
    setEditTitle(work.title);
    setEditMedium(work.medium);
    setEditImage(work.image);
    setEditYear(work.year);
    setEditDimensions(work.dimensions);
    setEditLocation(work.location);
    setEditDescription(work.description);
  };

  const handleSaveEdit = (id: number) => {
    editArtwork(id, {
      title: editTitle,
      medium: editMedium,
      image: editImage,
      year: editYear,
      dimensions: editDimensions,
      location: editLocation,
      description: editDescription,
    });
    setEditingId(null);
  };

  // Simple Passcode Login Screen
  if (!isAuthenticated) {
    return (
      <main className="w-full min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 relative">
        {/* Spotlights */}
        <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,var(--theme-accent-glow,rgba(212,175,55,0.06))_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />
        
        <div className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[var(--color-accent)] mb-6">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase text-[var(--color-accent)] mb-2">
            ADMIN ACCESS PORTAL
          </span>
          <h1 className="text-3xl font-heading font-black tracking-tight mb-8">
            DASHBOARD LOGIN
          </h1>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="text-left space-y-2">
              <label className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (dhruv123)"
                className="w-full px-5 py-4 bg-white/[0.02] border border-white/[0.05] rounded-xl focus:border-[var(--color-accent)] focus:outline-none transition-all duration-300 font-sans tracking-widest text-center"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-xs font-sans tracking-wide">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[var(--color-accent)] text-[#030303] rounded-xl hover:opacity-90 active:scale-95 transition-all duration-300 font-sans font-bold tracking-widest uppercase text-xs cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-8 text-xs text-zinc-500 hover:text-white transition-colors duration-300 uppercase tracking-widest font-bold font-sans"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </div>
      </main>
    );
  }

  // Authenticated Admin Dashboard Workspace
  return (
    <main className="w-full min-h-screen bg-[#030303] text-white py-24 px-6 md:px-12 lg:px-24 relative overflow-y-auto">
      {/* Background visual spotlight glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,var(--theme-accent-glow,rgba(212,175,55,0.06))_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.05] pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[var(--color-accent)] text-[#030303] text-[9px] font-black uppercase tracking-widest rounded">
                Control Console
              </span>
              <Link 
                href="/" 
                className="text-xs text-zinc-500 hover:text-[var(--color-accent)] font-bold tracking-widest uppercase font-sans transition-colors"
              >
                ← Return to Site
              </Link>
            </div>
            <h1 className="text-4xl font-heading font-black uppercase mt-3 tracking-tight">
              PORTFOLIO ADMIN PANEL
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-white/10 hover:border-red-500 hover:bg-red-500/10 text-white rounded-xl transition-all duration-300 font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Lock Out
            </button>
          </div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: General Configuration & Themes */}
          <div className="space-y-10 lg:col-span-1">
            
            {/* 1. Profile / Name Configuration */}
            <div className="bg-[#0a0a0a]/90 border border-white/[0.05] rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
                <div className="p-2 bg-white/[0.03] text-[var(--color-accent)] rounded-lg">
                  <Palette className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-heading font-bold uppercase tracking-wider text-white">
                  Artist Identity
                </h2>
              </div>

              <form onSubmit={handleSaveName} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Artist Full Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] focus:border-[var(--color-accent)] rounded-lg focus:outline-none transition-all duration-300 text-sm font-sans"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white hover:bg-[var(--color-accent)] text-[#030303] rounded-lg transition-all duration-300 font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Identity
                </button>

                {nameSaved && (
                  <p className="text-green-500 text-xs text-center font-sans tracking-wide">
                    Identity successfully saved!
                  </p>
                )}
              </form>
            </div>

            {/* 2. Theme Swapper */}
            <div className="bg-[#0a0a0a]/90 border border-white/[0.05] rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
                <div className="p-2 bg-white/[0.03] text-[var(--color-accent)] rounded-lg">
                  <Palette className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-heading font-bold uppercase tracking-wider text-white">
                  Accent Color
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-[var(--color-muted)] font-sans leading-relaxed">
                  Select a preset palette accent color. This will update the glows, timeline paths, highlights, and borders dynamically.
                </p>

                <div className="flex flex-col gap-2">
                  {colorPresets.map((preset) => {
                    const isActive = accentColor.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.name}
                        onClick={() => setAccentColor(preset.hex)}
                        className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 font-sans text-xs font-bold uppercase tracking-wider ${
                          isActive 
                            ? "bg-white/[0.04] border-[var(--color-accent)] text-white shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                            : "bg-white/[0.01] border-white/5 text-zinc-500 hover:text-white hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-4 h-4 rounded-full border border-black/40 block"
                            style={{ backgroundColor: preset.hex }}
                          />
                          {preset.name}
                        </div>
                        {isActive && <Check className="w-4 h-4 text-[var(--color-accent)]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Artworks Manager (Add & List) */}
          <div className="space-y-10 lg:col-span-2">
            
            {/* 3. Add New Artwork */}
            <div className="bg-[#0a0a0a]/90 border border-white/[0.05] rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
                <div className="p-2 bg-white/[0.03] text-[var(--color-accent)] rounded-lg">
                  <Plus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-heading font-bold uppercase tracking-wider text-white">
                  Publish Artwork
                </h2>
              </div>

              <form onSubmit={handleAddArtwork} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Whispering Winds"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] focus:border-[var(--color-accent)] rounded-lg focus:outline-none transition-all duration-300 text-sm font-sans"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={newMedium}
                    onChange={(e) => setNewMedium(e.target.value)}
                    placeholder="e.g. Oil on Canvas"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] focus:border-[var(--color-accent)] rounded-lg focus:outline-none transition-all duration-300 text-sm font-sans"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Unsplash URL or file path"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] focus:border-[var(--color-accent)] rounded-lg focus:outline-none transition-all duration-300 text-sm font-sans"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Year Created
                  </label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] focus:border-[var(--color-accent)] rounded-lg focus:outline-none transition-all duration-300 text-sm font-sans"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Dimensions (optional)
                  </label>
                  <input
                    type="text"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    placeholder="e.g. 36 x 48 inches"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] focus:border-[var(--color-accent)] rounded-lg focus:outline-none transition-all duration-300 text-sm font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Mumbai Gallery"
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] focus:border-[var(--color-accent)] rounded-lg focus:outline-none transition-all duration-300 text-sm font-sans"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Artwork Context / Description
                  </label>
                  <textarea
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe the mood, textures, and story behind this artwork..."
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] focus:border-[var(--color-accent)] rounded-lg focus:outline-none transition-all duration-300 text-sm font-sans resize-none"
                  />
                </div>

                <div className="md:col-span-2 pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[var(--color-accent)] text-[#030303] rounded-lg transition-all duration-300 font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Artwork Card
                  </button>

                  {addSuccess && (
                    <p className="text-green-500 text-xs font-sans tracking-wide">
                      Artwork successfully published!
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* 4. List and Edit Existing Artworks */}
            <div className="bg-[#0a0a0a]/90 border border-white/[0.05] rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.05] pb-4">
                <div className="p-2 bg-white/[0.03] text-[var(--color-accent)] rounded-lg">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-heading font-bold uppercase tracking-wider text-white">
                  Manage Artworks ({artworks.length})
                </h2>
              </div>

              {artworks.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-10 font-sans">
                  No artworks in portfolio. Upload works above!
                </p>
              ) : (
                <div className="space-y-6">
                  {artworks.map((work) => {
                    const isEditing = editingId === work.id;
                    return (
                      <div 
                        key={work.id}
                        className="p-5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col md:flex-row gap-5 transition-all"
                      >
                        {/* Artwork Preview Image */}
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                          <Image
                            src={isEditing ? editImage : work.image}
                            alt={work.title}
                            fill
                            sizes="96px"
                            className="object-cover"
                            unoptimized // Avoid caching errors during live admin updates
                          />
                        </div>

                        {/* Text fields / Forms */}
                        <div className="flex-1 space-y-4">
                          {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1">
                                <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Title</label>
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 focus:border-[var(--color-accent)] rounded-lg focus:outline-none text-white text-xs font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Medium</label>
                                <input
                                  type="text"
                                  value={editMedium}
                                  onChange={(e) => setEditMedium(e.target.value)}
                                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 focus:border-[var(--color-accent)] rounded-lg focus:outline-none text-white text-xs font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Image URL</label>
                                <input
                                  type="text"
                                  value={editImage}
                                  onChange={(e) => setEditImage(e.target.value)}
                                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 focus:border-[var(--color-accent)] rounded-lg focus:outline-none text-white text-xs font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Year</label>
                                <input
                                  type="text"
                                  value={editYear}
                                  onChange={(e) => setEditYear(e.target.value)}
                                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 focus:border-[var(--color-accent)] rounded-lg focus:outline-none text-white text-xs font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Dimensions</label>
                                <input
                                  type="text"
                                  value={editDimensions}
                                  onChange={(e) => setEditDimensions(e.target.value)}
                                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 focus:border-[var(--color-accent)] rounded-lg focus:outline-none text-white text-xs font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Location</label>
                                <input
                                  type="text"
                                  value={editLocation}
                                  onChange={(e) => setEditLocation(e.target.value)}
                                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 focus:border-[var(--color-accent)] rounded-lg focus:outline-none text-white text-xs font-sans"
                                />
                              </div>
                              <div className="space-y-1 md:col-span-2">
                                <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Description</label>
                                <textarea
                                  rows={3}
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 focus:border-[var(--color-accent)] rounded-lg focus:outline-none text-white text-xs font-sans resize-none"
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold font-heading text-white">{work.title}</h3>
                                <span className="text-xs text-[var(--color-accent)] font-sans">{work.year}</span>
                              </div>
                              <p className="text-[var(--color-muted)] text-xs font-sans uppercase mt-1 tracking-wider">
                                {work.medium} • {work.dimensions}
                              </p>
                              <p className="text-[var(--color-muted)] text-xs font-sans mt-3 line-clamp-2 leading-relaxed">
                                {work.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex flex-row md:flex-col justify-end items-center gap-3 shrink-0">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(work.id)}
                                className="p-3 bg-green-500 hover:bg-green-600 text-[#030303] rounded-xl transition cursor-pointer"
                                aria-label="Save changes"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-3 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl transition cursor-pointer"
                                aria-label="Cancel changes"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(work)}
                                className="p-3 bg-white/[0.03] hover:bg-[var(--color-accent)] hover:text-[#030303] text-zinc-400 rounded-xl transition cursor-pointer"
                                aria-label="Edit artwork"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteArtwork(work.id)}
                                className="p-3 bg-white/[0.03] hover:bg-red-500/20 hover:text-red-500 text-zinc-400 rounded-xl transition cursor-pointer"
                                aria-label="Delete artwork"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
