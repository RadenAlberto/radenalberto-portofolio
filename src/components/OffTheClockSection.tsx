import React from 'react';
import { Gamepad2, Headphones } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const LofiWorkspaceDisc: React.FC = () => {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mx-auto select-none">
      {/* Outer Orbital Ring */}
      <div
        aria-hidden="true"
        className="relative w-full h-full rounded-full overflow-hidden border border-[#3B82F6]/30 dark:border-[#06B6D4]/30 flex items-center justify-center shadow-inner"
        style={{
          background:
            'radial-gradient(circle at 45% 40%, rgba(6,182,212,0.22), rgba(59,130,246,0.14) 55%, rgba(15,23,42,0.06) 80%)',
        }}
      >
        {/* Horizontal Architectural Scan Stripes Across Lower Half */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 flex flex-col justify-evenly opacity-55 dark:opacity-75">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-2 bg-[#F8FAFC] dark:bg-[#090A0F]"
            />
          ))}
        </div>

        {/* Concentric Vinyl & Blueprint Grooves */}
        <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-[#3B82F6]/35 dark:border-[#06B6D4]/40 flex items-center justify-center bg-[#F8FAFC]/60 dark:bg-[#090A0F]/60 backdrop-blur-[2px]">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-dashed border-[#3B82F6]/45 dark:border-[#06B6D4]/50 flex flex-col items-center justify-center gap-2">
            {/* Animated Lofi Equalizer */}
            <div className="flex items-end gap-1 h-6" aria-hidden="true">
              <span className="w-1 h-full bg-[#3B82F6] rounded-full animate-lofi-eq" />
              <span
                className="w-1 h-full bg-[#06B6D4] rounded-full animate-lofi-eq"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-1 h-full bg-[#3B82F6] dark:bg-[#22D3EE] rounded-full animate-lofi-eq"
                style={{ animationDelay: '0.4s' }}
              />
              <span
                className="w-1 h-full bg-[#06B6D4] rounded-full animate-lofi-eq"
                style={{ animationDelay: '0.15s' }}
              />
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#2563EB] dark:text-[#22D3EE]">
              LOFI · LUAU
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Corner Coordinate Tag */}
      <span className="absolute -bottom-2 right-4 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/15 bg-white dark:bg-[#11131C] font-mono text-[10px] text-slate-500 dark:text-slate-400 shadow-sm">
        bpm 72 · ambient
      </span>
    </div>
  );
};

export const OffTheClockSection: React.FC = () => {
  return (
    <section id="off-the-clock" className="py-8 sm:py-14">
      <RevealOnScroll>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Geometric Lofi Disc */}
          <div className="lg:col-span-5">
            <LofiWorkspaceDisc />
          </div>

          {/* Right Open-Canvas Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">06</span>
                <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
                <span>OFF THE CLOCK</span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-[0.95]">
                Di Luar Jam Koding
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Saat sedang beristirahat dari tugas kuliah atau sesi ngoding, saya biasanya menikmati musik Lofi dan instrumental piano untuk menjaga fokus, atau mengeksplorasi mekanik pengembangan game ringan menggunakan Luau dan Roblox Studio.
            </p>

            <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />
                <span>LOFI &amp; PIANO INSTRUMENTAL</span>
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-white/20">
                ·
              </span>
              <span className="inline-flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />
                <span>LUAU &amp; ROBLOX STUDIO</span>
              </span>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
