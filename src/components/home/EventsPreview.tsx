"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CyanBar from "@/components/ui/CyanBar";
import { ArrowRight, Calendar, ArrowUpRight } from "lucide-react";
import { useClub } from "@/context/ClubContext";
import {
  isFirebaseConfigured,
  subscribeFirestoreCollection,
  INITIAL_ANNOUNCEMENTS,
} from "@/lib/firebase";

interface NoticeItem {
  id: string;
  ref?: string;
  date: string;
  tag?: string;
  category?: string;
  priority?: string;
  title: string;
  summary: string;
  issuer?: string;
  scope?: string;
  link?: string;
  linkUrl?: string;
}

export default function EventsPreview() {
  const { club } = useClub();
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_ANNOUNCEMENTS);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      const unsubscribe = subscribeFirestoreCollection<NoticeItem>(
        "announcements",
        INITIAL_ANNOUNCEMENTS,
        (items) => {
          if (items && items.length > 0) {
            setNotices(items.slice(0, 4));
          }
        }
      );
      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }
  }, []);

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#F1F5F9] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* Section Header: Editorial Split */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-12">
          <div>
            <CyanBar width="w-10" height="h-1" />
            <span className="block text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-1.5 sm:mb-2">
              LATEST HAPPENINGS &amp; ANNOUNCEMENTS
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#111827] tracking-tight">
              Official Announcements &amp; Events
            </h2>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B2239] hover:text-[#22D3EE] transition-colors group py-1"
          >
            <span>View All Events &amp; Calendar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Balanced 2x2 Equal Grid: 4 Proportional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="relative bg-white rounded-xl border border-slate-200/90 p-5 sm:p-7 flex flex-col justify-between shadow-xs hover:border-leo-cyan/50 hover:shadow-glow-cyan-soft hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
            >
              <span className="absolute top-0 left-0 w-1 h-8 rounded-r-full bg-[#7F1D2D]/70" />
              <div>
                {/* Header Meta */}
                <div className="flex items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-slate-100">
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0B2239] uppercase tracking-wider">
                    {notice.tag || notice.category || "Official Notice"}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-leo-cyan" />
                    <span>{notice.date}</span>
                  </div>
                </div>

                {/* Headline */}
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#111827] group-hover:text-[#0B2239] transition-colors leading-snug">
                  <Link href={notice.linkUrl || notice.link || "/events"}>
                    {notice.title}
                  </Link>
                </h3>

                {/* Narrative Summary */}
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mt-2.5 line-clamp-3">
                  {notice.summary}
                </p>
              </div>

              {/* Bottom Attribution & Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-medium truncate">
                  {notice.issuer || notice.scope || "Executive Secretariat • Leo District 306 D8"}
                </span>

                <Link
                  href={notice.linkUrl || notice.link || "/events"}
                  className="inline-flex items-center gap-1 font-bold text-[#0B2239] group-hover:text-[#22D3EE] transition-colors shrink-0"
                >
                  <span>Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
