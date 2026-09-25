"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Calendar,
  Image as ImageIcon,
  PhoneCall,
  Download,
  FileText,
} from "lucide-react";
import { StcLeoOfficialLogo } from "@/components/ui/BrandingLogos";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileDownloadsOpen, setMobileDownloadsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dynamic scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const navLinkClass = (href: string) =>
    `relative px-3 py-2 rounded-xl transition-all duration-150 whitespace-nowrap ${
      isActive(href)
        ? "text-white after:absolute after:left-3 after:right-3 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-leo-cyan after:shadow-glow-cyan-lg"
        : "text-[#BAE6FD] hover:text-white hover:bg-white/5"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full max-w-full ${
        scrolled
          ? "bg-[#071A2B]/90 backdrop-blur-xl border-b border-white/10 shadow-glass"
          : "bg-[#071A2B] border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 w-full">
        <div
          className={`flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          
          {/* Official Brand Logo */}
          <Link href="/" className="relative flex items-center gap-2 group shrink-0">
            <div className="absolute -inset-3 rounded-full glow-cyan-ambient opacity-60 pointer-events-none" />
            <StcLeoOfficialLogo
              className="relative h-10 sm:h-12 w-auto group-hover:opacity-90 transition-opacity"
              theme="light"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[14px] font-semibold shrink-0">
            
            {/* 1. About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button
                type="button"
                className={navLinkClass("/about") + " flex items-center gap-1.5"}
              >
                <span>About Us</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    aboutOpen ? "rotate-180 text-leo-cyan" : "text-[#BAE6FD]/60"
                  }`}
                />
              </button>

              {aboutOpen && (
                <div className="absolute top-full left-0 w-72 glass-card-dark rounded-xl shadow-glass p-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50 space-y-1">
                  <Link
                    href="/about"
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 text-[#E0F7FF] hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-leo-cyan/10 text-leo-cyan flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-leo-cyan group-hover/item:text-[#071A2B] transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm leading-tight text-white">Our Story &amp; Heritage</div>
                      <div className="text-[11px] text-[#BAE6FD]/70 font-normal mt-0.5">Our story and heritage</div>
                    </div>
                  </Link>

                  <Link
                    href="/board"
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 text-[#E0F7FF] hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-leo-cyan/10 text-leo-cyan flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-leo-cyan group-hover/item:text-[#071A2B] transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm leading-tight text-white">Executive Board</div>
                      <div className="text-[11px] text-[#BAE6FD]/70 font-normal mt-0.5">Leistic year leaders</div>
                    </div>
                  </Link>

                  <Link
                    href="/about#lions-history"
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 text-[#E0F7FF] hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#7F1D2D]/15 text-[#B54759] flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-[#7F1D2D] group-hover/item:text-white transition-colors">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm leading-tight text-white">Lions Sponsorship</div>
                      <div className="text-[11px] text-[#BAE6FD]/70 font-normal mt-0.5">Lions Club of Ruhunu Millennium</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Projects Link */}
            <Link href="/projects" className={navLinkClass("/projects")}>
              Projects
            </Link>

            {/* 3. Events Link */}
            <Link href="/events" className={navLinkClass("/events")}>
              Events
            </Link>

            {/* 4. Downloads Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDownloadsOpen(true)}
              onMouseLeave={() => setDownloadsOpen(false)}
            >
              <button
                type="button"
                className={`relative px-3 py-2 rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                  isActive("/magazine") || isActive("/brand-and-forms")
                    ? "text-white after:absolute after:left-3 after:right-3 after:-bottom-[1px] after:h-[2px] after:rounded-full after:bg-leo-cyan after:shadow-glow-cyan-lg"
                    : "text-[#BAE6FD] hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Downloads</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    downloadsOpen ? "rotate-180 text-leo-cyan" : "text-[#BAE6FD]/60"
                  }`}
                />
              </button>

              {downloadsOpen && (
                <div className="absolute top-full left-0 w-72 glass-card-dark rounded-xl shadow-glass p-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50 space-y-1">
                  <Link
                    href="/magazine"
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 text-[#E0F7FF] hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-leo-cyan/10 text-leo-cyan flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-leo-cyan group-hover/item:text-[#071A2B] transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm leading-tight text-white">Leo Magazine</div>
                      <div className="text-[11px] text-[#BAE6FD]/70 font-normal mt-0.5">Annual reviews &amp; periodicals</div>
                    </div>
                  </Link>

                  <Link
                    href="/brand-and-forms"
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 text-[#E0F7FF] hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#7F1D2D]/15 text-[#B54759] flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-[#7F1D2D] group-hover/item:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm leading-tight text-white">Official Brand &amp; Forms</div>
                      <div className="text-[11px] text-[#BAE6FD]/70 font-normal mt-0.5">Logos, guidelines &amp; templates</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Contact Link */}
            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/join"
              className="hidden sm:inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-br from-[#0B2239] via-[#0EA5E9] to-[#22D3EE] bg-[length:200%_200%] bg-left hover:bg-right shadow-glow-cyan hover:shadow-glow-cyan-lg text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <span>Join Our Club</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2.5 rounded-xl text-[#E0F7FF] hover:bg-white/10 active:bg-white/15 transition-colors shrink-0 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer (Matches Desktop Hierarchy) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 bg-[#071A2B]/98 backdrop-blur-xl rounded-b-2xl pb-6">
            
            {/* 1. About Us (Accordion with sub-items) */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-[#E0F7FF] hover:bg-white/5 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-leo-cyan shrink-0" />
                  <span>About Us</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#BAE6FD]/50 transition-transform duration-200 ${
                    mobileAboutOpen ? "rotate-180 text-leo-cyan" : ""
                  }`}
                />
              </button>

              {mobileAboutOpen && (
                <div className="pl-11 pr-4 py-1.5 space-y-1 bg-white/5 rounded-xl mx-3 my-1 border border-white/10">
                  <Link
                    href="/about"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileAboutOpen(false);
                    }}
                    className="block py-2 text-xs font-semibold text-[#BAE6FD] hover:text-white transition-colors"
                  >
                    Our Story &amp; Heritage
                  </Link>
                  <Link
                    href="/board"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileAboutOpen(false);
                    }}
                    className="block py-2 text-xs font-semibold text-[#BAE6FD] hover:text-white transition-colors"
                  >
                    Executive Board
                  </Link>
                  <Link
                    href="/about#lions-history"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileAboutOpen(false);
                    }}
                    className="block py-2 text-xs font-semibold text-[#BAE6FD] hover:text-white transition-colors"
                  >
                    Lions Sponsorship
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Projects */}
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[#E0F7FF] hover:bg-white/5 hover:text-white transition-colors"
            >
              <Award className="w-4 h-4 text-leo-cyan shrink-0" />
              <span>Projects</span>
            </Link>

            {/* 3. Events */}
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[#E0F7FF] hover:bg-white/5 hover:text-white transition-colors"
            >
              <Calendar className="w-4 h-4 text-leo-cyan shrink-0" />
              <span>Events</span>
            </Link>

            {/* 4. Downloads (Accordion with sub-items) */}
            <div>
              <button
                type="button"
                onClick={() => setMobileDownloadsOpen(!mobileDownloadsOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm text-[#E0F7FF] hover:bg-white/5 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-leo-cyan shrink-0" />
                  <span>Downloads</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#BAE6FD]/50 transition-transform duration-200 ${
                    mobileDownloadsOpen ? "rotate-180 text-leo-cyan" : ""
                  }`}
                />
              </button>

              {mobileDownloadsOpen && (
                <div className="pl-11 pr-4 py-1.5 space-y-1 bg-white/5 rounded-xl mx-3 my-1 border border-white/10">
                  <Link
                    href="/magazine"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileDownloadsOpen(false);
                    }}
                    className="block py-2 text-xs font-semibold text-[#BAE6FD] hover:text-white transition-colors"
                  >
                    Leo Magazine
                  </Link>
                  <Link
                    href="/brand-and-forms"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileDownloadsOpen(false);
                    }}
                    className="block py-2 text-xs font-semibold text-[#BAE6FD] hover:text-white transition-colors"
                  >
                    Official Brand &amp; Forms
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Contact */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[#E0F7FF] hover:bg-white/5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-leo-cyan shrink-0" />
              <span>Contact</span>
            </Link>

            {/* 6. Join CTA */}
            <div className="pt-3 px-2">
              <Link
                href="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 bg-gradient-to-br from-[#0B2239] via-[#0EA5E9] to-[#22D3EE] text-white font-bold text-sm rounded-xl block shadow-glow-cyan transition-all duration-200"
              >
                Join Our Club
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
