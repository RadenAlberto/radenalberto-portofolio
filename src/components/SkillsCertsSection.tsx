import React, { useMemo, useState } from 'react';
import { ArrowRight, Download, Github } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';
import {
  CERTIFICATES,
  ContributionDay,
  PROFILE,
  SKILL_GROUPS,
  getContributionWeeks,
} from '../data/portfolio';

export const SkillsCertsSection: React.FC = () => {
  const weeks = useMemo(() => getContributionWeeks(), []);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const totalContribs = useMemo(
    () => weeks.flat().reduce((acc, day) => acc + day.count, 0),
    [weeks]
  );

  const getCellColorClass = (level: ContributionDay['level']) => {
    switch (level) {
      case 0:
        return 'bg-slate-200/80 dark:bg-white/[0.06]';
      case 1:
        return 'bg-[#3B82F6]/30 dark:bg-[#3B82F6]/35';
      case 2:
        return 'bg-[#3B82F6]/60 dark:bg-[#3B82F6]/60';
      case 3:
        return 'bg-[#06B6D4]/75 dark:bg-[#06B6D4]/80';
      case 4:
        return 'bg-[#06B6D4] dark:bg-[#22D3EE] shadow-[0_0_8px_rgba(6,182,212,0.5)]';
    }
  };

  return (
    <section id="sertifikat" className="py-8 sm:py-12 space-y-16">
      {/* Top 2-Column Editorial Split: Headline + CV on Left, Perforated Credential Slips on Right */}
      <RevealOnScroll>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400">
              <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">05</span>
              <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
              <span>KREDENSIAL &amp; KEAHLIAN</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-[0.95]">
              Sertifikat
              <span className="block text-[#3B82F6] dark:text-[#06B6D4]">&amp; Keahlian</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Fondasi teknis dari perkuliahan Sistem Informasi di Universitas Tarumanagara, pelatihan Python intensif, serta eksperimen proyek web, mobile, dan data.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={PROFILE.cvUrl}
                download="CV_Raden_Alberto.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Unduh CV (PDF)</span>
              </a>

              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/20 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors whitespace-nowrap shrink-0"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Column: Perforated Ticket-Style Credential Slips */}
          <div className="lg:col-span-7 space-y-5">
            {CERTIFICATES.map((cert, idx) => {
              const badgeCode = idx === 0 ? 'PY' : 'SI';
              return (
                <div
                  key={cert.serial}
                  className="relative flex flex-col sm:flex-row items-stretch rounded-lg border border-slate-300 dark:border-white/15 bg-white/95 dark:bg-[#11131C]/95 overflow-hidden shadow-sm transition-colors hover:border-[#3B82F6]/60 dark:hover:border-[#06B6D4]/60"
                >
                  {/* Left Square Monogram Stub */}
                  <div className="sm:w-28 shrink-0 flex items-center justify-center p-5 bg-slate-50 dark:bg-[#0D0F17]">
                    <div
                      className={`w-14 h-14 rounded-lg border flex items-center justify-center font-display text-2xl font-extrabold tracking-tight ${
                        idx === 0
                          ? 'border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#2563EB] dark:text-[#60A5FA]'
                          : 'border-[#06B6D4]/40 bg-[#06B6D4]/10 text-[#0891B2] dark:text-[#22D3EE]'
                      }`}
                    >
                      {badgeCode}
                    </div>
                  </div>

                  {/* Vertical Perforation Divider with Ticket Cutouts */}
                  <div
                    aria-hidden="true"
                    className="relative hidden sm:flex flex-col items-center justify-between w-px border-l border-dashed border-slate-300 dark:border-white/20"
                  >
                    <span className="w-3.5 h-3.5 -mt-2 -ml-[7px] rounded-full border border-slate-300 dark:border-white/15 bg-[#F8FAFC] dark:bg-[#090A0F]" />
                    <span className="w-3.5 h-3.5 -mb-2 -ml-[7px] rounded-full border border-slate-300 dark:border-white/15 bg-[#F8FAFC] dark:bg-[#090A0F]" />
                  </div>

                  {/* Horizontal Perforation on Mobile */}
                  <div
                    aria-hidden="true"
                    className="sm:hidden h-px w-full border-t border-dashed border-slate-300 dark:border-white/20"
                  />

                  {/* Right Credential Content */}
                  <div className="flex-1 p-5 sm:p-6 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">
                        {cert.serial}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {cert.period}
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                      {cert.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RevealOnScroll>

      {/* Clean Unboxed 4-Column Architectural Skill Ledger */}
      <RevealOnScroll delayMs={60}>
        <div className="space-y-6">
          <div className="font-mono text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Inventaris Kompetensi Teknis
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.filename}
                className="pt-4 border-t border-slate-300 dark:border-white/20 space-y-3"
              >
                <div className="font-mono text-[11px] text-[#3B82F6] dark:text-[#06B6D4]">
                  {group.filename}
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                  {group.title}
                </h3>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-snug"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-xs bg-[#3B82F6] dark:bg-[#06B6D4] shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {/* Full-Width GitHub Activity Ledger */}
      <RevealOnScroll delayMs={100}>
        <div className="pt-10 border-t border-slate-200 dark:border-white/15 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Aktivitas GitHub · 26 Minggu Terakhir
              </div>
              <div className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                {totalContribs}{' '}
                <span className="text-[#3B82F6] dark:text-[#06B6D4]">Kontribusi Kode</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">
              <span>Sedikit</span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-slate-200/80 dark:bg-white/[0.06]" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#3B82F6]/35" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#3B82F6]/60" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#06B6D4]/80" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#06B6D4]" />
              <span>Banyak</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#11131C]/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 min-h-[20px]">
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {hoveredDay
                  ? `${hoveredDay.date} — ${hoveredDay.count} kontribusi kode`
                  : 'Arahkan kursor ke sel untuk melihat tanggal dan jumlah kontribusi'}
              </span>
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#3B82F6] dark:text-[#06B6D4] hover:underline"
              >
                <span>LIHAT PROFIL RADENALBERTO DI GITHUB</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="overflow-x-auto pb-1">
              <div
                className="grid grid-flow-col gap-1.5 sm:gap-2 min-w-[640px]"
                role="grid"
                aria-label="Grid aktivitas kontribusi kode 26 minggu terakhir"
              >
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="grid grid-rows-7 gap-1.5 sm:gap-2">
                    {week.map((day) => (
                      <button
                        key={day.date}
                        type="button"
                        onMouseEnter={() => setHoveredDay(day)}
                        onFocus={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        aria-label={`${day.date}: ${day.count} kontribusi`}
                        className={`w-full aspect-square min-w-[14px] rounded-[3px] transition-transform duration-100 hover:scale-125 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#06B6D4] cursor-pointer ${getCellColorClass(
                          day.level
                        )}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
