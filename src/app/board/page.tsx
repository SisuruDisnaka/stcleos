"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Search,
  Users,
  Award,
  BookOpen,
  Trees,
  Activity,
  HeartHandshake,
  TrendingUp,
  Megaphone,
  UserCheck,
  Calendar,
  Camera,
  ExternalLink,
  ChevronRight,
  Layers,
  X,
  Phone,
  Info,
} from "lucide-react";
import {
  isFirebaseConfigured,
  getFirestoreDoc,
  INITIAL_LEADERSHIP,
} from "@/lib/firebase";

// Standardized Uniform Avatar Component (matching exact sizes across all images and initials)
function MemberAvatar({
  initials,
  image,
  size = "standard",
  className = "",
}: {
  initials: string;
  image?: string;
  size?: "standard" | "hero" | "modal";
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  // Standardized dimensions across all cards
  const sizeClass = {
    standard: "w-20 h-20 rounded-2xl text-sm",
    hero: "w-28 h-28 sm:w-32 sm:h-32 rounded-3xl text-xl sm:text-2xl",
    modal: "w-28 h-28 sm:w-32 sm:h-32 rounded-3xl text-xl sm:text-2xl",
  }[size];

  if (image && !imgError) {
    return (
      <div className={`relative shrink-0 ${className}`}>
        <div className="absolute -inset-1.5 rounded-2xl bg-leo-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          src={image}
          alt={initials}
          onError={() => setImgError(true)}
          className={`relative ${sizeClass} object-cover border border-white/15 shadow-xs bg-white/5 group-hover:scale-105 transition-transform duration-300`}
          style={{ objectPosition: "center 15%" }}
        />
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="absolute -inset-1.5 rounded-2xl bg-leo-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div
        className={`relative ${sizeClass} bg-gradient-to-br from-white/10 to-white/5 border border-white/15 text-white font-bold flex flex-col items-center justify-center tracking-wider shadow-xs group-hover:scale-105 transition-transform duration-300`}
      >
        <span>{initials}</span>
        <span className="text-[9px] font-medium text-leo-cyan/70 uppercase tracking-widest mt-0.5">LEO</span>
      </div>
    </div>
  );
}

// Uniform Member Card Component used across all grids
function DirectoryMemberCard({
  member,
  tierLabel,
  tierBadge,
  onSelect,
}: {
  member: any;
  tierLabel?: string;
  tierBadge: string;
  onSelect: (m: any) => void;
}) {
  return (
    <div
      onClick={() => onSelect(member)}
      className="glass-card-dark relative rounded-2xl p-5 flex flex-col justify-between group cursor-pointer h-full overflow-hidden"
    >
      {/* Thin maroon heritage accent line */}
      <span className="absolute top-0 left-6 w-8 h-[3px] rounded-b-full bg-[#7F1D2D]" />

      <div className="space-y-3.5">
        <div className="flex items-start gap-3.5">
          <MemberAvatar initials={member.initials || "LEO"} image={member.image} />
          
          <div className="min-w-0 flex-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-leo-cyan uppercase tracking-wider block truncate mb-0.5">
              {member.roleBadge || member.portfolio || tierLabel}
            </span>
            <h4 className="text-sm font-bold text-white font-heading leading-snug group-hover:text-leo-cyan transition-colors line-clamp-1">
              {member.designation || member.portfolio}
            </h4>
            <p className="text-xs font-bold text-[#E0F7FF] mt-0.5 truncate">
              {member.name}
            </p>
            {member.faculty && (
              <div className="flex items-center gap-1 text-[11px] text-[#BAE6FD]/60 font-medium pt-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#BAE6FD]/40 shrink-0" />
                <span className="truncate">{member.faculty}</span>
              </div>
            )}
            {member.institution && (
              <div className="flex items-center gap-1 text-[11px] text-[#BAE6FD]/60 font-medium pt-1">
                <Building2 className="w-3.5 h-3.5 text-[#BAE6FD]/40 shrink-0" />
                <span className="truncate">{member.institution}</span>
              </div>
            )}
          </div>
        </div>

        {member.scope && (
          <p className="text-xs text-[#BAE6FD]/70 leading-relaxed line-clamp-2 pt-1 border-t border-white/10">
            {member.scope}
          </p>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#BAE6FD]/40 font-medium">{tierBadge}</span>
        <a
          href={`mailto:${member.email}`}
          onClick={(e) => e.stopPropagation()}
          className="font-semibold text-leo-cyan hover:text-white inline-flex items-center gap-1 transition-colors"
          title={member.email}
        >
          <Mail className="w-3 h-3" />
          <span>Email</span>
        </a>
      </div>
    </div>
  );
}

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "advisory" | "exco" | "directors" | "assistants" | "crew" | "initiatives"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [leadership, setLeadership] = useState<any>(INITIAL_LEADERSHIP);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      getFirestoreDoc<any>("leadership", "current", INITIAL_LEADERSHIP).then((doc) => {
        if (doc && (doc.president || doc.excoOfficers)) {
          setLeadership(doc);
        }
      });
    }
  }, []);

  const ADVISORY_MEMBERS = leadership.advisoryCouncil || INITIAL_LEADERSHIP.advisoryCouncil;
  const PRESIDENT_DATA = leadership.president || INITIAL_LEADERSHIP.president;
  const IPP_DATA = leadership.ipp || INITIAL_LEADERSHIP.ipp;
  const EXCO_OFFICERS = leadership.excoOfficers || INITIAL_LEADERSHIP.excoOfficers;
  const DIRECTORS = leadership.directors || INITIAL_LEADERSHIP.directors;
  const ASSISTANT_DIRECTORS = leadership.assistantDirectors || INITIAL_LEADERSHIP.assistantDirectors || [];
  const CREATIVE_CREW = leadership.creativeCrew || INITIAL_LEADERSHIP.creativeCrew || [];
  const SIGNATURE_PROJECTS = leadership.signatureProjects || INITIAL_LEADERSHIP.signatureProjects || [];
  const MILESTONE_EVENTS = leadership.milestoneEvents || INITIAL_LEADERSHIP.milestoneEvents || [];
  const GOVERNANCE = leadership.governance || INITIAL_LEADERSHIP.governance;
  const leisticYear = leadership.leisticYear || INITIAL_LEADERSHIP.leisticYear;
  const district = leadership.district || INITIAL_LEADERSHIP.district;
  const sponsoringClub = leadership.sponsoringClub || INITIAL_LEADERSHIP.sponsoringClub;
  const photosDriveUrl = leadership.photosDriveUrl || INITIAL_LEADERSHIP.photosDriveUrl;

  const totalCount =
    ADVISORY_MEMBERS.length +
    1 + // President
    (IPP_DATA ? 1 : 0) +
    EXCO_OFFICERS.length +
    DIRECTORS.length +
    ASSISTANT_DIRECTORS.length +
    CREATIVE_CREW.length;

  // Search filtering
  const query = searchQuery.trim().toLowerCase();

  const filterList = (list: any[]) => {
    if (!query) return list;
    return list.filter(
      (m) =>
        m.name?.toLowerCase().includes(query) ||
        m.designation?.toLowerCase().includes(query) ||
        m.portfolio?.toLowerCase().includes(query) ||
        m.faculty?.toLowerCase().includes(query) ||
        m.scope?.toLowerCase().includes(query)
    );
  };

  const filteredAdvisory = useMemo(() => filterList(ADVISORY_MEMBERS), [ADVISORY_MEMBERS, query]);
  const filteredExco = useMemo(() => filterList(EXCO_OFFICERS), [EXCO_OFFICERS, query]);
  const filteredDirectors = useMemo(() => filterList(DIRECTORS), [DIRECTORS, query]);
  const filteredAssistants = useMemo(() => filterList(ASSISTANT_DIRECTORS), [ASSISTANT_DIRECTORS, query]);
  const filteredCrew = useMemo(() => filterList(CREATIVE_CREW), [CREATIVE_CREW, query]);

  const showPresident =
    !query ||
    PRESIDENT_DATA?.name?.toLowerCase().includes(query) ||
    PRESIDENT_DATA?.designation?.toLowerCase().includes(query) ||
    PRESIDENT_DATA?.responsibilities?.toLowerCase().includes(query) ||
    PRESIDENT_DATA?.faculty?.toLowerCase().includes(query);

  const showIpp =
    IPP_DATA &&
    (!query ||
      IPP_DATA.name?.toLowerCase().includes(query) ||
      IPP_DATA.designation?.toLowerCase().includes(query) ||
      IPP_DATA.scope?.toLowerCase().includes(query) ||
      IPP_DATA.faculty?.toLowerCase().includes(query));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. HERO & GOVERNANCE HEADER */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-8 sm:pt-16 sm:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8">
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-semibold text-[#0B2239] border border-blue-100">
                  <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
                  <span>{district} • Sri Lanka</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                  <span>Sponsored by {sponsoringClub}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-[11px] font-semibold text-amber-700 border border-amber-200/60">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Leistic Year {leisticYear}</span>
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading">
                Leadership Directory
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The governing advisory council, executive top table cabinet, and board of directors of the Leo Club of St. Thomas' College, Matara for {leisticYear}.
              </p>
            </div>

            {/* Quick Summary Pill Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 shrink-0">
              <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                <span className="block text-xl font-extrabold text-slate-900 font-heading">{String(ADVISORY_MEMBERS.length).padStart(2, "0")}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Advisors</span>
              </div>
              <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                <span className="block text-xl font-extrabold text-[#0B2239] font-heading">{String(EXCO_OFFICERS.length + 1 + (IPP_DATA ? 1 : 0)).padStart(2, "0")}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">EXCO</span>
              </div>
              <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                <span className="block text-xl font-extrabold text-slate-900 font-heading">{String(DIRECTORS.length).padStart(2, "0")}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Directors</span>
              </div>
              <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/60 text-center shadow-2xs">
                <span className="block text-xl font-extrabold text-[#22D3EE] font-heading">{totalCount}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Clean Wrapping Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "all"
                    ? "bg-[#0B2239] text-white shadow-xs font-semibold ring-2 ring-blue-100"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium"
                }`}
              >
                All Leaders <span className={activeTab === "all" ? "text-blue-200 font-bold ml-1" : "text-slate-400 font-normal ml-1"}>({totalCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("advisory")}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "advisory"
                    ? "bg-[#0B2239] text-white shadow-xs font-semibold ring-2 ring-blue-100"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium"
                }`}
              >
                Advisors <span className={activeTab === "advisory" ? "text-blue-200 font-bold ml-1" : "text-slate-400 font-normal ml-1"}>({ADVISORY_MEMBERS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("exco")}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "exco"
                    ? "bg-[#0B2239] text-white shadow-xs font-semibold ring-2 ring-blue-100"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium"
                }`}
              >
                EXCO Council <span className={activeTab === "exco" ? "text-blue-200 font-bold ml-1" : "text-slate-400 font-normal ml-1"}>({EXCO_OFFICERS.length + 1 + (IPP_DATA ? 1 : 0)})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("directors")}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "directors"
                    ? "bg-[#0B2239] text-white shadow-xs font-semibold ring-2 ring-blue-100"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium"
                }`}
              >
                Portfolio Directors <span className={activeTab === "directors" ? "text-blue-200 font-bold ml-1" : "text-slate-400 font-normal ml-1"}>({DIRECTORS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("assistants")}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "assistants"
                    ? "bg-[#0B2239] text-white shadow-xs font-semibold ring-2 ring-blue-100"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium"
                }`}
              >
                Assistants &amp; Project <span className={activeTab === "assistants" ? "text-blue-200 font-bold ml-1" : "text-slate-400 font-normal ml-1"}>({ASSISTANT_DIRECTORS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("crew")}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "crew"
                    ? "bg-[#0B2239] text-white shadow-xs font-semibold ring-2 ring-blue-100"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium"
                }`}
              >
                Creative Crew <span className={activeTab === "crew" ? "text-blue-200 font-bold ml-1" : "text-slate-400 font-normal ml-1"}>({CREATIVE_CREW.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("initiatives")}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "initiatives"
                    ? "bg-[#0B2239] text-white shadow-xs font-semibold ring-2 ring-blue-100"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium"
                }`}
              >
                Signature Projects
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, faculty..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-slate-200 focus:border-[#0B2239] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 2. DIRECTORY CONTENT TIERS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">

        {/* ======================================================================= */}
        {/* TIER 1: ADVISORY COUNCIL                                                */}
        {/* ======================================================================= */}
        {(activeTab === "all" || activeTab === "advisory") && filteredAdvisory.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tier 01 • Advisory Council
                </h2>
                <p className="text-xl font-bold text-slate-900 font-heading">
                  Staff &amp; Lions Mentors
                </p>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Academic &amp; Governance Oversight
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredAdvisory.map((adv: any) => (
                <DirectoryMemberCard
                  key={adv.id}
                  member={adv}
                  tierLabel="Advisory Council"
                  tierBadge="Advisor"
                  onSelect={setSelectedMember}
                />
              ))}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* TIER 2: EXECUTIVE OFFICERS (EXCO)                                       */}
        {/* ======================================================================= */}
        {(activeTab === "all" || activeTab === "exco") && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tier 02 • Executive Committee
                </h2>
                <p className="text-xl font-bold text-slate-900 font-heading">
                  Top Table &amp; Cabinet Officers
                </p>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Club Administration, Vision &amp; Operations
              </span>
            </div>

            {/* A. President Hero Card */}
            {showPresident && PRESIDENT_DATA && (
              <div
                onClick={() => setSelectedMember(PRESIDENT_DATA)}
                className="glass-card-dark rounded-2xl p-6 sm:p-8 group cursor-pointer relative overflow-hidden"
              >
                <span className="absolute top-0 left-8 w-12 h-[3px] rounded-b-full bg-[#7F1D2D]" />
                <div className="absolute top-0 right-0 w-64 h-64 glow-cyan-ambient rounded-bl-full pointer-events-none opacity-70" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 relative z-10">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 min-w-0 flex-1">
                    <MemberAvatar
                      initials={PRESIDENT_DATA.initials}
                      image={PRESIDENT_DATA.image}
                      size="hero"
                      className="ring-4 ring-leo-cyan/20 shadow-md"
                    />
                    
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-leo-cyan uppercase tracking-wider bg-leo-cyan/10 border border-leo-cyan/25 px-3 py-0.5 rounded-full">
                          {PRESIDENT_DATA.roleBadge}
                        </span>
                        <span className="text-xs text-[#BAE6FD]/70 font-medium flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-[#BAE6FD]/50" />
                          <span>{PRESIDENT_DATA.faculty}</span>
                        </span>
                        <span className="text-xs text-[#E7B4BC] font-semibold bg-[#7F1D2D]/15 px-2.5 py-0.5 rounded-full border border-[#7F1D2D]/30">
                          {PRESIDENT_DATA.term || `Leistic Year ${leisticYear}`}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading group-hover:text-leo-cyan transition-colors">
                        {PRESIDENT_DATA.name}
                      </h3>

                      <p className="text-xs sm:text-sm font-semibold text-[#BAE6FD]/70">
                        {PRESIDENT_DATA.designation} • St. Thomas' College, Matara
                      </p>

                      <p className="text-xs sm:text-sm text-[#BAE6FD]/80 leading-relaxed max-w-2xl pt-1">
                        {PRESIDENT_DATA.responsibilities}
                      </p>

                      {PRESIDENT_DATA.motto && (
                        <p className="text-xs sm:text-sm text-leo-cyan font-medium italic pt-1 border-t border-white/10">
                          {PRESIDENT_DATA.motto}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 self-start sm:self-center">
                    <a
                      href={`mailto:${PRESIDENT_DATA.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="btn-glass-secondary inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contact President</span>
                    </a>
                  </div>

                </div>
              </div>
            )}

            {/* B. Immediate Past President (IPP) */}
            {showIpp && IPP_DATA && (
              <div
                onClick={() => setSelectedMember(IPP_DATA)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-[#0B2239]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <MemberAvatar initials={IPP_DATA.initials} image={IPP_DATA.image} />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded">
                        {IPP_DATA.roleBadge}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 font-heading group-hover:text-[#0B2239] transition-colors mt-1">
                        {IPP_DATA.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {IPP_DATA.designation} • {IPP_DATA.faculty}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                        {IPP_DATA.scope}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`mailto:${IPP_DATA.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2239] hover:text-[#22D3EE] transition-colors shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact IPP</span>
                  </a>
                </div>
              </div>
            )}

            {/* C. EXCO Officers Grid (3 Columns, matching image profile sizes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExco.map((officer: any) => (
                <DirectoryMemberCard
                  key={officer.id}
                  member={officer}
                  tierLabel="Executive Council"
                  tierBadge="EXCO Officer"
                  onSelect={setSelectedMember}
                />
              ))}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* TIER 3: BOARD OF DIRECTORS                                              */}
        {/* ======================================================================= */}
        {(activeTab === "all" || activeTab === "directors") && filteredDirectors.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tier 03 • Board of Directors
                </h2>
                <p className="text-xl font-bold text-slate-900 font-heading">
                  Portfolio Directorates
                </p>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Community Projects, Youth Impact &amp; Operations
              </span>
            </div>

            {/* 3 Columns for generous breathing room & matching image profile sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDirectors.map((dir: any) => (
                <DirectoryMemberCard
                  key={dir.id}
                  member={dir}
                  tierLabel="Directorate"
                  tierBadge="Portfolio Director"
                  onSelect={setSelectedMember}
                />
              ))}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* TIER 4: ASSISTANT DIRECTORS & PROJECT OFFICERS                           */}
        {/* ======================================================================= */}
        {(activeTab === "all" || activeTab === "assistants") && filteredAssistants.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tier 04 • Assistant Directors &amp; Project Officers
                </h2>
                <p className="text-xl font-bold text-slate-900 font-heading">
                  Field Operations &amp; Project Teams
                </p>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Execution, Fieldwork &amp; Project Delivery
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssistants.map((asst: any) => (
                <DirectoryMemberCard
                  key={asst.id}
                  member={asst}
                  tierLabel="Assistant Directorate"
                  tierBadge="Project Officer"
                  onSelect={setSelectedMember}
                />
              ))}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* TIER 5: EDITORIAL, DESIGN & MEDIA CREW                                  */}
        {/* ======================================================================= */}
        {(activeTab === "all" || activeTab === "crew") && filteredCrew.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tier 05 • Creative, Editorial &amp; Media Crew
                </h2>
                <p className="text-xl font-bold text-slate-900 font-heading">
                  Editorial &amp; Design Crew
                </p>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Publications, Digital Branding &amp; Visual Storytelling
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCrew.map((crew: any) => (
                <DirectoryMemberCard
                  key={crew.id}
                  member={crew}
                  tierLabel="Creative Wing"
                  tierBadge="Creative Crew"
                  onSelect={setSelectedMember}
                />
              ))}
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* TIER 6: SIGNATURE INITIATIVES & 2026/27 MILESTONES                     */}
        {/* ======================================================================= */}
        {(activeTab === "all" || activeTab === "initiatives") && (
          <section className="space-y-8 pt-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Leistic Year {leisticYear}
                </h2>
                <p className="text-xl font-bold text-slate-900 font-heading">
                  Signature Projects &amp; Milestone Events
                </p>
              </div>
              {photosDriveUrl && (
                <a
                  href={photosDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0B2239] text-xs font-semibold transition-colors border border-blue-100"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Official Photos Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Signature Projects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SIGNATURE_PROJECTS.map((proj: any) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <span className="inline-block text-[10px] font-bold text-[#0B2239] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                      {proj.tag || "Flagship"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-heading group-hover:text-[#0B2239] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {proj.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {proj.scope}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                    {proj.category}
                  </div>
                </div>
              ))}
            </div>

            {/* Milestone Events */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Key Assembly &amp; Calendar
                  </span>
                  <h3 className="text-xl font-bold font-heading">
                    2026 / 2027 Inauguration &amp; Fellowship Milestones
                  </h3>
                </div>
                {photosDriveUrl && (
                  <a
                    href={photosDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
                  >
                    <span>View Event Photo Albums</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {MILESTONE_EVENTS.map((ev: any) => (
                  <div
                    key={ev.id}
                    className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/60 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ev.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-white font-heading">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ev.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                      Venue: {ev.venue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ======================================================================= */}
        {/* 4. GOVERNANCE FOOTNOTE                                                  */}
        {/* ======================================================================= */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0B2239] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">
                  {GOVERNANCE?.title || "Official Governance Hierarchy & Lion Mentorship"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accredited under {district} • Sponsoring Parent: {sponsoringClub}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Chartered Since 2024
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1 border-t border-slate-100">
            {GOVERNANCE?.description ||
              "Operating under the charter of Lions Clubs International and the mentorship of the Lions Club of Ruhunu Millennium (Leo District 306 D8), our leadership hierarchy enforces transparency, student-led accountability, and strict adherence to the LCI Leo Club Constitution."}
          </p>
        </div>

      </div>

      {/* ======================================================================= */}
      {/* 5. MEMBER DETAILS MODAL                                                 */}
      {/* ======================================================================= */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <MemberAvatar
                initials={selectedMember.initials || "LEO"}
                image={selectedMember.image}
                size="modal"
                className="ring-4 ring-blue-50 shadow-md"
              />
              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="inline-block text-[10px] font-bold text-[#0B2239] uppercase tracking-wider bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                  {selectedMember.roleBadge || selectedMember.portfolio || "Leo Board"}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {selectedMember.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {selectedMember.designation}
                </p>
                {selectedMember.faculty && (
                  <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedMember.faculty}</span>
                  </p>
                )}
                {selectedMember.institution && (
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedMember.institution}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              <div>
                <span className="block font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                  Portfolio Responsibilities
                </span>
                <p>{selectedMember.scope || selectedMember.responsibilities || "Stewards leadership activities and community service across St. Thomas' College, Matara and Leo District 306 D8."}</p>
              </div>

              {selectedMember.motto && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-700">
                  {selectedMember.motto}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Leo District 306 D8
              </span>
              <a
                href={`mailto:${selectedMember.email}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2239] hover:bg-[#071A2B] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
