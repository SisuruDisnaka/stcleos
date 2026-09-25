"use client";

import React from "react";
import Link from "next/link";
import CyanBar from "@/components/ui/CyanBar";
import { ArrowRight, ChevronRight, Globe, Shield, Sparkles } from "lucide-react";
import {
  LionsEmblemSvg,
  LeoEmblemSvg,
  DistrictEmblemSvg,
} from "@/components/ui/BrandingLogos";
import { useClub } from "@/context/ClubContext";

export default function AffiliationSection() {
  const { club } = useClub();

  const GOVERNANCE_STEPS = [
    {
      id: "lions",
      level: "LEVEL 01 • GLOBAL PARENT BODY",
      title: "Lions International",
      description: "Founded in 1917, LCI is the world’s largest humanitarian service network with 1.4M+ members in 200+ countries.",
      emblem: <LionsEmblemSvg className="w-12 h-12" />,
      link: "/about#lions-history",
      linkText: "Parent heritage",
    },
    {
      id: "leo",
      level: "LEVEL 02 • YOUTH MOVEMENT",
      title: "The Leo Movement",
      description: "Leadership, Experience, Opportunity. Dedicated youth wing of LCI uniting over 175,000 young leaders worldwide.",
      emblem: <LeoEmblemSvg className="w-12 h-12" />,
      link: "/about",
      linkText: "Leo philosophy",
    },
    {
      id: "district",
      level: "LEVEL 03 • LOCAL CHAPTER",
      title: "Leo District 306 D8",
      description: "Governing district in Sri Lanka. Our club operates under Leo District 306 D8, sponsored by the Lions Club of Ruhunu Millennium.",
      emblem: <DistrictEmblemSvg className="w-12 h-12" />,
      link: "/board",
      linkText: "Club governance",
    },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#F1F5F9] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* Header: Editorial Split */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <CyanBar width="w-10" height="h-1" />
            <span className="block text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-1.5 sm:mb-2">
              GOVERNANCE &amp; AFFILIATION
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#111827] tracking-tight leading-tight">
              Connected to a Century of Global Service
            </h2>
          </div>

          <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-lg font-normal lg:pb-1">
            Sponsored by the Lions Club of Ruhunu Millennium under Leo District 306 D8, our club unites students of St. Thomas' College, Matara in global humanitarian service.
          </p>
        </div>

        {/* Connected Integrated Governance Pathway (No individual floating boxes!) */}
        <div className="relative bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          {/* Subtle Top Gradient Accent */}
          <div className="h-1 bg-gradient-to-r from-[#0B2239] via-[#22D3EE] to-[#0B2239]" />

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {GOVERNANCE_STEPS.map((step, idx) => (
              <div
                key={step.id}
                className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between hover:bg-slate-50/70 transition-colors group"
              >
                <div>
                  {/* Step Level Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0B2239] tracking-wider uppercase">
                      {step.level}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#0B2239] group-hover:text-white text-slate-500 text-xs font-mono font-bold flex items-center justify-center transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Emblem & Title */}
                  <div className="flex items-center gap-3.5 sm:gap-4 mb-3 sm:mb-4">
                    <div className="shrink-0 group-hover:scale-105 transition-transform">
                      {step.emblem}
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#111827] tracking-tight group-hover:text-[#0B2239] transition-colors">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Narrative */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal pt-1">
                    {step.description}
                  </p>
                </div>

                {/* Direct Link */}
                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-100">
                  <Link
                    href={step.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2239] hover:text-[#22D3EE] transition-colors group/link py-1"
                  >
                    <span>{step.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
