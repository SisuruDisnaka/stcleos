"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CLUBS_DATA, ClubConfig } from "@/config/club.config";
import {
  isFirebaseConfigured,
  subscribeFirestoreDoc,
  INITIAL_CLUB_PROFILE,
  INITIAL_HERO_SLIDES,
  INITIAL_TESTIMONIALS,
  INITIAL_PILLARS,
  INITIAL_FAQS,
} from "@/lib/firebase";

export interface HeroSlideItem {
  id: number | string;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

interface ClubContextType {
  activeClubId: string;
  club: ClubConfig;
  setClubId: (id: string) => void;
  availableClubs: { id: string; name: string; shortName: string; district: string }[];
  heroSlides: HeroSlideItem[];
  faqs: FaqItem[];
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export function ClubProvider({ children }: { children: ReactNode }) {
  const [activeClubId, setActiveClubId] = useState<string>("leo-stc");
  const [clubState, setClubState] = useState<ClubConfig>(CLUBS_DATA["leo-stc"]);
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>(INITIAL_HERO_SLIDES);
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      // 1. Dynamic Club Profile & Contact Info
      const unsubProfile = subscribeFirestoreDoc(
        "settings",
        "club_profile",
        INITIAL_CLUB_PROFILE,
        (profileDoc: any) => {
          if (profileDoc && profileDoc.name) {
            setClubState((prev) => ({
              ...prev,
              ...profileDoc,
              logos: { ...prev.logos, ...(profileDoc.logos || {}) },
              contact: {
                ...prev.contact,
                ...(profileDoc.contact || {}),
                socials: {
                  ...(prev.contact?.socials || {}),
                  ...(profileDoc.contact?.socials || {}),
                },
              },
            }));
          }
        }
      );

      // 2. Dynamic Hero Carousel Slides
      const unsubHero = subscribeFirestoreDoc(
        "settings",
        "hero_slides",
        { slides: INITIAL_HERO_SLIDES },
        (heroDoc: any) => {
          if (heroDoc?.slides && Array.isArray(heroDoc.slides) && heroDoc.slides.length > 0) {
            setHeroSlides(heroDoc.slides);
          }
        }
      );

      // 3. Dynamic Testimonials
      const unsubTestimonials = subscribeFirestoreDoc(
        "settings",
        "testimonials",
        { testimonials: INITIAL_TESTIMONIALS },
        (testDoc: any) => {
          if (
            testDoc?.testimonials &&
            Array.isArray(testDoc.testimonials) &&
            testDoc.testimonials.length > 0
          ) {
            setClubState((prev) => ({
              ...prev,
              testimonials: testDoc.testimonials,
            }));
          }
        }
      );

      // 4. Dynamic Pillars / Causes
      const unsubPillars = subscribeFirestoreDoc(
        "settings",
        "pillars",
        { pillars: INITIAL_PILLARS },
        (pillarDoc: any) => {
          if (
            pillarDoc?.pillars &&
            Array.isArray(pillarDoc.pillars) &&
            pillarDoc.pillars.length > 0
          ) {
            setClubState((prev) => ({
              ...prev,
              pillars: pillarDoc.pillars,
            }));
          }
        }
      );

      // 5. Dynamic FAQs
      const unsubFaqs = subscribeFirestoreDoc(
        "settings",
        "faqs",
        { faqs: INITIAL_FAQS },
        (faqDoc: any) => {
          if (faqDoc?.faqs && Array.isArray(faqDoc.faqs) && faqDoc.faqs.length > 0) {
            setFaqs(faqDoc.faqs);
          }
        }
      );

      return () => {
        if (typeof unsubProfile === "function") unsubProfile();
        if (typeof unsubHero === "function") unsubHero();
        if (typeof unsubTestimonials === "function") unsubTestimonials();
        if (typeof unsubPillars === "function") unsubPillars();
        if (typeof unsubFaqs === "function") unsubFaqs();
      };
    }
  }, []);

  const availableClubs = Object.values(CLUBS_DATA).map((c) => ({
    id: c.id,
    name: c.name,
    shortName: c.shortName,
    district: c.district,
  }));

  const setClubId = (id: string) => {
    if (CLUBS_DATA[id]) {
      setActiveClubId(id);
      setClubState(CLUBS_DATA[id]);
    }
  };

  return (
    <ClubContext.Provider
      value={{
        activeClubId,
        club: clubState,
        setClubId,
        availableClubs,
        heroSlides,
        faqs,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error("useClub must be used within a ClubProvider");
  }
  return context;
}

