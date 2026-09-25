"use client";

import React, { useState, useEffect } from "react";
import { useClub } from "@/context/ClubContext";
import CyanBar from "@/components/ui/CyanBar";
import { Image as ImageIcon, X, Sparkles } from "lucide-react";
import {
  isFirebaseConfigured,
  getFirestoreCollection,
  subscribeFirestoreCollection,
  INITIAL_GALLERY_PHOTOS,
} from "@/lib/firebase";

interface GalleryPhotoItem {
  id: string;
  category: string;
  title: string;
  url: string;
  date?: string;
}

export default function GalleryPage() {
  const { club } = useClub();
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>(INITIAL_GALLERY_PHOTOS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      const unsubscribe = subscribeFirestoreCollection<GalleryPhotoItem>(
        "gallery",
        INITIAL_GALLERY_PHOTOS,
        (items) => {
          if (items && items.length > 0) {
            setPhotos(items);
          }
        }
      );
      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }
  }, []);

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === "all") return true;
    return p.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="bg-white">
      
      {/* Hero */}
      <section className="bg-gradient-to-b from-leo-pearl via-white to-white py-16 lg:py-24 border-b border-leo-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-3xl">
            <CyanBar />
            <span className="block text-xs font-bold tracking-[0.14em] text-leo-slate uppercase mb-2">
              MEMORIES IN ACTION
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-leo-charcoal tracking-tight leading-tight mb-6">
              Media Gallery &amp; Photo Highlights
            </h1>
            <p className="text-lg text-leo-slate leading-relaxed">
              Capturing vibrant moments of service, fellowship, installations, and youth leadership across {club.name}.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="py-8 bg-white border-b border-leo-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {[
              { id: "all", label: "All Photos" },
              { id: "community", label: "Community Service" },
              { id: "fellowship", label: "Fellowship & Camps" },
              { id: "ceremonies", label: "Installations & Awards" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeFilter === tab.id
                    ? "bg-gradient-to-br from-[#0B2239] via-[#0EA5E9] to-[#22D3EE] text-white shadow-glow-cyan"
                    : "bg-leo-pearl text-leo-charcoal hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry / Grid Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          {filteredPhotos.length === 0 && (
            <div className="text-center py-20 border border-dashed border-leo-border rounded-2xl bg-leo-pearl/50">
              <ImageIcon className="w-10 h-10 text-leo-cyan/60 mx-auto mb-3" />
              <p className="text-sm font-semibold text-leo-charcoal">Gallery photos coming soon</p>
              <p className="text-xs text-leo-slate mt-1">Club event photos will be added here shortly.</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActiveImage(photo.url)}
                className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer bg-leo-dark h-72 border border-leo-border"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-leo-dark/90 via-leo-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div>
                    <span className="text-[10px] font-bold text-leo-cyan uppercase tracking-widest block mb-1">
                      {photo.category}
                    </span>
                    <h4 className="font-heading font-bold text-white text-base leading-snug">
                      {photo.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt="Enlarged gallery view"
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}

    </div>
  );
}
