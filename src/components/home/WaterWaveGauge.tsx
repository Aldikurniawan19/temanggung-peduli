"use client";

import React from "react";

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
  // Clamped percentage between 5 and 95 for visual aesthetics (so water is always visible in sphere)
  const clampedPercent = Math.min(Math.max(percent, 5), 98);

  return (
    <div
      className="relative shrink-0 rounded-full overflow-hidden select-none"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 30%, #EBF5EF 0%, #D1E7DD 70%, #B8D8C8 100%)",
        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.7), 0 2px 6px rgba(24,83,52,0.15)",
        border: "2px solid rgba(24, 83, 52, 0.25)",
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
        className="absolute inset-x-0 bottom-0 transition-all duration-1000 ease-out"
        style={{ height: `${clampedPercent}%` }}
      >
        {/* Dual Animated Water Waves on the surface */}
        <div className="absolute -top-3 inset-x-0 h-4 overflow-visible pointer-events-none">
          {/* Back Wave (Deeper Green / Slower) */}
          <div
            className="absolute top-0 left-0 w-[200%] h-full opacity-70 animate-water-wave-back"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0,10 C25,18 75,2 100,10 L100,20 L0,20 Z' fill='%23124229'/%3E%3C/svg%3E")`,
              backgroundSize: "50% 100%",
              backgroundRepeat: "repeat-x",
            }}
          />

          {/* Front Wave (Fresh Emerald Water / Faster with Highlights) */}
          <div
            className="absolute top-0.5 left-0 w-[200%] h-full opacity-90 animate-water-wave-front"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0,10 C30,3 70,17 100,10 L100,20 L0,20 Z' fill='%231D6B3F'/%3E%3C/svg%3E")`,
              backgroundSize: "50% 100%",
              backgroundRepeat: "repeat-x",
            }}
          />

          {/* Surface Meniscus / Specular Foam Line */}
          <div
            className="absolute top-0.5 left-0 w-[200%] h-[2px] opacity-60 animate-water-wave-front"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 2'%3E%3Cpath d='M0,1 Q25,0 50,1 T100,1' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: "50% 100%",
              backgroundRepeat: "repeat-x",
            }}
          />
        </div>

        {/* Deep Water Body Fill with realistic fluid vertical gradient */}
        <div
          className="w-full h-full"
          style={{
            background: "linear-gradient(to bottom, #1D6B3F 0%, #165632 40%, #0F3D23 100%)",
          }}
        />

        {/* Rising Fluid Bubbles */}
        <div
          className="absolute bottom-1 left-3 w-1 h-1 rounded-full bg-white/70 animate-bubble-1 pointer-events-none"
        />
        <div
          className="absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full bg-white/60 animate-bubble-2 pointer-events-none"
        />
      </div>

      {/* Glass Sphere Specular Highlights (Pantulan Kaca Air) */}
      <div
        className="absolute top-1 left-2 rounded-full bg-white/65 blur-[0.3px] -rotate-25 pointer-events-none"
        style={{
          width: size >= 60 ? `${Math.round(size * 0.22)}px` : "14px",
          height: size >= 60 ? `${Math.round(size * 0.09)}px` : "6px",
        }}
      />
      <div
        className="absolute bottom-1 right-2 rounded-full bg-white/30 blur-[0.5px] pointer-events-none"
        style={{
          width: size >= 60 ? `${Math.round(size * 0.14)}px` : "8px",
          height: size >= 60 ? `${Math.round(size * 0.07)}px` : "4px",
        }}
      />

      {/* Percentage Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span
            className="font-black tracking-tight"
            style={{
              fontSize: size >= 60 ? `${Math.round(size * 0.23)}px` : "11px",
              color: clampedPercent >= 45 ? "#FFFFFF" : "#124229",
              textShadow:
                clampedPercent >= 45
                  ? "0 1px 2px rgba(0, 0, 0, 0.85)"
                  : "0 1px 1px rgba(255, 255, 255, 0.9)",
            }}
          >
            {percent}%
          </span>
        </div>
      )}

      {/* Inline styles for keyframe animations */}
      <style jsx>{`
        @keyframes waterWaveFront {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes waterWaveBack {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes bubbleRise1 {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0;
          }
          40% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-24px) scale(1);
            opacity: 0;
          }
        }
        @keyframes bubbleRise2 {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.75;
          }
          100% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0;
          }
        }
        .animate-water-wave-front {
          animation: waterWaveFront 2.6s linear infinite;
        }
        .animate-water-wave-back {
          animation: waterWaveBack 3.9s linear infinite;
        }
        .animate-bubble-1 {
          animation: bubbleRise1 2.8s ease-in infinite;
        }
        .animate-bubble-2 {
          animation: bubbleRise2 3.4s ease-in 1.2s infinite;
        }
      `}</style>
    </div>
  );
}
