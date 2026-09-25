"use client";

import React from "react";
import Link from "next/link";
import CyanBar from "@/components/ui/CyanBar";
import {
  TreePine,
  Utensils,
  Eye,
  GraduationCap,
  HeartHandshake,
  ShieldAlert,
  Users,
  ArrowRight,
} from "lucide-react";
import { useClub } from "@/context/ClubContext";

const ICON_MAP: Record<string, any> = {
  GraduationCap,
  TreePine,
  HeartHandshake,
  Users,
  ShieldAlert,
  Eye,
  Utensils,
};

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
};

export default function CausesSection() {
  const { club } = useClub();
  const pillars = club.pillars && club.pillars.length > 0 ? club.pillars : [];

  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <CyanBar width="w-10" height="h-1" />
            <span className="block text-[11px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-2">
              WHERE WE SERVE
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#111827] tracking-tight">
              Our Core Service Pillars
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2239] hover:text-leo-cyan transition-colors"
          >
            <span>Explore All Initiatives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => {
            const Icon = ICON_MAP[p.icon] || HeartHandshake;
            const colorClass = COLOR_MAP[p.color] || "bg-blue-50 text-blue-700 border-blue-100";

            return (
              <div
                key={p.id}
                className="group bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${colorClass} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-leo-cyan mb-1.5">
                    {p.tagline}
                  </div>

                  <h3 className="font-heading font-extrabold text-xl text-[#111827] mb-3 group-hover:text-[#0B2239] transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/projects?category=${p.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2239] group-hover:text-leo-cyan transition-colors"
                  >
                    <span>View Projects</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
