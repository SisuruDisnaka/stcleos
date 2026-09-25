"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CyanBar from "@/components/ui/CyanBar";
import { useClub } from "@/context/ClubContext";
import {
  GraduationCap,
  Users,
  Clock,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import {
  isFirebaseConfigured,
  getFirestoreDoc,
  INITIAL_IMPACT_STATS,
} from "@/lib/firebase";

// Ultra-smooth easing counter hook
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOut * target);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, target]);

  return (
    <span ref={elementRef} className="tabular-nums font-heading font-extrabold text-3xl sm:text-4xl lg:text-[52px] text-[#0B2239] tracking-tight leading-none">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ImpactSection() {
  const { club } = useClub();
  const [impactStats, setImpactStats] = useState<any>(INITIAL_IMPACT_STATS);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      getFirestoreDoc<any>("settings", "impact_stats", INITIAL_IMPACT_STATS).then((data) => {
        if (data && (data.stat1 || data.stat2)) {
          setImpactStats(data);
        }
      });
    }
  }, []);

  const parseNumber = (val: string, fallback: number) => {
    if (!val) return fallback;
    const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? fallback : num;
  };

  const parseSuffix = (val: string, fallback: string) => {
    if (!val) return fallback;
    if (val.includes("+")) return "+";
    if (val.includes("%")) return "%";
    return "";
  };

  const stat1Val = impactStats?.stat1?.value || "2024";
  const stat2Val = impactStats?.stat2?.value || "5";
  const stat3Val = impactStats?.stat3?.value || "9";
  const stat4Val = impactStats?.stat4?.value || "3";

  const STATS = [
    {
      id: "stat-1",
      target: parseNumber(stat1Val, 2024),
      suffix: parseSuffix(stat1Val, ""),
      label: impactStats?.stat1?.label || "Year Chartered",
      tagline: "Chartered Chapter",
      detail: "Leo District 306 D8",
      icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2239]" />,
    },
    {
      id: "stat-2",
      target: parseNumber(stat2Val, 5),
      suffix: parseSuffix(stat2Val, ""),
      label: impactStats?.stat2?.label || "Service Pillars",
      tagline: "Areas of Focus",
      detail: "Student-Led Volunteers",
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#22D3EE]" />,
    },
    {
      id: "stat-3",
      target: parseNumber(stat3Val, 9),
      suffix: parseSuffix(stat3Val, ""),
      label: impactStats?.stat3?.label || "Executive Officers",
      tagline: "Executive Board",
      detail: "Leistic Year 2026/27",
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />,
    },
    {
      id: "stat-4",
      target: parseNumber(stat4Val, 3),
      suffix: parseSuffix(stat4Val, ""),
      label: impactStats?.stat4?.label || "Signature Projects",
      tagline: "Community Reach",
      detail: "Wagging Tails, Heena Arunalu & More",
      icon: <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />,
    },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* Top Editorial Split Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end pb-10 sm:pb-14 border-b border-slate-200">
          <div className="lg:col-span-7">
            <CyanBar width="w-10" height="h-1" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] sm:text-[11px] font-bold text-[#0B2239] uppercase tracking-wider mb-2.5 sm:mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
              </span>
              <span>VERIFIED SERVICE IMPACT</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-[44px] text-[#111827] tracking-tight leading-[1.18] sm:leading-[1.15]">
              STC Leos, in figures.
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-normal">
              {impactStats?.description || "Where the Leo Club of St. Thomas' College, Matara stands today in our mission of youth empowerment, leadership development, and community impact."}
            </p>
            <div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B2239] hover:text-[#22D3EE] transition-colors group"
              >
                <span>Discover project impact reports</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Seamless Integrated 4-Stat Strip (2x2 on mobile, 4-col on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-slate-200 py-8 sm:py-10">
          {STATS.map((stat, idx) => (
            <div
              key={stat.id}
              className={`p-3 sm:p-5 lg:py-4 transition-all duration-300 group rounded-xl bg-slate-50/60 lg:bg-transparent ${
                idx === 0
                  ? "lg:pr-8"
                  : idx === STATS.length - 1
                  ? "lg:pl-8"
                  : "lg:px-8"
              }`}
            >
              {/* Micro-Icon + Tag */}
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white lg:bg-slate-100 group-hover:bg-blue-50 group-hover:text-[#0B2239] transition-colors flex items-center justify-center shrink-0 shadow-xs">
                  {stat.icon}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                  {stat.tagline}
                </span>
              </div>

              {/* Big Animated Number */}
              <div className="mb-1.5 sm:mb-3 group-hover:translate-x-1 transition-transform">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <h3 className="font-heading font-bold text-xs sm:text-base lg:text-lg text-[#111827] leading-snug">
                {stat.label}
              </h3>

              {/* Detail */}
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-normal line-clamp-1 sm:line-clamp-none">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Minimalist Summary Pill Ribbon */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0B2239] shrink-0" />
            <span className="font-semibold text-slate-800">Leo District 306 D8, Sri Lanka</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-500">Sponsoring Lions Club of Ruhunu Millennium</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-6 font-medium text-[11px] sm:text-xs">
            <span className="text-slate-700">Wagging Tails</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700">Heena Arunalu</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700">Drug Prevention</span>
          </div>
        </div>

      </div>
    </section>
  );
}
