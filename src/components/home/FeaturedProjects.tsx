"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CyanBar from "@/components/ui/CyanBar";
import {
  isFirebaseConfigured,
  subscribeFirestoreCollection,
  INITIAL_PROJECTS,
} from "@/lib/firebase";
import {
  ArrowRight,
  MapPin,
  Award,
  Calendar,
  BookOpen,
  Activity,
  Trees,
  HeartHandshake,
  Laptop,
  Users,
  CheckCircle2,
} from "lucide-react";

// Project Category Icon Mapper
function CategoryIcon({ name, className }: { name?: string; className?: string }) {
  switch (name) {
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Activity":
      return <Activity className={className} />;
    case "Trees":
      return <Trees className={className} />;
    case "HeartHandshake":
      return <HeartHandshake className={className} />;
    case "Laptop":
      return <Laptop className={className} />;
    case "Users":
      return <Users className={className} />;
    default:
      return <Award className={className} />;
  }
}

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  directorate: string;
  impactMetric: string;
  date: string;
  location: string;
  status: string;
  summary: string;
  icon?: string;
  volunteers?: string;
  beneficiaries?: string;
  highlights?: string[];
  image?: string;
}

export default function FeaturedProjects() {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(INITIAL_PROJECTS);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      const unsubscribe = subscribeFirestoreCollection<ProjectItem>(
        "projects",
        INITIAL_PROJECTS,
        (data) => {
          if (data && data.length > 0) {
            setProjectsList(data);
          }
        }
      );
      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }
  }, []);

  const projects = projectsList.slice(0, 3);
  const mainProject = projects[0];

  if (!mainProject) return null;

  return (
    <section className="relative py-14 sm:py-20 bg-gradient-to-b from-[#071A2B] via-[#0B2239] to-[#071A2B] overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 glow-cyan-ambient rounded-full pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-0 w-80 h-80 glow-maroon-ambient rounded-full pointer-events-none opacity-50" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-leo-cyan uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
              <span>SERVICE IN ACTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-3">
              Signature Humanitarian Projects
              <span className="maroon-accent-line" />
            </h2>
            <p className="text-xs sm:text-sm text-[#BAE6FD]/70 max-w-xl">
              Sustainable student-led community welfare, youth empowerment, and environmental initiatives across Matara.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-leo-cyan hover:text-white transition-colors shrink-0 group py-1"
          >
            <span>Explore All Initiatives</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dark Glass Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className="glass-card-dark rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Thin maroon accent line top-left */}
              <span className="absolute top-0 left-6 w-10 h-[3px] rounded-b-full bg-[#7F1D2D]" />

              <div className="space-y-4">
                
                {/* Header Icon + Category Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-leo-cyan/10 text-leo-cyan border border-leo-cyan/20 flex items-center justify-center shrink-0 group-hover:bg-leo-cyan group-hover:text-[#071A2B] transition-colors duration-200">
                    <CategoryIcon name={project.icon} className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 text-[#BAE6FD] border border-white/10">
                      {project.category}
                    </span>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-leo-cyan/10 text-leo-cyan border border-leo-cyan/30">
                        FLAGSHIP
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <span className="text-[10px] font-bold text-[#BAE6FD]/50 uppercase tracking-wider block mb-1 truncate">
                    {project.directorate}
                  </span>
                  <h3 className="text-base font-bold text-white font-heading leading-snug group-hover:text-leo-cyan transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                </div>

                {/* Location & Date */}
                <div className="flex items-center gap-3 text-xs text-[#BAE6FD]/60 font-medium pt-1 pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#BAE6FD]/40" />
                    <span>{project.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 truncate max-w-[140px]">
                    <MapPin className="w-3.5 h-3.5 text-[#BAE6FD]/40" />
                    <span className="truncate">{project.location}</span>
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-[#BAE6FD]/80 leading-relaxed font-normal line-clamp-3">
                  {project.summary}
                </p>

                {/* Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {project.highlights.slice(0, 1).map((item: string, hIdx: number) => (
                      <div key={hIdx} className="flex items-start gap-2 text-[11px] text-[#BAE6FD]/60 leading-tight">
                        <CheckCircle2 className="w-3.5 h-3.5 text-leo-cyan shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Bottom Impact & Action */}
              <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-leo-cyan/10 text-leo-cyan font-bold text-[11px] border border-leo-cyan/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>{project.impactMetric}</span>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="font-semibold text-[#BAE6FD] group-hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
