import React, { useEffect, useRef, useState } from 'react';
import { RevealOnScroll } from './RevealOnScroll';
import { UntarBuilding3D } from './UntarBuilding3D';
import { PROFILE } from '../data/portfolio';

interface AboutSectionProps {
  theme: 'dark' | 'light';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ theme }) => {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [barAnimated, setBarAnimated] = useState(false);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setBarAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const ipkPercent = (PROFILE.ipkCurrent / PROFILE.ipkMax) * 100;

  return (
    <section id="tentang" className="py-8 sm:py-12">
      <RevealOnScroll>
        {/* Architectural Double-Border Blueprint Container */}
        <div className="relative p-1.5 border border-slate-300 dark:border-white/20 bg-white/40 dark:bg-[#0D0F17]/45 backdrop-blur-[2px]">
          {/* Subtle Blueprint Corner Crosshairs */}
          <span
            aria-hidden="true"
            className="hidden sm:block absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#3B82F6] dark:border-[#06B6D4]"
          />
          <span
            aria-hidden="true"
            className="hidden sm:block absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#3B82F6] dark:border-[#06B6D4]"
          />

          <div className="border border-slate-300/80 dark:border-white/15 p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Editorial Identity & Academic Metrics */}
              <div className="lg:col-span-6 space-y-7">
                <div>
                  <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">02</span>
                    <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
                    <span>PROFIL &amp; AKADEMIK</span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                    Tentang Saya
                  </h2>
                </div>

                {/* Hairline Metadata Rows */}
                <dl className="divide-y divide-slate-200 dark:divide-white/10 border-y border-slate-200 dark:border-white/10">
                  <div className="py-3 grid grid-cols-12 gap-2 items-baseline">
                    <dt className="col-span-4 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Nama
                    </dt>
                    <dd className="col-span-8 text-sm sm:text-[15px] font-medium text-slate-900 dark:text-slate-100">
                      {PROFILE.fullName}
                    </dd>
                  </div>
                  <div className="py-3 grid grid-cols-12 gap-2 items-baseline">
                    <dt className="col-span-4 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Universitas
                    </dt>
                    <dd className="col-span-8 text-sm sm:text-[15px] text-slate-800 dark:text-slate-200">
                      Universitas Tarumanagara (UNTAR)
                    </dd>
                  </div>
                  <div className="py-3 grid grid-cols-12 gap-2 items-center">
                    <dt className="col-span-4 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Program Studi
                    </dt>
                    <dd className="col-span-8 flex flex-wrap items-center gap-2 text-sm sm:text-[15px] text-slate-800 dark:text-slate-200">
                      <span>S1 Sistem Informasi</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#3B82F6]/15 dark:bg-[#06B6D4]/20 border border-[#3B82F6]/30 dark:border-[#06B6D4]/40 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#2563EB] dark:text-[#22D3EE]">
                        Semester 5
                      </span>
                    </dd>
                  </div>
                  <div className="py-3 grid grid-cols-12 gap-2 items-baseline">
                    <dt className="col-span-4 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Minat Peran
                    </dt>
                    <dd className="col-span-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Web/Mobile Developer, Data Analyst, System Analyst, QA / IT Support
                    </dd>
                  </div>
                </dl>

                {/* Warm Grounded Bio Prose */}
                <div className="space-y-3">
                  {PROFILE.aboutParagraphs.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Crisp Side-by-Side Metric Boxes */}
                <div ref={progressRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Semester Box */}
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-white/15 bg-white/70 dark:bg-[#11131C]/80 space-y-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Semester · Studi Aktif
                    </div>
                    <div className="flex items-baseline gap-1 font-display">
                      <span className="text-4xl font-extrabold text-[#3B82F6] dark:text-[#06B6D4] tabular-nums leading-none">
                        0{PROFILE.semesterCurrent}
                      </span>
                      <span className="text-lg font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                        /0{PROFILE.semesterTotal}
                      </span>
                    </div>
                    <div
                      className="grid grid-cols-8 gap-1.5 pt-1"
                      role="img"
                      aria-label="Progres semester 5 dari 8 semester"
                    >
                      {Array.from({ length: PROFILE.semesterTotal }).map((_, i) => {
                        const step = i + 1;
                        const isCompleted = step < PROFILE.semesterCurrent;
                        const isCurrent = step === PROFILE.semesterCurrent;
                        return (
                          <span
                            key={step}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isCompleted
                                ? 'bg-[#3B82F6]'
                                : isCurrent
                                ? 'bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse'
                                : 'bg-slate-200 dark:bg-white/10'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* IPK Box */}
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-white/15 bg-white/70 dark:bg-[#11131C]/80 space-y-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      IPK · Indeks Prestasi
                    </div>
                    <div className="flex items-baseline gap-1 font-display">
                      <span className="text-4xl font-extrabold text-[#3B82F6] dark:text-[#06B6D4] tabular-nums leading-none">
                        {PROFILE.ipkCurrent.toFixed(2)}
                      </span>
                      <span className="text-lg font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                        /{PROFILE.ipkMax.toFixed(2)}
                      </span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mt-2.5"
                      role="progressbar"
                      aria-valuenow={PROFILE.ipkCurrent}
                      aria-valuemin={0}
                      aria-valuemax={PROFILE.ipkMax}
                      aria-label="Indeks Prestasi Kumulatif 3.23 dari 4.00"
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-transform duration-1000 ease-out origin-left"
                        style={{
                          width: `${ipkPercent}%`,
                          transform: barAnimated ? 'scaleX(1)' : 'scaleX(0)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Transparent 3D Interactive Gedung Utama UNTAR */}
              <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
                <div className="hidden lg:block absolute left-0 top-6 font-mono text-[10px] tracking-[0.35em] uppercase text-slate-400 dark:text-slate-500 [writing-mode:vertical-rl]">
                  GEDUNG UTAMA · UNTAR
                </div>
                <div className="w-full">
                  <UntarBuilding3D theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
