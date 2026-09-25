import React from "react";

interface CyanBarProps {
  className?: string;
  width?: string;
  height?: string;
}

export default function CyanBar({ className = "", width = "w-10", height = "h-1" }: CyanBarProps) {
  return (
    <div
      className={`bg-leo-cyan rounded-full ${width} ${height} mb-3.5 transition-all duration-300 ${className}`}
      aria-hidden="true"
    />
  );
}
