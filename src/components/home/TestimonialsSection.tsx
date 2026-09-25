"use client";

import React, { useState } from "react";
import { useClub } from "@/context/ClubContext";
import CyanBar from "@/components/ui/CyanBar";
import { Quote, Sparkles } from "lucide-react";

export default function TestimonialsSection() {
  const { club } = useClub();
  const testimonials = club.testimonials && club.testimonials.length > 0 ? club.testimonials : [];

  if (testimonials.length === 0) return null;

  const featured = testimonials[0];
  const others = testimonials.slice(1);

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-14">
          <CyanBar width="w-10" height="h-1" />
          <span className="block text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-1.5 sm:mb-2">
            MEMBER REFLECTIONS
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#111827] tracking-tight leading-tight">
            What It Means to Be a Leo
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed mt-2 font-normal">
            Reflections from students and advisors on finding purpose, building lifelong leadership skills, and serving the Matara community.
          </p>
        </div>

        {/* Editorial Split: 1 Large Pull-Quote Hero (7 cols) + 2 Clean Side Voices (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-12 items-stretch">
          
          {/* Main Editorial Hero Quote (7 Cols) */}
          <div className="lg:col-span-7 bg-[#F1F5F9] rounded-xl p-5 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden border border-slate-200/70">
            <Quote className="w-8 h-8 sm:w-12 sm:h-12 text-[#0B2239]/15 absolute top-3 right-3 sm:top-6 sm:right-6 pointer-events-none" />

            <div>
              {featured.tag && (
                <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-blue-100/80 text-[#0B2239] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-6">
                  {featured.tag}
                </span>
              )}

              <p className="font-heading font-bold text-sm sm:text-xl lg:text-2xl text-[#111827] leading-relaxed">
                “{featured.quote}”
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-8 mt-4 sm:mt-8 border-t border-slate-200">
              <img
                src={featured.avatar}
                alt={featured.author}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-heading font-extrabold text-xs sm:text-base text-[#111827] truncate">
                  {featured.author}
                </h4>
                <p className="text-[11px] sm:text-xs font-medium text-slate-600 truncate">
                  {featured.role}
                </p>
                {featured.faculty && (
                  <p className="text-[10px] sm:text-[11px] text-[#0B2239] font-semibold mt-0.5 truncate">
                    {featured.faculty}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2 Clean Side Voices (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            {others.map((item) => (
              <div
                key={item.id}
                className="flex-1 p-4 sm:p-6 rounded-xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs hover:bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  {item.tag && (
                    <span className="inline-block text-[9px] sm:text-[10px] font-bold text-[#0B2239] uppercase tracking-wider mb-2 sm:mb-3">
                      {item.tag}
                    </span>
                  )}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                    “{item.quote}”
                  </p>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3.5 pt-3 sm:pt-5 mt-3 sm:mt-5 border-t border-slate-100">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-heading font-bold text-xs sm:text-sm text-[#111827] truncate">
                      {item.author}
                    </h5>
                    <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                      {item.role}
                    </p>
                    {item.faculty && (
                      <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">
                        {item.faculty}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
