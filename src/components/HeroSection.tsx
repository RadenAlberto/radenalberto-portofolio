import React, { useState } from 'react';
import { ArrowDownRight, Check, Copy, Download, Github, User } from 'lucide-react';
import { PROFILE } from '../data/portfolio';

export interface HeroViewProps {
  copied: boolean;
  onCopyEmail: () => void;
  onExploreProjects: () => void;
  onExploreAbout?: () => void;
  theme?: 'dark' | 'light';
}

export const HeroSection: React.FC<HeroViewProps> = ({
  copied,
  onCopyEmail,
  onExploreProjects,
}) => {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section
      id="top"
      aria-label="Beranda Raden Alberto Lumintu Negoro"
      className="pt-8 sm:pt-12 lg:pt-16 pb-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Clean Editorial Intro */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400">
            <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">01</span>
            <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
            <span>Raden Alberto · Portofolio 2026</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.4rem] font-extrabold uppercase tracking-tight leading-[0.94] text-slate-900 dark:text-slate-100 text-balance">
            <span className="block">Raden</span>
            <span className="block text-[#3B82F6] dark:text-[#06B6D4]">Alberto</span>
            <span className="block">Lumintu Negoro</span>
          </h1>

          <p className="font-editorial text-base sm:text-[1.12rem] text-slate-700 dark:text-slate-200 leading-[1.65] max-w-xl">
            {PROFILE.headlineSub}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onExploreProjects}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
            >
              <span>Lihat Proyek</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <a
              href={PROFILE.cvUrl}
              download="CV_Raden_Alberto.pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
            >
              <Download className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />
              <span>Unduh CV</span>
            </a>

            <button
              type="button"
              onClick={onCopyEmail}
              aria-label="Salin alamat email Raden Alberto"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />
                  <span>Salin Email</span>
                </>
              )}
            </button>

            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil GitHub Raden Alberto"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-700 dark:text-slate-200 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-wide text-slate-500 dark:text-slate-400">
            <span>UNTAR · Jakarta Barat</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#3B82F6] dark:text-[#06B6D4]">
              Terbuka Magang IT / MBKM (Des 2026 – Jun 2027)
            </span>
          </div>
        </div>

        {/* Right: Clean Circular Portrait Frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-[260px] sm:w-[310px] lg:w-[350px] aspect-square rounded-full border border-slate-300 dark:border-white/20 ring-1 ring-[#3B82F6]/25 dark:ring-[#06B6D4]/30 ring-offset-4 ring-offset-[#F8FAFC] dark:ring-offset-[#090A0F] bg-gradient-to-b from-slate-100 via-white to-slate-200/70 dark:from-[#161A29] dark:via-[#11131C] dark:to-[#0B0D14] overflow-hidden shadow-sm">
            {!photoFailed ? (
              <img
                src={PROFILE.photoUrl}
                alt={`Foto profil ${PROFILE.fullName}`}
                referrerPolicy="no-referrer"
                onError={() => setPhotoFailed(true)}
                className="w-full h-full object-cover object-[50%_70%] scale-[1.16] origin-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-3">
                <div className="w-20 h-20 rounded-full border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/5 flex items-center justify-center text-[#3B82F6] dark:text-[#06B6D4]">
                  <User className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                    {PROFILE.shortName}
                  </p>
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    Taruh foto di <span className="text-[#3B82F6] dark:text-[#06B6D4]">public/foto-profil.jpeg</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
