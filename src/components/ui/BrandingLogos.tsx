import React from "react";

// Official Leo Club of St. Thomas' College Badge (Full Lockup: Lion Emblem + "ALPHA" + Club Name)
// The badge already sits on a white disc, so it reads cleanly on both light and dark backgrounds.
export function StcLeoOfficialLogo({
  className = "h-11 w-auto",
  theme = "dark", // kept for API compatibility; the badge itself works on any background
  alt = "Leo Club of St. Thomas' College, Matara",
}: {
  className?: string;
  theme?: "dark" | "light";
  alt?: string;
}) {
  void theme;
  return (
    <img
      src="/logos/stc-leo-badge.png"
      alt={alt}
      className={`${className} object-contain select-none`}
    />
  );
}

// Circular Leo Club Emblem only (same badge, used at smaller sizes)
export function StcLeoEmblem({
  className = "w-12 h-12",
  theme = "dark",
  alt = "Leo Club of St. Thomas' College Emblem",
}: {
  className?: string;
  theme?: "dark" | "light";
  alt?: string;
}) {
  void theme;
  return (
    <img
      src="/logos/stc-leo-badge.png"
      alt={alt}
      className={`${className} object-contain select-none shrink-0`}
    />
  );
}

// St. Thomas' College School Crest ("Perseverando Vinces")
export function StcCollegeCrest({
  className = "w-12 h-12",
  alt = "St. Thomas' College, Matara Crest",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src="/logos/stc-crest.png"
      alt={alt}
      className={`${className} object-contain select-none shrink-0`}
    />
  );
}

// Aliases kept for backward compatibility within the codebase
export const LeoEmblemSvg = StcLeoEmblem;

// Official Lions Clubs International Emblem
export function LionsEmblemSvg({
  className = "w-12 h-12",
  alt = "Lions International Emblem",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src="/logos/lions-international.png"
      alt={alt}
      className={`${className} object-contain select-none shrink-0 drop-shadow-sm`}
    />
  );
}

export const LionsInternationalLogo = LionsEmblemSvg;
export const LionsEmblem = LionsEmblemSvg;

// Leo District 306 D8 marker — no official district seal supplied, so we use the
// club's own crest here rather than inventing or reusing an unrelated district emblem.
export function DistrictEmblemSvg({
  className = "w-12 h-12",
  alt = "St. Thomas' College Crest",
}: {
  className?: string;
  alt?: string;
}) {
  return <StcCollegeCrest className={className} alt={alt} />;
}

export const DistrictEmblem = DistrictEmblemSvg;

// Background subtle line-art doodle pattern
export function CardDoodlePattern({ className = "absolute inset-0 pointer-events-none" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M420 40 C410 45 400 48 390 42 C380 36 385 24 395 28 C405 32 415 30 425 22 C430 30 428 36 420 40 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
      <rect
        x="380"
        y="80"
        width="65"
        height="55"
        rx="12"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.1"
      />
      <circle cx="270" cy="50" r="30" stroke="currentColor" strokeWidth="1.2" opacity="0.08" strokeDasharray="3 3" />
    </svg>
  );
}
