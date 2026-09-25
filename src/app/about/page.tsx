"use client";

import React from "react";
import { useClub } from "@/context/ClubContext";
import CyanBar from "@/components/ui/CyanBar";
import {
  Award,
  Globe,
  Users,
  Compass,
  CheckCircle2,
  Shield,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  const { club } = useClub();

  return (
    <div className="bg-white">
      
      {/* Page Hero */}
      <section className="bg-gradient-to-b from-leo-pearl via-white to-white py-16 lg:py-24 border-b border-leo-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-3xl">
            <CyanBar />
            <span className="block text-xs font-bold tracking-[0.14em] text-leo-slate uppercase mb-2">
              OUR HERITAGE & MISSION
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-leo-charcoal tracking-tight leading-tight mb-6">
              Leadership, Experience, Opportunity Since {club.charterYear}.
            </h1>
            <p className="text-lg text-leo-slate leading-relaxed">
              We are part of the world’s largest youth service organization, empowering young leaders across {club.district} to serve their local communities, develop critical executive leadership skills, and foster lasting global fellowship.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story & Melvin Jones Heritage */}
      <section id="lions-history" className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <CyanBar />
              <span className="text-xs font-bold tracking-widest text-leo-slate uppercase">
                THE FOUNDATION
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-leo-charcoal tracking-tight">
                Born From A Century of Global Service
              </h2>
              <p className="text-leo-slate text-base leading-relaxed">
                In 1917, Melvin Jones, a Chicago business leader, asked a simple question: <em>"What if people put their talents to work improving their communities?"</em> That spark ignited Lions Clubs International (LCI), which has grown into 1.4 million passionate humanitarians across 200+ countries.
              </p>
              <p className="text-leo-slate text-base leading-relaxed">
                In 1957, the first Leo Club was chartered at Abington High School, Pennsylvania, by Lion Jim Graver. Since then, the Leo movement has become the premier training ground for youth worldwide.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-leo-border">
                <div className="bg-leo-pearl p-4 rounded-2xl text-center">
                  <div className="font-heading font-extrabold text-2xl text-leo-blue">1917</div>
                  <div className="text-xs text-leo-slate font-medium">Lions Founded</div>
                </div>
                <div className="bg-leo-pearl p-4 rounded-2xl text-center">
                  <div className="font-heading font-extrabold text-2xl text-leo-cyan">1957</div>
                  <div className="text-xs text-leo-slate font-medium">Leo Movement</div>
                </div>
                <div className="bg-leo-pearl p-4 rounded-2xl text-center">
                  <div className="font-heading font-extrabold text-2xl text-leo-gold">150+</div>
                  <div className="text-xs text-leo-slate font-medium">Countries</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white bg-leo-dark">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80"
                  alt="Fellowship and Service"
                  className="w-full h-[460px] object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The 3 Core Pillars: L-E-O */}
      <section className="py-20 bg-leo-pearl border-y border-leo-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex justify-center">
              <CyanBar />
            </div>
            <span className="text-xs font-bold tracking-widest text-leo-slate uppercase mb-2 block">
              OUR CORE PHILOSOPHY
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-leo-charcoal tracking-tight">
              What "LEO" Stands For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Leadership */}
            <div className="bg-white rounded-xl p-8 border border-leo-border shadow-sm hover:shadow-card transition-card space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-leo-cyan-light text-leo-blue flex items-center justify-center font-heading font-extrabold text-2xl">
                L
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-leo-charcoal">
                Leadership
              </h3>
              <p className="text-sm text-leo-slate leading-relaxed">
                Develop essential executive skills by managing large-scale community projects, organizing district conferences, directing fundraising campaigns, and motivating volunteer teams.
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl p-8 border border-leo-border shadow-sm hover:shadow-card transition-card space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-heading font-extrabold text-2xl">
                E
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-leo-charcoal">
                Experience
              </h3>
              <p className="text-sm text-leo-slate leading-relaxed">
                Gain hands-on real-world experience understanding social challenges, working directly with underprivileged communities, and learning how teamwork translates into lasting positive change.
              </p>
            </div>

            {/* Opportunity */}
            <div className="bg-white rounded-xl p-8 border border-leo-border shadow-sm hover:shadow-card transition-card space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-heading font-extrabold text-2xl">
                O
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-leo-charcoal">
                Opportunity
              </h3>
              <p className="text-sm text-leo-slate leading-relaxed">
                Access an international network of over 1.4 million Lions and 175,000 Leos. Participate in global youth exchange programs, international conventions, and career mentorship.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Organizational Hierarchy Tree */}
      <section id="hierarchy" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          
          <div className="max-w-3xl mb-14">
            <CyanBar />
            <span className="text-xs font-bold tracking-widest text-leo-slate uppercase mb-2 block">
              GOVERNANCE & AFFILIATION
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-leo-charcoal tracking-tight">
              Our Organizational Structure
            </h2>
            <p className="text-leo-slate text-base mt-2">
              How our local club connects to the global humanitarian ecosystem of Lions Clubs International.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            <div className="p-6 rounded-2xl bg-leo-blue text-white flex items-center gap-6 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-extrabold text-lg">
                1
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-widest text-leo-cyan">Global Level</div>
                <div className="font-heading font-extrabold text-xl">Lions Clubs International (LCI) - Oak Brook, USA</div>
                <div className="text-xs text-slate-200 mt-1">1.4 Million Members across 200+ Countries & Geographic Areas</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-leo-navy text-white flex items-center gap-6 shadow-md ml-0 sm:ml-6">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-extrabold text-lg">
                2
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-widest text-leo-cyan">Multiple District Level</div>
                <div className="font-heading font-extrabold text-xl">Multiple District 306 (Sri Lanka & Republic of Maldives)</div>
                <div className="text-xs text-slate-200 mt-1">Coordinating 12 Sub-Districts, 210+ Clubs, and 10,000+ Young Leaders</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-leo-pearl text-leo-charcoal border border-leo-border flex items-center gap-6 shadow-sm ml-0 sm:ml-12">
              <div className="w-12 h-12 rounded-xl bg-leo-blue text-white flex items-center justify-center font-extrabold text-lg">
                3
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-widest text-leo-blue">District & Club Level</div>
                <div className="font-heading font-extrabold text-xl">{club.name} ({club.district})</div>
                <div className="text-xs text-leo-slate mt-1">Directly executing local community service, youth camps, and humanitarian relief.</div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
