"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { useClub } from "@/context/ClubContext";

export default function HeroSection() {
  const { club, heroSlides } = useClub();
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentSlide] || slides[0] || {
    tag: "STC LEOS",
    title: "Leadership, Experience, Opportunity",
    subtitle: "Fostering leadership, fellowship, and service since 2024",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#071A2B] via-[#0B2239] to-[#071A2B] pt-4 pb-12 sm:pb-16 lg:pt-8 lg:pb-24 w-full max-w-full">

      {/* Ambient background glows */}
      <div className="absolute -top-24 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] glow-cyan-ambient rounded-full -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-[400px] h-64 sm:h-[400px] glow-maroon-ambient rounded-full -z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] opacity-40 pointer-events-none -z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md shadow-xs text-[11px] sm:text-xs font-bold tracking-wider text-[#E0F7FF] uppercase">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leo-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-leo-cyan"></span>
              </span>
              <span>STC Leos • Leo District 306 D8</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-[48px] text-white tracking-tight leading-[1.18] sm:leading-[1.15]">
              Leadership, Experience,{" "}
              <span className="text-[#22D3EE]">
                Opportunity.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-base lg:text-lg text-[#BAE6FD] leading-relaxed max-w-xl font-normal">
              The official Leo Club of St. Thomas&apos; College, Matara. Uniting students to lead impactful initiatives, build leadership skills, and serve our community since 2024.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/join"
                className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-br from-[#0B2239] via-[#0EA5E9] to-[#22D3EE] bg-[length:200%_200%] bg-left hover:bg-right shadow-glow-cyan hover:shadow-glow-cyan-lg rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-center w-full sm:w-auto"
              >
                <span>Join Our Club</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/projects"
                className="btn-glass-secondary inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold rounded-xl text-center w-full sm:w-auto"
              >
                <span>Explore Projects</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-5 sm:pt-6 border-t border-white/10 space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 lg:gap-8 text-xs text-[#BAE6FD]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <ShieldCheck className="w-4 h-4 text-leo-cyan shrink-0" />
                  <span className="font-semibold text-white">Leo District 306 D8</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <GraduationCap className="w-4 h-4 text-leo-cyan shrink-0" />
                  <span className="font-semibold text-white">St. Thomas&apos; College, Matara</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Sparkles className="w-4 h-4 text-[#B54759] shrink-0" />
                  <span className="font-semibold text-white">Chartered 2024</span>
                </div>
              </div>

              {/* Sponsoring Lions Club Tag */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#BAE6FD]/70 font-medium">
                <span className="text-[#BAE6FD]/50">Sponsored by:</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#E0F7FF] font-semibold">Lions Club of Ruhunu Millennium</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Image Carousel */}
          <div
            className="lg:col-span-5 relative mt-4 lg:mt-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Ambient glow behind carousel/logo area */}
            <div className="absolute -inset-6 glow-cyan-ambient rounded-[28px] -z-0 pointer-events-none opacity-70" />

            {/* Carousel Container */}
            <div className="relative mx-auto rounded-xl overflow-hidden shadow-glass border border-white/15 bg-[#0B2239] w-full max-w-md lg:max-w-none h-[290px] sm:h-[400px] lg:h-[480px]">
              
              {/* Slides */}
              {slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/95 via-[#0B2239]/40 to-transparent" />
                </div>
              ))}

              {/* Prev / Next Navigation Arrows */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 border border-white/20 shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 border border-white/20 shadow-sm"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>

              {/* Top Slide Counter Badge */}
              <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-[11px] font-bold tracking-widest">
                0{currentSlide + 1} / 0{slides.length}
              </div>

              {/* Bottom Glass Caption Card */}
              <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 p-2.5 sm:p-4 rounded-lg glass-card-dark shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-leo-cyan truncate">
                      {activeSlide.tag}
                    </div>
                    <div className="font-heading font-extrabold text-xs sm:text-base text-white truncate">
                      {activeSlide.title}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#BAE6FD] truncate">
                      {activeSlide.subtitle}
                    </div>
                  </div>

                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#0B2239] to-[#22D3EE] text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 shadow-xs border border-white/10">
                    STC
                  </div>
                </div>

                {/* Carousel Indicator Dots */}
                <div className="flex items-center gap-1.5 pt-2 sm:pt-3 mt-2 border-t border-white/10">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlide(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`h-1 sm:h-1.5 rounded-sm transition-all duration-300 ${
                        dotIdx === currentSlide
                          ? "w-6 sm:w-7 bg-leo-cyan"
                          : "w-2 bg-white/20 hover:bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Overlapping Bottom-Right Floating Badge */}
            <div className="absolute -bottom-3 -right-2 hidden sm:flex items-center gap-3 glass-card-dark text-white px-4 py-3 rounded-lg shadow-lg z-30">
              <span className="maroon-accent-dot" />
              <Users className="w-5 h-5 text-leo-cyan" />
              <div>
                <div className="font-heading font-extrabold text-sm leading-none">Est. 2024</div>
                <div className="text-[10px] text-[#BAE6FD] mt-0.5">Leo District 306 D8</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
