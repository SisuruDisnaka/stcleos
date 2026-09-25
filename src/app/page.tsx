import React from "react";
import HeroSection from "@/components/home/HeroSection";
import AffiliationSection from "@/components/home/AffiliationSection";
import ImpactSection from "@/components/home/ImpactSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import EventsPreview from "@/components/home/EventsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. What We Are Part Of */}
      <AffiliationSection />

      {/* 3. Impact in Figures */}
      <ImpactSection />

      {/* 4. Featured Signature Projects */}
      <FeaturedProjects />

      {/* 5. Official Announcements & News */}
      <EventsPreview />

      {/* 6. Member Reflections / Testimonials */}
      <TestimonialsSection />
    </>
  );
}
