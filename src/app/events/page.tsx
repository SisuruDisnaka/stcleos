"use client";

import React, { useState, useEffect } from "react";
import { useClub } from "@/context/ClubContext";
import { Calendar, Clock, MapPin, CalendarPlus, Sparkles } from "lucide-react";
import {
  isFirebaseConfigured,
  getFirestoreCollection,
  subscribeFirestoreCollection,
  INITIAL_EVENTS,
} from "@/lib/firebase";

interface EventItem {
  id: string;
  title: string;
  date: string;
  day?: string;
  month?: string;
  time?: string;
  venue?: string;
  category?: string;
  summary?: string;
  description?: string;
}

export default function EventsPage() {
  const { club } = useClub();
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      const unsubscribe = subscribeFirestoreCollection<EventItem>(
        "events",
        INITIAL_EVENTS,
        (items) => {
          if (items && items.length > 0) {
            setEvents(items);
          } else {
            // Fallback check on announcements
            getFirestoreCollection<any>("announcements", []).then((announcements) => {
              if (announcements && announcements.length > 0) {
                const mapped: EventItem[] = announcements.map((a, idx) => {
                  const dateParts = a.date ? a.date.split(" ") : [];
                  const month = dateParts[0] ? dateParts[0].substring(0, 3).toUpperCase() : "EVENT";
                  const day = dateParts[1] ? dateParts[1].replace(",", "") : String(idx + 1);

                  return {
                    id: a.id,
                    title: a.title,
                    date: a.date || "2025",
                    day: day || "28",
                    month: month || "MAR",
                    time: a.time || "03:30 PM - 06:30 PM",
                    venue: a.scope || "St. Thomas' College, Matara",
                    category: a.category || "General",
                    description: a.summary || a.description || "Official club communique and event gathering.",
                  };
                });
                setEvents(mapped);
              }
            });
          }
        }
      );

      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }
  }, []);

  const getGoogleCalendarUrl = (ev: EventItem) => {
    const title = encodeURIComponent(`${ev.title} - Leo Club of STC`);
    const details = encodeURIComponent(
      `${ev.description || ""}\n\nOrganized by Leo Club of St. Thomas' College, Matara`
    );
    const location = encodeURIComponent(ev.venue || "St. Thomas' College, Matara");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      
      {/* 1. Minimal Header */}
      <section className="bg-white border-b border-slate-200/80 pt-14 pb-10 sm:pt-16 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
              <span>Leo District 306 D8 • St. Thomas' College, Matara</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
              Events &amp; Calendar
            </h1>

            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
              Official timeline of upcoming leadership workshops, community outreach, and fellowship assemblies of the Leo Club of St. Thomas' College, Matara.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Events Timeline Listing */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="space-y-4 sm:space-y-5">
          {events.map((ev) => (
            <article
              key={ev.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              
              {/* Left Column: Date Tile & Info */}
              <div className="flex items-start gap-4 sm:gap-6 min-w-0 flex-1">
                
                {/* Minimalist Date Tile */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center shrink-0 group-hover:bg-[#0B2239] group-hover:border-[#0B2239] transition-colors duration-200">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-slate-400 group-hover:text-blue-100 transition-colors uppercase">
                    {ev.month || "EVENT"}
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-white transition-colors font-heading leading-tight">
                    {ev.day || "28"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 min-w-0 flex-1">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#0B2239] border border-blue-100">
                      {ev.category || "General Event"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {ev.date}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-snug group-hover:text-[#0B2239] transition-colors">
                    {ev.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
                    {ev.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-slate-500 font-medium">
                    {ev.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{ev.time}</span>
                      </div>
                    )}
                    {ev.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[280px] sm:max-w-md">{ev.venue}</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Right Column: Google Calendar Button */}
              <div className="shrink-0 self-start md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
                <a
                  href={getGoogleCalendarUrl(ev)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold shadow-xs transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 text-[#0B2239]" />
                  <span>Add to Google Calendar</span>
                </a>
              </div>

            </article>
          ))}
        </div>
      </div>

    </div>
  );
}
