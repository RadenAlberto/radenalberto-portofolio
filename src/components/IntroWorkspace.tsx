import React, { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';

interface IntroWorkspaceProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const IntroWorkspace: React.FC<IntroWorkspaceProps> = ({ isVisible, onComplete }) => {
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const quickTimer = window.setTimeout(onComplete, 250);
      return () => window.clearTimeout(quickTimer);
    }

    // Automatically start zoom-in shortly after mount without requiring clicks
    const startZoomTimer = window.setTimeout(() => {
      setIsZooming(true);
    }, 1050);

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      window.clearTimeout(startZoomTimer);
      window.clearTimeout(completeTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      aria-label="Intro Ruang Kerja Digital Raden Alberto"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06070B] text-slate-100 overflow-hidden select-none transition-opacity duration-700 ease-out ${
        isZooming ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle architectural dark room grid & soft blue-cyan ambient light */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundSize: '44px 44px',
          backgroundImage:
            'linear-gradient(to right, rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.08) 1px, transparent 1px)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,760px)] h-[420px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(59,130,246,0.14) 45%, transparent 75%)',
        }}
      />

      {/* Computer Monitor + Minimalist Desk Assembly */}
      <div
        className={`relative z-10 flex flex-col items-center w-full max-w-3xl px-4 transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isZooming ? 'scale-[3.2]' : 'scale-100'
        }`}
      >
        {/* Monitor Outer Frame */}
        <div className="relative w-full max-w-[660px] rounded-2xl p-[10px] sm:p-3 bg-gradient-to-b from-[#1B1F2E] to-[#10121B] border border-white/15 shadow-[0_32px_90px_rgba(0,0,0,0.85),0_0_50px_rgba(59,130,246,0.16)]">
          {/* Top Webcam & Sensor */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span className="w-1 h-1 rounded-full bg-[#06B6D4]/70" />
          </div>

          {/* Monitor Screen */}
          <div className="relative rounded-xl overflow-hidden bg-[#090A0F] border border-white/10 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between">
            {/* Screen Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0D0F17]">
              <div className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span className="font-mono text-[11px] text-slate-400">
                  workspace://raden-alberto
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">2026</span>
            </div>

            {/* Screen Center Greeting */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10 sm:px-12">
              <p className="font-mono text-xs text-[#06B6D4] tracking-wide mb-3">
                DIGITAL WORKSPACE · UNTAR SI
              </p>
              <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-white max-w-xl leading-snug text-balance">
                Halo, selamat datang di ruang kerja digital Raden Alberto.
              </h1>
              {/* Smooth loading progress bar */}
              <div className="mt-7 w-40 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] origin-left animate-[pulse_1s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Screen Bottom Prompt */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#0C0E15] flex items-center justify-between font-mono text-[11px] text-slate-500">
              <span>raden-alberto.dev</span>
              <span>membuka...</span>
            </div>
          </div>
        </div>

        {/* Monitor Neck & Stand */}
        <div className="flex flex-col items-center" aria-hidden="true">
          <div className="w-20 sm:w-24 h-8 sm:h-10 bg-gradient-to-b from-[#1A1E2B] to-[#11141E] border-x border-white/10" />
          <div className="w-48 sm:w-56 h-2.5 rounded-t-md bg-gradient-to-r from-[#141824] via-[#242A3D] to-[#141824] border border-white/10" />
        </div>

        {/* Minimalist Desk Surface & Peripherals */}
        <div
          className="relative w-[min(94vw,860px)] mt-0.5 pt-4 pb-2 flex flex-col items-center"
          aria-hidden="true"
        >
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6]/45 to-transparent" />
          <div className="w-full h-14 bg-gradient-to-b from-[#10131D]/90 to-transparent flex items-start justify-center gap-6 pt-3">
            <div className="w-44 sm:w-56 h-4 rounded-sm bg-[#181C29] border border-white/10 shadow-inner" />
            <div className="w-7 h-4 rounded-full bg-[#181C29] border border-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};
