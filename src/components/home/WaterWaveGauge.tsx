"use client";

import React, { useState, useEffect } from "react";

interface WaterWaveGaugeProps {
  percent: number; // 0 - 100
  size?: number; // pixel diameter, default 48
  showLabel?: boolean;
}

export function WaterWaveGauge({
  percent,
  size = 48,
  showLabel = true,
}: WaterWaveGaugeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clamped percentage between 5 and 96 for visual aesthetics (so water is always visible in sphere)
  const clampedPercent = Math.min(Math.max(percent, 5), 96);
  const sizePx = `${size}px`;

  return (
    <div
      suppressHydrationWarning
      className="relative shrink-0 rounded-full overflow-hidden select-none"
      style={{
        width: sizePx,
        height: sizePx,
        background: "radial-gradient(circle at 35% 25%, #F0F9FF 0%, #E0F2FE 55%, #BAE6FD 100%)",
        boxShadow:
          "inset 0 3px 6px rgba(3, 105, 161, 0.28), inset 0 -2px 5px rgba(255, 255, 255, 0.85), 0 3px 10px rgba(14, 165, 233, 0.25)",
        border: "2px solid rgba(14, 165, 233, 0.45)",
      }}
      title={`Progres Donasi: ${percent}% dari target`}
      aria-label={`Indikator air donasi: ${percent}%`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Water Container that rises from bottom based on clampedPercent */}
      <div
        suppressHydrationWarning
        className="absolute inset-x-0 bottom-0 transition-all duration-1000 ease-out"
        style={{ height: `${clampedPercent}%` }}
      >
        {/* Dual Animated Water Waves on the surface */}
        <div
          suppressHydrationWarning
          className="absolute -top-3.5 inset-x-0 h-4.5 overflow-visible pointer-events-none"
        >
          {/* Back Wave (Deep Ocean Blue / Slower Parallax Flow) */}
          <div
            suppressHydrationWarning
            className={`absolute top-0 left-0 w-[200%] h-full opacity-70 ${
              isMounted ? "animate-water-wave-back" : ""
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0,10 C25,18 75,2 100,10 L100,20 L0,20 Z' fill='%230284C7'/%3E%3C/svg%3E")`,
              backgroundSize: "50% 100%",
              backgroundRepeat: "repeat-x",
            }}
          />

          {/* Front Wave (Crystal Aqua Sky Blue / Faster with Surface Sheen) */}
          <div
            suppressHydrationWarning
            className={`absolute top-0.5 left-0 w-[200%] h-full opacity-95 ${
              isMounted ? "animate-water-wave-front" : ""
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0,10 C30,3 70,17 100,10 L100,20 L0,20 Z' fill='%2338BDF8'/%3E%3C/svg%3E")`,
              backgroundSize: "50% 100%",
              backgroundRepeat: "repeat-x",
            }}
          />

          {/* Surface Meniscus / Specular Foam Line (Tegangan Permukaan Air Mengkilap) */}
          <div
            suppressHydrationWarning
            className={`absolute top-0.5 left-0 w-[200%] h-[2.5px] opacity-80 ${
              isMounted ? "animate-water-wave-front" : ""
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 2'%3E%3Cpath d='M0,1 Q25,0 50,1 T100,1' stroke='%23ffffff' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: "50% 100%",
              backgroundRepeat: "repeat-x",
            }}
          />
        </div>

        {/* Deep Clear Water Body Fill with realistic fluid vertical gradient */}
        <div
          suppressHydrationWarning
          className="w-full h-full relative overflow-hidden"
          style={{
            background:
              "linear-gradient(to bottom, #38BDF8 0%, #0EA5E9 25%, #0284C7 60%, #0369A1 100%)",
          }}
        >
          {/* Subtle Caustic Shimmer Light Rays in water */}
          <div
            suppressHydrationWarning
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Rising Fluid Effervescent Bubbles (Gelembung Air Alami) */}
        {isMounted && (
          <>
            <div className="absolute bottom-1 left-2.5 w-1 h-1 rounded-full bg-white/80 animate-bubble-1 pointer-events-none" />
            <div className="absolute bottom-2 right-2.5 w-1.5 h-1.5 rounded-full bg-white/70 animate-bubble-2 pointer-events-none" />
            <div className="absolute bottom-0.5 left-1/2 w-1 h-1 rounded-full bg-white/60 animate-bubble-3 pointer-events-none" />
          </>
        )}
      </div>

      {/* Glass Sphere Specular Highlights (Pantulan Kaca Bening Air) */}
      <div
        suppressHydrationWarning
        className="absolute top-1 left-2 rounded-full bg-white/80 blur-[0.25px] -rotate-25 pointer-events-none"
        style={{
          width: size >= 60 ? `${Math.round(size * 0.24)}px` : "14px",
          height: size >= 60 ? `${Math.round(size * 0.1)}px` : "6px",
        }}
      />
      <div
        suppressHydrationWarning
        className="absolute bottom-1 right-2 rounded-full bg-white/35 blur-[0.4px] pointer-events-none"
        style={{
          width: size >= 60 ? `${Math.round(size * 0.16)}px` : "9px",
          height: size >= 60 ? `${Math.round(size * 0.08)}px` : "4px",
        }}
      />

      {/* Percentage Center Label with dynamic contrast against water depth */}
      {showLabel && (
        <div
          suppressHydrationWarning
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <span
            suppressHydrationWarning
            className="font-black tracking-tight"
            style={{
              fontSize: size >= 60 ? `${Math.round(size * 0.23)}px` : "11px",
              color: clampedPercent >= 45 ? "#FFFFFF" : "#0369A1",
              textShadow:
                clampedPercent >= 45
                  ? "0 1px 3px rgba(2, 60, 95, 0.95), 0 0 1px rgba(0, 0, 0, 0.4)"
                  : "0 1px 2px rgba(255, 255, 255, 0.95)",
            }}
          >
            {percent}%
          </span>
        </div>
      )}
    </div>
  );
}
