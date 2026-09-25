"use client";

import React from "react";
import { useClub } from "@/context/ClubContext";
import { Sparkles, Building2 } from "lucide-react";

export default function ClubSwitcherBar() {
  const { activeClubId, setClubId, availableClubs, club } = useClub();

  return (
    <aside aria-label="Demo Bar" className="bg-leo-dark text-white text-xs border-b border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leo-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-leo-cyan"></span>
        </span>
        <span className="font-semibold text-white flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-leo-cyan" /> Multi-Club Engine Active:
        </span>
        <span className="hidden sm:inline text-slate-400">Previewing site for</span>
        <strong className="text-leo-cyan font-medium">{club.shortName}</strong>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="club-select" className="text-slate-400 flex items-center gap-1">
          <Building2 className="w-3 h-3 text-leo-cyan" /> Switch Club:
        </label>
        <select
          id="club-select"
          value={activeClubId}
          onChange={(e) => setClubId(e.target.value)}
          className="bg-white/10 text-white text-xs rounded-full px-3 py-1 border border-white/20 focus:outline-none focus:ring-1 focus:ring-leo-cyan cursor-pointer transition-all hover:bg-white/15"
        >
          {availableClubs.map((c) => (
            <option key={c.id} value={c.id} className="bg-leo-dark text-white">
              {c.name} ({c.district})
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
